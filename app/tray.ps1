# Robot icon in the system tray: starts the WhatsApp bridge hidden and shows its status.
# green = connected, yellow = connecting, red = stopped.
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
$app = $PSScriptRoot
$root = Split-Path $app -Parent
$dir = Join-Path $root 'data'
$log = Join-Path $dir 'logs\bridge.log'
$mutex = New-Object System.Threading.Mutex($false, 'Local\ClaudeWABridgeTray')
if (-not $mutex.WaitOne(0)) { exit }

function New-RobotIcon([System.Drawing.Color]$c) {
  $bmp = New-Object System.Drawing.Bitmap 32, 32
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $dark = [System.Drawing.Color]::FromArgb(40, 44, 58)
  $pen = New-Object System.Drawing.Pen $dark, 2
  $g.DrawLine($pen, 16, 9, 16, 4)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $c), 12, 0, 8, 8)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $c), 4, 9, 24, 19)
  $g.DrawRectangle($pen, 4, 9, 24, 19)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $dark), 0, 15, 3, 7)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $dark), 29, 15, 3, 7)
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $g.FillEllipse($white, 8, 13, 7, 7)
  $g.FillEllipse($white, 18, 13, 7, 7)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $dark), 10, 15, 3, 3)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $dark), 20, 15, 3, 3)
  $g.DrawLine($pen, 11, 24, 21, 24)
  return [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
}
$icons = @{
  green  = New-RobotIcon ([System.Drawing.Color]::FromArgb(70, 210, 110))
  yellow = New-RobotIcon ([System.Drawing.Color]::FromArgb(245, 200, 60))
  red    = New-RobotIcon ([System.Drawing.Color]::FromArgb(235, 80, 80))
}

Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public class WinApi {
  delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] static extern bool EnumWindows(EnumProc p, IntPtr l);
  [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] static extern int GetWindowTextLength(IntPtr h);
  // top-level window (visible or not) that belongs to the given process
  public static IntPtr FindByPid(uint pid) {
    IntPtr found = IntPtr.Zero;
    EnumWindows((h, l) => {
      uint p; GetWindowThreadProcessId(h, out p);
      if (p == pid && GetWindowTextLength(h) > 0) { found = h; return false; }
      return true;
    }, IntPtr.Zero);
    return found;
  }
}
'@
$cfg = Get-Content (Join-Path $dir 'config.json') -Raw | ConvertFrom-Json

# Claude Code terminal (classic console window we can show/hide from the tray)
$script:term = $null
$script:wantHidden = $true
# the console window belongs to the powershell child of conhost, so look at the whole small process tree
function Find-Term {
  $ids = @(Get-CimInstance Win32_Process -Filter "ParentProcessId=$($script:term.Id)" | ForEach-Object { $_.ProcessId }) + @($script:term.Id)
  foreach ($i in $ids) { $h = [WinApi]::FindByPid([uint32]$i); if ($h -ne [IntPtr]::Zero) { return $h } }
  return [IntPtr]::Zero
}
function Start-Terminal {
  $startup = "Leia Claude-WA-Bridge/app/INSTRUCOES.md e Claude-WA-Bridge/data/config.json (botName, language) (Desktop) e siga: inicie o monitor do WhatsApp e fique pronto. Seu nome no WhatsApp: $($cfg.botName). Idioma das respostas no WhatsApp: $($cfg.language)."
  $mode = $cfg.permissionMode
  $inner = "Set-Location -LiteralPath '$($cfg.baseDir)'; `$host.UI.RawUI.WindowTitle='Claude (WhatsApp)'; claude --permission-mode $mode '$startup'"
  $script:term = Start-Process conhost.exe -ArgumentList "powershell.exe -NoExit -NoProfile -Command `"$inner`"" -PassThru
  $script:wantHidden = $true  # the timer below keeps it hidden until the user asks to see it
}
function Toggle-Terminal([object]$show) {
  if (-not $script:term -or $script:term.HasExited) { Start-Terminal }
  $h = (Find-Term)
  if ($h -eq [IntPtr]::Zero) { return }
  $visible = [WinApi]::IsWindowVisible($h)
  if ($null -eq $show) { $show = -not $visible }
  $script:wantHidden = -not $show
  if ($show) { [WinApi]::ShowWindow($h, 5) | Out-Null; [WinApi]::ShowWindow($h, 9) | Out-Null; [WinApi]::SetForegroundWindow($h) | Out-Null }
  else { [WinApi]::ShowWindow($h, 0) | Out-Null }
}

$script:proc = $null
function Start-Bridge {
  $script:proc = Start-Process node -ArgumentList ('"' + (Join-Path $app 'bridge.mjs') + '"') -WorkingDirectory $dir -WindowStyle Hidden `
    -RedirectStandardOutput $log -RedirectStandardError (Join-Path $dir 'logs\bridge.err.log') -PassThru
}
function Stop-Bridge {
  if ($script:proc -and -not $script:proc.HasExited) { Stop-Process -Id $script:proc.Id -Force }
}

