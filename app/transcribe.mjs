// Voice messages -> text, fully local (Whisper via transformers.js + bundled ffmpeg). First use downloads the model once (~150 MB) into data/models.
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import { pipeline, env } from '@huggingface/transformers'

env.cacheDir = path.resolve('models')
const MODEL = 'Xenova/whisper-base'
const LANG = { pt: 'portuguese', en: 'english', es: 'spanish', fr: 'french', de: 'german', it: 'italian' }
let pipe = null

const load = () => (pipe ??= pipeline('automatic-speech-recognition', MODEL))
export const warmUp = () => load().catch(() => { pipe = null })

// file: any audio WhatsApp sends (ogg/opus, m4a...). lang: code from config.json (pt, en, ...)
export async function transcribe(file, lang = 'pt') {
  const r = spawnSync(ffmpegPath, ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], { maxBuffer: 1 << 29 })
  if (r.status !== 0 || !r.stdout.length) throw new Error('ffmpeg: ' + String(r.stderr).slice(0, 200))
  const raw = Buffer.from(r.stdout)
  const audio = new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength))
  const p = await load()
  const out = await p(audio, { language: LANG[lang] || 'portuguese', task: 'transcribe', chunk_length_s: 30 })
  return (out.text || '').trim()
}
