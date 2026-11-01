// __START.bat entry: main panel, setup wizard, first-time WhatsApp pairing, then launches the tray robot (bridge + Claude terminal) hidden.
// UI: one centered question per screen (screen is cleared between questions).
import readline from 'node:readline/promises'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { LANGS, tr } from './i18n.mjs'

process.noDeprecation = true // hide Node warnings (they would mess up the clean screens)
const APP = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(APP, '..', 'data')
fs.mkdirSync(path.join(DATA, 'logs'), { recursive: true })
process.chdir(DATA)
const CFG = 'config.json'
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------- terminal look (ANSI colors + box drawing, everything centered)
const c = (n, s) => `\x1b[${n}m${s}\x1b[0m`
const fg = (n, s) => `\x1b[38;5;${n}m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`
const dim = (s) => c(2, s)
const GREEN = 84, CYAN = 51, YELLOW = 221, PINK = 213, GRAY = 245, RED = 203, WHITE = 255
const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '')
const cols = () => process.stdout.columns || 80
const padFor = (w) => ' '.repeat(Math.max(0, (cols() - w) >> 1))
const cl = (s = '') => console.log(padFor(strip(s).length) + s) // centered line
const block = (lines) => { // centered as a block (keeps columns aligned)
  const w = Math.max(...lines.map((l) => strip(l).length))
  lines.forEach((l) => console.log(padFor(w) + l))
}
const cls = () => process.stdout.write('\x1b[2J\x1b[3J\x1b[H')
const W = 58

function header(name) {
  const title = 'CLAUDE  ×  WHATSAPP'
  const left = Math.floor((W - title.length) / 2)
  block([
    fg(CYAN, '╔' + '═'.repeat(W) + '╗'),
    fg(CYAN, '║') + ' '.repeat(left) + fg(PINK, bold(title)) + ' '.repeat(W - title.length - left) + fg(CYAN, '║'),
    fg(CYAN, '╚' + '═'.repeat(W) + '╝'),
  ])
  if (name) cl(fg(GRAY, `bot: ${name}`))
}
function banner(name) {
  cls()
  const robot = ['  ▄▄▄▄▄▄▄  ', '▄█████████▄', '██ ●   ● ██', '██  ▬▬▬  ██', ' ▀███████▀ ']
  console.log()
  block(robot.map((r) => fg(GREEN, r)))
  console.log()
  header(name)
  console.log()
}
const ok = (s) => cl(fg(GREEN, '√ ') + s)
const warn = (s) => cl(fg(RED, '× ') + s)
const ctx = { step: 0, total: 0, title: '' }
const section = (n, total, title) => { ctx.step = n; ctx.total = total; ctx.title = title }
const dots = () => Array.from({ length: ctx.total }, (_, i) => (i < ctx.step ? fg(GREEN, '●') : fg(GRAY, '○'))).join(' ')

const load = () => (fs.existsSync(CFG) ? JSON.parse(fs.readFileSync(CFG, 'utf8')) : {})
const cfg = {
  language: 'pt', botName: 'Claude', group: 'Claude_bot', number: '', baseDir: path.resolve(APP, '..', '..').replace(/\\/g, '/'),
  autoRun: false, interativo: true, permissionMode: 'bypassPermissions',
  accounts: [{ name: 'Conta 1', email: '', dir: '' }], allowed: [], ...load(),
}
const configured = fs.existsSync(CFG) && !!cfg.number
const saveCfg = () => fs.writeFileSync(CFG, JSON.stringify(cfg, null, 2))

// One question per screen: clear, centered title/question, default value, optional extra lines, then the input.
async function ask(text, def, o = {}) {
  cls()
  console.log()
  header()
  console.log()
  if (ctx.step) { cl(dots()); cl(fg(GRAY, `${ctx.step}/${ctx.total}  ${ctx.title}`)); console.log() }
  console.log()
  cl(bold(fg(WHITE, text)))
  if (def !== '' && def !== undefined) cl(fg(YELLOW, `( ${def} )`))
  if (o.lines && o.lines.length) { console.log(); block(o.lines) }
  console.log()
  const pad = padFor(8)
  const a = (await rl.question(`${pad}${fg(PINK, '»')} `, o.signal ? { signal: o.signal } : undefined)).trim()
  return a || (def === undefined ? '' : String(def))
}