$ni = New-Object System.Windows.Forms.NotifyIcon
$ni.Icon = $icons.yellow
$ni.Text = 'Claude WhatsApp: iniciando...'
$ni.Visible = $true
$menu = New-Object System.Windows.Forms.ContextMenuStrip
# one entry that flips between "Mostrar" and "Esconder" depending on the window state
$toggleItem = $menu.Items.Add('Mostrar Claude (terminal)', $null, { Toggle-Terminal $null })
$menu.Add_Opening({
  $visible = $false
  if ($script:term -and -not $script:term.HasExited) {
    $h = (Find-Term)
    if ($h -ne [IntPtr]::Zero) { $visible = [WinApi]::IsWindowVisible($h) }
  }
  $toggleItem.Text = if ($visible) { 'Esconder Claude (terminal)' } else { 'Mostrar Claude (terminal)' }
})
$null = $menu.Items.Add('-')
$null = $menu.Items.Add('Ver log', $null, { Start-Process notepad.exe $log })
$null = $menu.Items.Add('Abrir pasta', $null, { Start-Process explorer.exe $root })
$null = $menu.Items.Add('Reiniciar ponte', $null, { Stop-Bridge; Start-Sleep 1; Start-Bridge })
$null = $menu.Items.Add('Sair (desligar tudo)', $null, {
  Stop-Bridge
  if ($script:term -and -not $script:term.HasExited) { Stop-Process -Id $script:term.Id -Force }
  $ni.Visible = $false; [System.Windows.Forms.Application]::Exit()
})
$ni.ContextMenuStrip = $menu
$ni.Add_DoubleClick({ Toggle-Terminal $null })

Start-Bridge
if ($cfg.interativo) { Start-Terminal }
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 700
$timer.Add_Tick({
  if ($script:wantHidden -and $script:term -and -not $script:term.HasExited) {
    try {
      $th = (Find-Term)
      if ($th -ne [IntPtr]::Zero -and [WinApi]::IsWindowVisible($th)) { [WinApi]::ShowWindow($th, 0) | Out-Null }
    } catch { Add-Content (Join-Path $dir 'logs\tray.err.log') ([string]$_) }
  }
  if (-not $script:proc -or $script:proc.HasExited) {
    $ni.Icon = $icons.red; $ni.Text = 'Claude WhatsApp: parado (reiniciando)'
    Start-Bridge
    return
  }
  $state = 'yellow'
  try {
    $lines = Get-Content $log -Tail 200 -ErrorAction Stop | Where-Object { $_ -match '^(CONNECTED|CLOSED|LOGGED_OUT|PAIR_CODE)' }
    $last = $lines | Select-Object -Last 1
    if ($last -match '^CONNECTED') { $state = 'green' }
    elseif ($last -match '^(LOGGED_OUT|PAIR_CODE)') { $state = 'red' }
  } catch {}
  $ni.Icon = $icons[$state]
  $ni.Text = @{ green = 'Claude WhatsApp: conectado'; yellow = 'Claude WhatsApp: conectando...'; red = 'Claude WhatsApp: precisa parear de novo' }[$state]
})
$timer.Start()
[System.Windows.Forms.Application]::Run()
Stop-Bridge
