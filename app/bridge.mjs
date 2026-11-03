// Claude WhatsApp bridge: links as a device, streams new messages of group "Claude_bot" to stdout,
// and exposes a localhost HTTP API to send text/files back.
//   POST http://127.0.0.1:8765/send  {"text":"...", "group":"<name, optional>"}
//   POST http://127.0.0.1:8765/file  {"path":"C:\\x.apk","caption":"...", "group":"<optional>"}
// Extra routes (all accept "group"; default = the main group): /voice {path}, /poll {question,options,multi},
//   /react {id,emoji}, /group/icon {path}, /group/rename {name}, /group/description {text},
//   /group/add {numbers}, /group/remove {numbers}, /group/create {name,numbers,dir}, GET /groups
// Extra groups to listen to: config.json "groups": [{"name":"Colheita-feliz","dir":"C:/.../plantinha"}]
import makeWASocket, { useMultiFileAuthState, DisconnectReason, downloadMediaMessage, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import QRCode from 'qrcode'
import pino from 'pino'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { enqueue } from './runner.mjs'
import { transcribe, warmUp } from './transcribe.mjs'
import { fileURLToPath } from 'node:url'

process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data')) // config, auth, inbox, logs live in data/

const cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'))

const GROUP = cfg.group
const EXTRA = (cfg.groups || []).filter((g) => g && g.name)       // outros grupos (cada um pode ter a pasta do projeto)
const digits = (x) => String(x || '').replace(/\D/g, '')
const allowedNums = new Map((cfg.allowed || []).map((a) => [digits(a.number), a.name || '']))

// phone number of whoever wrote the message (group senders may come as @lid ids)
async function senderNumber(m) {
  if (m.key.fromMe) return digits(cfg.number)
  const jid = m.key.participantPn || m.key.participantAlt || m.key.participant || ''
  let num = jid.split('@')[0].split(':')[0]
  if (jid.endsWith('@lid')) {
    try {
      const pn = await sock.signalRepository?.lidMapping?.getPNForLID?.(jid)
      if (pn) num = pn.split('@')[0].split(':')[0]
    } catch {}
  }
  return digits(num)
}

// add authorized people to the WhatsApp group (once each, if they asked for it)
async function syncGroupMembers() {
  for (const a of cfg.allowed || []) {
    if (!a.addToGroup || a.added) continue
    try {
      await sock.groupParticipantsUpdate(groupJid, [digits(a.number) + '@s.whatsapp.net'], 'add')
      const fresh = JSON.parse(fs.readFileSync('config.json', 'utf8'))
      const f = (fresh.allowed || []).find((x) => digits(x.number) === digits(a.number))
      if (f) { f.added = true; fs.writeFileSync('config.json', JSON.stringify(fresh, null, 2)) }
      out('ADDED_TO_GROUP', digits(a.number))
    } catch (e) { out('ERR', 'add to group ' + a.number + ': ' + String(e)) }
  }
}
const PORT = 8765
const log = pino({ level: process.env.DBG ? 'info' : 'silent' })
let sock = null
let groupJid = null                      // grupo principal
const byName = new Map()                  // nome do grupo -> jid
const byJid = new Map()                   // jid -> { name, dir }
const recentKeys = new Map()              // id da mensagem -> key (para reagir)
fs.mkdirSync('inbox', { recursive: true })
const out = (tag, obj) => {
  const line = tag + ' ' + (typeof obj === 'string' ? obj : JSON.stringify(obj))
  console.log(line)
  if (tag === 'MSG') { try { fs.appendFileSync(path.join('logs', 'mensagens.log'), Date.now() + ' ' + line + '\n') } catch {} } // permanent history (bridge.log is recreated on restart): Claude checks it against logs/feitas.log to resume unread requests
}

// keep only the last 48h of history so the logs never grow huge; feitas.log keeps only ids still present in mensagens.log
function pruneLogs() {
  try {
    const cut = Date.now() - 48 * 3600 * 1000
    const mf = path.join('logs', 'mensagens.log'), ff = path.join('logs', 'feitas.log')
    if (!fs.existsSync(mf)) return
    const keep = fs.readFileSync(mf, 'utf8').split('\n').filter((l) => l && Number(l.split(' ')[0]) >= cut)
    fs.writeFileSync(mf, keep.map((l) => l + '\n').join(''))
    if (fs.existsSync(ff)) {
      const ids = new Set(keep.map((l) => (l.match(/"id":"([^"]+)"/) || [])[1]))
      const k2 = fs.readFileSync(ff, 'utf8').split('\n').filter((l) => l && (l.startsWith('#') || ids.has(l.split(' | ')[0])))
      fs.writeFileSync(ff, k2.map((l) => l + '\n').join(''))
    }
  } catch {}
}
pruneLogs()
setInterval(pruneLogs, 3600 * 1000)

let retries = 0
async function start() {
  // new pairing (no saved login) = fresh start: archive old history so Claude does not try to redo old pending messages
  if (!fs.existsSync('auth/creds.json') && !globalThis.__archived) {
    globalThis.__archived = true
    try { fs.writeFileSync('since.txt', String(Math.floor(Date.now() / 1000))) } catch {} // from now on, ignore anything sent before this moment
    try {
      const dest = path.join('logs', 'arquivo-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'))
      let moved = false
      for (const f of ['mensagens.log', 'feitas.log']) {
        const p = path.join('logs', f)
        if (fs.existsSync(p) && fs.statSync(p).size > 0) { fs.mkdirSync(dest, { recursive: true }); fs.renameSync(p, path.join(dest, f)); moved = true }
      }
      if (moved) out('RESET', 'new pairing: old history archived in ' + dest)
    } catch (e) { out('ERR', String(e)) }
  }
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const { version } = await fetchLatestBaileysVersion()
  sock = makeWASocket({ version, auth: state, logger: log, browser: ['Ubuntu', 'Chrome', '22.04.4'], syncFullHistory: false, markOnlineOnConnect: false })
  // every message we send gets "<robot> <botName>: " in front (callers send plain text)
  const rawSend = sock.sendMessage.bind(sock)
  const PREFIX = '\u{1F916} ' + (cfg.botName || 'Claude') + ': '
  const deco = (t) => (typeof t === 'string' && !t.startsWith(PREFIX) ? PREFIX + t.replace(/^\[Claude\]:?\s*/, '') : t)
  // anti-ban: all sends go through one queue with a random human-like gap and a "typing..." presence
  const rnd = (a, b) => a + Math.random() * (b - a)
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  let sendChain = Promise.resolve()
  sock.sendMessage = (jid, c, o) => {
    if (c.text) c = { ...c, text: deco(c.text) }
    if (c.caption) c = { ...c, caption: deco(c.caption) }
    const job = sendChain.then(async () => {
      try {
        if (!c.react) { await sock.sendPresenceUpdate(c.audio ? 'recording' : 'composing', jid); await sleep(rnd(800, 2200) + Math.min((c.text || '').length * 15, 3000)) }
      } catch {}
      const r = await rawSend(jid, c, o)
      try { await sock.sendPresenceUpdate('paused', jid) } catch {}
      await sleep(rnd(1200, 3000))
      return r
    })
    sendChain = job.catch(() => {})
    return job
  }
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (u) => {
    if (u.qr && (process.env.PAIR || (!fs.existsSync('auth/creds.json') ? cfg.number : '')) && !sock.__paired) {
      sock.__paired = true
      try { out('PAIR_CODE', await sock.requestPairingCode((process.env.PAIR || (!fs.existsSync('auth/creds.json') ? cfg.number : '')))) } catch (e) { out('ERR', String(e)) }
    }
    if (u.qr && !(process.env.PAIR || (!fs.existsSync('auth/creds.json') ? cfg.number : ''))) {
      await QRCode.toFile('qr.png', u.qr, { scale: 8, margin: 2 })
      out('QR_READY', path.resolve('qr.png'))
    }
    if (u.connection === 'open') {
      try {
        let groups, tries = 0
        for (;;) { // WhatsApp answers rate-overlimit right after pairing: wait and retry instead of giving up with no group
          try { groups = await sock.groupFetchAllParticipating(); break } catch (e) {
            if (++tries > 6 || !/rate-overlimit/.test(String(e))) throw e
            out('WAIT', 'rate-overlimit fetching groups, retry in ' + 60 * tries + 's')
            await new Promise((r) => setTimeout(r, 60000 * tries))
          }
        }
        const all = Object.values(groups)
        const g = all.find((x) => x.subject === GROUP)
        groupJid = g ? g.id : null
        byName.clear(); byJid.clear()
        if (g) { byName.set(GROUP, g.id); byJid.set(g.id, { name: GROUP, dir: cfg.baseDir || '' }) }
        for (const e of EXTRA) {
          const x = all.find((y) => y.subject === e.name)
          if (x) { byName.set(e.name, x.id); byJid.set(x.id, { name: e.name, dir: e.dir || '' }) }
        }
      } catch (e) { out('ERR', String(e)) }
      retries = 0
      out('CONNECTED', { group: groupJid, groups: [...byName.keys()] })
      if (groupJid) syncGroupMembers()
      warmUp() // load the speech model in the background so the first voice message is fast
    }
    if (u.connection === 'close') {
      const code = u.lastDisconnect?.error?.output?.statusCode
      out('CLOSED', { code })
      if (code !== DisconnectReason.loggedOut) { retries++; setTimeout(start, Math.min(2000 * 2 ** (retries - 1), 60000) + Math.random() * 1000) }
      else out('LOGGED_OUT', 'delete auth/ and restart')
    }
  })
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    for (const m of messages) {
      try {
        const grp = byJid.get(m.key.remoteJid)
        if (!m.message || !grp) continue
        if (m.message.reactionMessage || m.message.protocolMessage) continue // reactions (incl. our own auto-seen mark) are not requests; reacting to them would loop
        const mm = m.message
        const text = mm.conversation || mm.extendedTextMessage?.text || mm.imageMessage?.caption || mm.documentMessage?.caption || mm.videoMessage?.caption || ''
        if (text.startsWith('\u{1F916} ') || text.startsWith('[Claude]')) continue
        if (type !== 'notify') continue
        let since = 0
        try { since = Number(fs.readFileSync('since.txt', 'utf8')) || 0 } catch {}
        if (since && Number(m.messageTimestamp?.low ?? m.messageTimestamp ?? 0) < since) continue // older than the last reset/pairing: never read it
        const from = await senderNumber(m)
        if (!m.key.fromMe && !allowedNums.has(from)) { out('IGNORED', { from }); continue } // only the owner and authorized numbers
        const ev = { id: m.key.id, group: grp.name, dir: grp.dir, fromMe: !!m.key.fromMe, authorized: true, from, who: allowedNums.get(from) || '', text }
        recentKeys.set(m.key.id, m.key)
        if (recentKeys.size > 300) recentKeys.delete(recentKeys.keys().next().value)
        setTimeout(() => sock.readMessages([m.key]).catch(() => {}), 1000 + Math.random() * 2500) // human-like read receipt instead of an instant bot reaction
        const media = mm.imageMessage || mm.documentMessage || mm.videoMessage || mm.audioMessage
        if (media) {
          const buf = await downloadMediaMessage(m, 'buffer', {}, { logger: log, reuploadRequest: sock.updateMediaMessage })
          const ext = (media.mimetype || '').split('/')[1]?.split(';')[0] || 'bin'
          const p = path.resolve('inbox', m.key.id + '.' + (media.fileName?.split('.').pop() || ext))
          fs.writeFileSync(p, buf)
          ev.file = p
          if (mm.audioMessage) { // voice message: turn it into text so Claude can read it
            ev.audio = true
            try { ev.text = await transcribe(p, cfg.language) } catch (e) { ev.text = ''; ev.transcribeError = String(e).slice(0, 160) }
            if (!ev.text) { out('MSG', { ...ev, text: '(audio could not be transcribed)' }); continue }
          }
        }
        out('MSG', ev)
        if (cfg.autoRun) enqueue(cfg, ev, (t) => sock.sendMessage(m.key.remoteJid, { text: t }))
      } catch (e) { out('ERR', String(e)) }
    }
  })
}