// ---------- Claude Code prerequisite + accounts
const claudeEnv = (dir) => ({ ...process.env, CLAUDE_CONFIG_DIR: dir ? path.resolve(dir) : path.join(os.homedir(), '.claude') })
const hasClaude = () => spawnSync('claude', ['--version'], { shell: true, stdio: 'ignore' }).status === 0
function authStatus(dir) {
  const r = spawnSync('claude', ['auth', 'status'], { env: claudeEnv(dir), shell: true, encoding: 'utf8' })
  try { return JSON.parse(r.stdout) } catch { return {} }
}
async function yesNo(text, t, defYes = false, lines) {
  const a = (await ask(`${text}  [${t.yn}]`, defYes ? t.yn.split('/')[0] : t.yn.split('/')[1], { lines })).toLowerCase()
  return t.yes.includes(a[0] || '#')
}
async function ensureClaude(t) {
  if (hasClaude()) return
  if (!(await yesNo(t.claudeMissing, t))) return
  cls(); console.log(); header(); console.log()
  cl(fg(CYAN, t.claudeInstalling)); console.log()
  const r = spawnSync('npm', ['install', '-g', '@anthropic-ai/claude-code'], { shell: true, stdio: 'inherit' })
  if (r.status !== 0 || !hasClaude()) { warn(t.claudeFail); await sleep(3000) }
}
async function accountsStep(t) {
  const prev = cfg.accounts || []
  let n = parseInt(await ask(t.acctCount, String(Math.max(1, prev.length))), 10)
  if (!(n >= 1)) n = 1
  const accounts = []
  for (let i = 1; i <= n; i++) {
    const old = prev[i - 1] || {}
    const email = (await ask(t.acctEmail(i), old.email || '')).trim().toLowerCase()
    const dir = old.email === email ? old.dir : `accounts/conta${i}`
    accounts.push({ name: t.acctName(i), email, dir })
    if (!email) continue
    const st0 = authStatus(dir)
    if (st0.loggedIn && (st0.email || '').toLowerCase() === email) { cls(); console.log(); header(); console.log(); ok(t.acctAlready(email)); await sleep(1500); continue }
    for (;;) {
      await ask(t.acctEnter, '', { lines: [fg(CYAN, t.acctLoginNow(email)), '', fg(GRAY, t.acctTip)] })
      fs.mkdirSync(path.resolve(dir || '.'), { recursive: true })
      const child = spawn('claude', ['auth', 'login', '--email', email], { env: claudeEnv(dir), shell: true, stdio: 'ignore' })
      const ac = new AbortController()
      const exited = new Promise((r) => child.on('exit', () => { ac.abort(); r() }))
      const waiting = ask(t.acctAfter, '', { signal: ac.signal }).catch(() => {})
      await Promise.race([exited, waiting])
      spawnSync('taskkill', ['/F', '/T', '/PID', String(child.pid)], { stdio: 'ignore' })
      const st = authStatus(dir)
      cls(); console.log(); header(); console.log()
      if (st.loggedIn && (st.email || '').toLowerCase() === email) { ok(bold(t.acctOk(email))); await sleep(1800); break }
      warn(t.acctFail)
      await sleep(1200)
      if (!(await yesNo(t.acctRetry, t, true))) break
    }
  }
  cfg.accounts = accounts
}

