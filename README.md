<div align="center">

# 💬 claude-zap

### Send requests on WhatsApp. Claude does the work on your computer.

[![Windows](https://img.shields.io/badge/Windows-10%20%7C%2011-0078D4?style=for-the-badge&logo=windows&logoColor=white)](#-step-by-step-for-beginners)
[![Node.js](https://img.shields.io/badge/Node.js-auto--installed-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Claude](https://img.shields.io/badge/Claude-Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://claude.ai)
[![Install](https://img.shields.io/badge/install-1%20click-F59E0B?style=for-the-badge)](#-step-by-step-for-beginners)
[![Support](https://img.shields.io/badge/%E2%98%95-support%20the%20project-FF813F?style=for-the-badge)](#-support-the-project)

[🇧🇷 Português](README.pt-BR.md) · **🇺🇸 English** · [🇪🇸 Español](README.es.md) · [🇵🇱 Polski](README.pl.md)

</div>

---

## ✨ What is this

You type (or **record a voice note**) in a WhatsApp group, Claude understands it, **does the job on your computer** and answers right there in WhatsApp. Works from anywhere, even with your phone in hand.

| 📱 You | 🤖 The robot on your PC |
|---|---|
| *"Build a recipes website"* | Builds it, opens it, tells you |
| *"Send me a screenshot of the game"* | Takes it and sends it on WhatsApp |
| 🎤 A voice note | Understands your voice **locally on your PC** (your voice is not sent to the internet in this step) |

---

## ✅ What you need

| | |
|---|---|
| 🖥️ **Windows 10 or 11** | Turned on and online |
| 🧠 **A Claude account** | A paid plan (Pro or Max) **or** an Anthropic API key. Create one at <https://claude.ai>. **Without it the app installs, but Claude will not answer.** |
| 📱 **WhatsApp on your phone** | The app links to it like "WhatsApp Web" |
| 🌐 **Internet** | About 500 MB are downloaded the first time |

**No programming skills needed.** The `INSTALAR.bat` file does everything.

---

## 🚀 Step by step (for beginners)

### 1️⃣ Download
1. On this GitHub page click the green **`< > Code`** button.
2. Click **`Download ZIP`**.
3. Right-click the downloaded `.zip` → **`Extract all...`** → **`Extract`**.
4. **Move the folder to a fixed place** (e.g. `C:\Projects`) and don't move it again.

### 2️⃣ Install (one click)
1. **Double-click `INSTALAR.bat`** (it means "install").
2. If Windows shows *"Windows protected your PC"*: **`More info`** → **`Run anyway`**. (Normal for downloaded files. You can open `INSTALAR.bat` in Notepad first: it only installs Node.js, the components and Claude Code.)
3. Wait for the black window to finish. **Don't close it.**
4. If it says it installed **Node.js** and asks you to open it again: **close it and double-click `INSTALAR.bat` once more** (happens only once).
5. When you see **PRONTO!** ("ready"), press any key: the app opens.

### 3️⃣ Answer the questions
One per screen. When in doubt, **Enter** accepts the suggested value.
- **Language** of the answers · **Robot name** (can be *Claude*) · **Group name** (can be *Claude_bot*; it is created for you)
- **Your phone number** with country and area code, digits only. E.g. `15551234567`
- **Your Claude account**: a browser opens so you can sign in and authorize.

### 4️⃣ Link WhatsApp
1. The screen shows an **8-character code**.
2. On your phone: WhatsApp → **Linked devices** → **Link a device** → **Link with phone number instead**.
3. Type the code. Done! ✅

### 5️⃣ Use it
1. A little **robot** appears next to the Windows clock (sometimes inside the `^` arrow).
2. Open the group in WhatsApp and **type or record a voice note**.
3. **Right-click the robot**: show/hide the terminal, see logs, restart or quit.

> 🔁 **Next times:** just double-click **`__START.bat`**.

---

## 🔒 Security (please read!)

- 👤 **Only you control the robot.** Only messages from **your own number** are obeyed. To allow someone else, add their number to `allowed` in `data\config.json`.
- ⚠️ **Claude really changes things on your PC**, by default **without asking at every step**. Only ask for things you trust and **don't let others use your group**.
- 🔐 **Never share the `data` folder**: it holds your WhatsApp login. The `.gitignore` already keeps it out of GitHub; if you publish your own copy, **don't delete the `.gitignore`**.
- 🚫 Never send passwords, cards or documents through the robot.

---

## 🛠️ Common problems

| Problem | What to do |
|---|---|
| *"Node.js not found"* | Double-click `INSTALAR.bat`. If it persists, install Node.js **LTS** from <https://nodejs.org> and run it again. |
| Robot doesn't show up | Look inside the `^` arrow near the clock, or open `__START.bat`. |
| WhatsApp disconnected | `__START.bat` and redo step 4. |
| Robot doesn't answer | PC on? Internet? Claude account with a paid plan? Right-click the robot → **Restart**. |
| First voice note is slow | Normal: it downloads the robot's "ear" once (~150 MB). |
| Claude asks to log in | Right-click the robot → show terminal → follow the screen. |

Nothing worked? Open an **Issue** here describing what happened and pasting the error.

---

## 🆘 WhatsApp stopped replying / got disconnected? (step by step)

WhatsApp does not officially support this kind of program and sometimes **disconnects or rate-limits** it. It can be fixed. Typical signs: the robot does not answer, you see `LOGGED_OUT`, `401`, `rate-overlimit`, or the group is not found.

**Easy way:** tell your Claude (in the robot's terminal): *"WhatsApp stopped, fix it"*. It reads the rules (`app/INSTRUCOES.md`), checks the error and guides you step by step.

**Manual way (reset the connection):**
1. Close the little robot near the clock (right-click → **Quit**).
2. On your phone: WhatsApp → **Linked devices** → tap the program's device (Ubuntu/Chrome) → **Log out**.
3. On the PC, open the `data` folder and **rename** the `auth` folder to `auth-old` (do not delete it).
4. **Wait 15 to 30 minutes.** This matters: retrying right away makes the limit worse.
5. Open `__START.bat` **only once** and answer the questions.
6. On your phone: **Linked devices → Link a device → Link with phone number** and type the 8-character code.
7. Send "hi" in the group and wait about 30 seconds.

When you pair again, the program **archives the old history** (`data/logs/arquivo-...`) and only reads **new** messages.

**To lower the risk of being blocked:** use a **secondary number** (not your main one); do not repeat pairing many times in a row; do not send many messages at once; do not use it in big groups with strangers. The program already shows "typing…", spaces out replies and reconnects slowly.

If WhatsApp keeps rejecting the code or says the number is limited/banned, **wait 24 h** or use **another number**.

---

## ☕ Support the project

This project is **100% free**. If it helped you and you'd like to buy me a coffee, I'd be really happy! 💛 (Totally optional.)

| | |
|---|---|
| 🌎 **PayPal** | [**Donate with PayPal**](https://www.paypal.com/donate/?business=darcio1989%40gmail.com&currency_code=USD&item_name=claude-zap) or `darcio1989@gmail.com` |
| 🇧🇷 **Pix** (Brazil) | Key: **`14988035885`** |
| ⭐ **For free** | Give the repo a **star** and tell a friend! |

---

## 🧩 Under the hood (optional)

```
claude-zap/
  INSTALAR.bat   installs everything (Node.js, components, Claude Code) and opens the app
  __START.bat    opens the app on later runs
  app/           the WhatsApp "bridge", the tray robot and the voice transcriber
  data/          YOUR data (WhatsApp login, config, logs) — private
```

Uses [Baileys](https://github.com/WhiskeySockets/Baileys) for WhatsApp, local Whisper (transformers.js) for voice and Anthropic's [Claude Code](https://docs.claude.com/en/docs/claude-code).

> **Unofficial** project, not affiliated with WhatsApp/Meta or Anthropic. Use at your own risk and respect WhatsApp's terms (personal account, no spam).
