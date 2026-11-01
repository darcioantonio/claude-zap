# Makes the START window bigger/readable: larger font + a fixed window size (works in the classic console window).
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class ConFont {
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
  public struct CONSOLE_FONT_INFOEX {
    public uint cbSize; public uint nFont; public short X; public short Y;
    public int FontFamily; public int FontWeight;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)] public string FaceName;
  }
  [DllImport("kernel32.dll", SetLastError = true)] public static extern IntPtr GetStdHandle(int n);
  [DllImport("kernel32.dll", SetLastError = true)] public static extern bool SetCurrentConsoleFontEx(IntPtr h, bool max, ref CONSOLE_FONT_INFOEX f);
  public static void Set(short size) {
    var f = new CONSOLE_FONT_INFOEX();
    f.cbSize = (uint)Marshal.SizeOf(typeof(CONSOLE_FONT_INFOEX));
    f.X = 0; f.Y = size; f.FontFamily = 54; f.FontWeight = 400; f.FaceName = "Consolas";
    SetCurrentConsoleFontEx(GetStdHandle(-11), false, ref f);
  }
}
'@
[ConFont]::Set(26)