// ---------- phone numbers (country + area + number) and authorized people
function splitPhone(n) {
  n = String(n || '')
  if (n.startsWith('55') && n.length >= 12) return { cc: '55', ddd: n.slice(2, 4), local: n.slice(4) }
  return { cc: '55', ddd: '', local: '' }
}
async function askPhone(t, defFull) {
  const d = splitPhone(defFull)
  for (;;) {
    let cc = (await ask(t.numCountry, d.cc)).replace(/\D/g, '')
    if (cc.length > 4) return cc // typed the whole number at once: accept it
    const ddd = (await ask(t.numArea, d.ddd, { lines: [fg(GRAY, `+${cc}`)] })).replace(/\D/g, '')
    const loc = (await ask(t.numLocal, d.local, { lines: [fg(GRAY, `+${cc} (${ddd})`)] })).replace(/\D/g, '')
    const full = cc + ddd + loc
    if (loc && full.length >= 10 && full.length <= 15) return full
    cls(); console.log(); header(); console.log(); warn(t.numInvalid); await sleep(1800)
  }
}
async function numbersMenu(t) {
  cfg.allowed = cfg.allowed || []
  for (;;) {
    cls(); console.log(); header(); console.log()
    cl(bold(fg(YELLOW, t.numTitle))); console.log()
    const rows = [`${fg(GREEN, '●')} +${cfg.number} ${dim(t.numYou)}`]
    cfg.allowed.forEach((a, i) => rows.push(`${fg(GREEN, '●')} ${fg(GRAY, i + 1 + ')')} +${a.number}${a.name ? '  ' + bold(a.name) : ''}`))
    if (!cfg.allowed.length) rows.push(dim(t.numNone))
    block(rows); console.log()
    block([`${fg(PINK, '1')}) ${t.numAdd}`, `${fg(PINK, '2')}) ${t.numRemove}`, `${fg(PINK, '0')}) ${t.numBack}`]); console.log()
    const a = (await rl.question(`${padFor(8)}${fg(PINK, '»')} `)).trim()
    if (a === '1') {
      section(0, 0, '')
      const number = await askPhone(t, '')
      if (number === cfg.number || cfg.allowed.some((x) => x.number === number)) { cls(); console.log(); header(); console.log(); warn(t.numDup); await sleep(1800); continue }
      const name = await ask(t.numName, '')
      const addToGroup = await yesNo(t.numAddGroup, t, true)
      cfg.allowed.push({ number, name, addToGroup, added: false })
      saveCfg()
      cls(); console.log(); header(); console.log()
      ok(t.numAdded(number))
      if (!addToGroup) { console.log(); cl(dim(t.numGroupHint)) }
      await sleep(2800)
    } else if (a === '2' && cfg.allowed.length) {
      const i = parseInt(await ask(t.numWhich, '1'), 10) - 1
      if (cfg.allowed[i]) { cfg.allowed.splice(i, 1); saveCfg(); cls(); console.log(); header(); console.log(); ok(t.numRemoved); await sleep(1500) }
    } else return
  }
}

async function wizard() {
  const tot = 5
  section(1, tot, 'Language / Idioma')
  const cur = Math.max(0, LANGS.findIndex((l) => l.code === cfg.language)) + 1
  const list = LANGS.map((l, i) => (i + 1 === cur ? fg(GREEN, '●') : fg(GRAY, '○')) + ' ' + fg(i + 1 === cur ? GREEN : GRAY, String(i + 1)) + fg(GRAY, ')') + ' ' + (i + 1 === cur ? bold(l.name) : l.name))
  const pick = parseInt(await ask('Select language  /  Selecione o idioma', String(cur), { lines: list }), 10)
  cfg.language = (LANGS[pick - 1] || LANGS[cur - 1]).code
  const t = tr(cfg.language)
  section(2, tot, t.botName.replace(/:$/, ''))
  cfg.botName = (await ask(t.botName, cfg.botName)).replace(/^\[|\]$/g, '')
  section(3, tot, t.group.replace(/:$/, ''))
  cfg.group = await ask(t.group, cfg.group)
  section(4, tot, t.number.replace(/\(.*\)/, '').replace(/:$/, ''))
  cfg.number = await askPhone(t, cfg.number)
  section(5, tot, t.acctTitle)
  await ensureClaude(t)
  await accountsStep(t)
  saveCfg()
  section(0, 0, '')
  if (await yesNo(t.numAskNow, t)) await numbersMenu(t)
  cls(); console.log(); header(); console.log()
  ok(bold(t.saved))
  await sleep(1500)
}