const MIMES = { '.apk': 'application/vnd.android.package-archive', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg; codecs=opus', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.pdf': 'application/pdf', '.zip': 'application/zip', '.txt': 'text/plain', '.json': 'application/json' }
const jidOf = (name) => {
  if (!name) return groupJid
  if (String(name).includes('@')) return name
  const j = byName.get(name)
  if (!j) throw new Error('unknown group: ' + name)
  return j
}
const jids = (nums) => (nums || []).map((n) => digits(n) + '@s.whatsapp.net')

const server = http.createServer((req, res) => {
  let body = ''
  req.on('data', (d) => (body += d))
  req.on('end', async () => {
    try {
      if (!sock) throw new Error('not connected')
      const j = body ? JSON.parse(body) : {}
      const url = (req.url || '').split('?')[0]
      let result = 'ok'
      if (url === '/groups') {
        const all = Object.values(await sock.groupFetchAllParticipating())
        result = JSON.stringify(all.map((g) => ({ name: g.subject, id: g.id, members: g.participants.length })))
      } else if (url === '/group/create') {
        const meta = await sock.groupCreate(j.name, jids(j.numbers))
        byName.set(j.name, meta.id)
        byJid.set(meta.id, { name: j.name, dir: j.dir || '' })
        out('GROUP_CREATED', { name: j.name, id: meta.id, dir: j.dir || '' })
        result = JSON.stringify({ id: meta.id })
      } else {
        const jid = jidOf(j.group)
        if (!jid) throw new Error('not connected')
        if (url === '/send') await sock.sendMessage(jid, { text: j.text })
        else if (url === '/file') {
          const buf = fs.readFileSync(j.path)
          const ext = path.extname(j.path).toLowerCase()
          const img = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)
          const vid = ['.mp4', '.mov'].includes(ext)
          const mime = MIMES[ext] || 'application/octet-stream'
          await sock.sendMessage(jid, img ? { image: buf, caption: j.caption || '' } : vid ? { video: buf, caption: j.caption || '' } : { document: buf, mimetype: mime, fileName: path.basename(j.path), caption: j.caption || '' })
        } else if (url === '/voice') {
          const enviado = await sock.sendMessage(jid, { audio: fs.readFileSync(j.path), mimetype: 'audio/ogg; codecs=opus', ptt: true })
          if (enviado?.key) await sock.sendMessage(jid, { react: { text: '\u{1F50A}', key: enviado.key } }).catch(() => {})   // owner rule: every audio from Claude gets a speaker reaction so it is clear who sent it
        } else if (url === '/poll') {
          await sock.sendMessage(jid, { poll: { name: j.question, values: j.options, selectableCount: j.multi ? j.options.length : 1 } })
        } else if (url === '/react') {
          const key = recentKeys.get(j.id)
          if (!key) throw new Error('unknown message id')
          await sock.sendMessage(jid, { react: { text: j.emoji || '\u{1F44D}', key } })
        } else if (url === '/group/icon') {
          await sock.updateProfilePicture(jid, fs.readFileSync(j.path))
        } else if (url === '/group/rename') {
          await sock.groupUpdateSubject(jid, j.name)
        } else if (url === '/group/description') {
          await sock.groupUpdateDescription(jid, j.text)
        } else if (url === '/group/add') {
          result = JSON.stringify(await sock.groupParticipantsUpdate(jid, jids(j.numbers), 'add'))
        } else if (url === '/group/remove') {
          result = JSON.stringify(await sock.groupParticipantsUpdate(jid, jids(j.numbers), 'remove'))
        } else throw new Error('bad route')
      }
      res.end(result)
    } catch (e) {
      res.statusCode = 500
      res.end(String(e))
    }
  })
})
server.listen(PORT, '127.0.0.1')
start()
