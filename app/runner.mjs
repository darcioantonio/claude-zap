// Runs each WhatsApp command through the Claude Code CLI (headless), rotating accounts when a usage limit is hit.
import { spawn } from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
import { tr } from './i18n.mjs'

const sysFor = (cfg) => `Seu nome no WhatsApp e ${cfg.botName || 'Claude'}. Responda SEMPRE no idioma com codigo '${cfg.language || 'pt'}'. Nao escreva prefixo/nome (o sistema coloca). ` + SYSTEM
const SYSTEM = 'Voce recebe pedidos por WhatsApp de um unico dono. Descubra pelo pedido em qual projeto/pasta trabalhar (sob a pasta atual) ou crie uma nova se for pedido. ' +
  'Execute o pedido de ponta a ponta. ESTILO: homem da caverna. Respostas MINIMAS, frases curtissimas, ate ~3 linhas/250 caracteres, sem introducao nem explicacao; listas so nomes em uma linha (max ~8). Detalhe so se o dono pedir. Para enviar arquivos/prints ao WhatsApp use: ' +
  'curl -s -X POST http://127.0.0.1:8765/file -d \'{"path":"C:\\\\caminho\\\\arquivo","caption":"..."}\' (texto: /send com {"text":"..."}).'
const LIMIT = /usage limit|limit reached|rate limit|quota|out of (extra )?usage|resets? (at|in)/i
const cooldown = new Map() // account index -> timestamp until usable
let queue = Promise.resolve()

function runClaude(cfg, acc, prompt) {
  return new Promise((resolve) => {
    const env = { ...process.env }
    env.CLAUDE_CONFIG_DIR = acc.dir ? path.resolve(acc.dir) : path.join(os.homedir(), '.claude')
    const args = ['-p', JSON.stringify(prompt), '--output-format', 'json', '--permission-mode', cfg.permissionMode || 'acceptEdits', '--append-system-prompt', JSON.stringify(sysFor(cfg))]
    const p = spawn('claude', args, { cwd: cfg.baseDir, env, shell: true, windowsHide: true })
    let out = '', err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => {
      let text = out, isErr = code !== 0
      try { const j = JSON.parse(out); text = j.result || ''; isErr = isErr || !!j.is_error } catch {}
      resolve({ code, text: (text || err).trim(), isErr, raw: out + err })
    })
  })
}

export function enqueue(cfg, ev, send) {
  queue = queue.then(() => handle(cfg, ev, send)).catch((e) => send(tr(cfg.language).err + e))
}

async function handle(cfg, ev, send) {
  const t = tr(cfg.language)
  for (let i = 0; i < cfg.accounts.length; i++) {
    if ((cooldown.get(i) || 0) > Date.now()) continue
    const acc = cfg.accounts[i]
    await send(t.using(acc.name, acc.email))
    const r = await runClaude(cfg, acc, ev.text + (ev.file ? `\n(arquivo recebido: ${ev.file})` : ''))
    if (r.isErr && LIMIT.test(r.raw)) {
      cooldown.set(i, Date.now() + 30 * 60 * 1000)
      await send(t.limit(acc.name))
      continue
    }
    if (r.isErr && /not logged in|login|authenticat|401/i.test(r.raw)) {
      cooldown.set(i, Date.now() + 10 * 60 * 1000)
      await send(t.relogin(acc.name, acc.email))
      continue
    }
    const txt = r.text || '...'
    for (let k = 0; k < txt.length; k += 3500) await send(txt.slice(k, k + 3500))
    return
  }
  await send(t.none)
}