const killOld = () =>
  spawnSync('powershell', ['-NoProfile', '-Command',
    "Get-CimInstance Win32_Process | ? { ($_.CommandLine -match 'tray.ps1') -or ($_.Name -eq 'node.exe' -and $_.CommandLine -match 'bridge.mjs') -or ($_.CommandLine -match 'NoExit') } | % { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"])

function codeBox(code) {
  const inner = '   ' + code.split('').join(' ') + '   '
  block([
    fg(YELLOW, '╔' + '═'.repeat(inner.length) + '╗'),
    fg(YELLOW, '║') + bold(fg(GREEN, inner)) + fg(YELLOW, '║'),
    fg(YELLOW, '╚' + '═'.repeat(inner.length) + '╝'),
  ])
}

async function pairIfNeeded(t) {
  try { if (JSON.parse(fs.readFileSync('auth/creds.json', 'utf8')).registered) return true } catch {}
  cls(); console.log(); header(); console.log()
  cl(fg(CYAN, t.pairIntro)); console.log()
  fs.rmSync('auth', { recursive: true, force: true })
  const child = spawn('node', [path.join(APP, 'bridge.mjs')], { env: { ...process.env, PAIR: cfg.number } })
  let spin = null
  const stopSpin = () => { if (spin) { clearInterval(spin); spin = null } }
  return await new Promise((resolve) => {
    const timer = setTimeout(() => { stopSpin(); child.kill(); resolve(false) }, 5 * 60 * 1000)
    let buf = ''
    child.stdout.on('data', (d) => {
      buf += d
      for (const l of buf.split('\n')) {
        if (l.startsWith('PAIR_CODE')) {
          cl(bold(t.pairCode)); console.log()
          codeBox(l.slice(10).trim())
          console.log()
          const frames = ['|', '/', '-', String.fromCharCode(92)]
          let k = 0
          const msg = ' ' + t.pairWait
          spin = setInterval(() => process.stdout.write('\r' + padFor(msg.length + 1) + fg(CYAN, frames[k++ % frames.length]) + dim(msg)), 100)
          buf = ''
        }
        if (l.startsWith('CONNECTED')) { clearTimeout(timer); stopSpin(); console.log('\n'); ok(bold(t.connected)); child.kill(); resolve(true) }
      }
    })
  })
}

async function main() {
  let action = 'start'
  if (!configured) action = 'reconf'
  else {
    for (;;) {
      const t = tr(cfg.language)
      banner(cfg.botName)
      cl(bold(fg(YELLOW, t.menuTitle))); console.log()
      block([
        `${fg(GREEN, '1')}) ${bold(t.menuStart)}`,
        `${fg(CYAN, '2')}) ${t.menuReconf}`,
        `${fg(CYAN, '3')}) ${t.menuNumbers}`,
        `${fg(GRAY, '0')}) ${t.menuQuit}`,
      ])
      console.log()
      cl(fg(YELLOW, `( 1 )`))
      let a = '1'
      try { a = (await rl.question(`${padFor(8)}${fg(PINK, '»')} `, { signal: AbortSignal.timeout(10000) })).trim() || '1' } catch { console.log() }
      if (a === '2') { action = 'reconf'; break }
      if (a === '3') { await numbersMenu(t); continue }
      if (a === '0') process.exit(0)
      break
    }
  }
  if (action === 'reconf') await wizard()
  const t = tr(cfg.language)
  killOld()
  await sleep(1500)
  if (!(await pairIfNeeded(t))) { warn(t.pairFail); await sleep(8000); process.exit(1) }
  killOld()
  cls(); console.log(); header(cfg.botName); console.log()
  ok(bold(t.starting))
  spawn('wscript.exe', [path.join(APP, 'launch.vbs')], { detached: true, stdio: 'ignore' }).unref()
  rl.close()
  setTimeout(() => process.exit(0), 3500)
}
main()
