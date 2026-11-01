<div align="center">

# 💬 claude-zap

### Manda pedidos por WhatsApp. Claude lo hace en tu computadora.

[![Windows](https://img.shields.io/badge/Windows-10%20%7C%2011-0078D4?style=for-the-badge&logo=windows&logoColor=white)](#-paso-a-paso-para-principiantes)
[![Node.js](https://img.shields.io/badge/Node.js-se%20instala%20solo-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Claude](https://img.shields.io/badge/Claude-Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://claude.ai)
[![Instalación](https://img.shields.io/badge/instalaci%C3%B3n-1%20clic-F59E0B?style=for-the-badge)](#-paso-a-paso-para-principiantes)
[![Apoyo](https://img.shields.io/badge/%E2%98%95-apoya%20el%20proyecto-FF813F?style=for-the-badge)](#-apoya-el-proyecto)

[🇧🇷 Português](README.pt-BR.md) · [🇺🇸 English](README.md) · **🇪🇸 Español** · [🇵🇱 Polski](README.pl.md)

</div>

---

## ✨ Qué es esto

Escribes (o **grabas un audio**) en un grupo de WhatsApp, Claude lo entiende, **hace el trabajo en tu computadora** y responde en el mismo WhatsApp. Funciona desde cualquier lugar, incluso con el celular en la mano.

| 📱 Tú | 🤖 El robot en tu PC |
|---|---|
| *"Crea un sitio de recetas"* | Lo crea, lo abre y te avisa |
| *"Mándame una captura del juego"* | La toma y la envía por WhatsApp |
| 🎤 Un audio hablando | Entiende tu voz **en tu propia PC** (tu voz no va a internet en este paso) |

---

## ✅ Qué necesitas

| | |
|---|---|
| 🖥️ **Windows 10 u 11** | Encendido y con internet |
| 🧠 **Cuenta de Claude** | Plan de pago (Pro o Max) **o** clave de API de Anthropic. Créala en <https://claude.ai>. **Sin eso el programa se instala, pero Claude no responde.** |
| 📱 **WhatsApp en el celular** | El programa se vincula como "WhatsApp Web" |
| 🌐 **Internet** | La primera vez descarga unos 500 MB |

**No necesitas saber programar.** El archivo `INSTALAR.bat` lo hace todo.

---

## 🚀 Paso a paso (para principiantes)

### 1️⃣ Descargar
1. En esta página de GitHub, haz clic en el botón verde **`< > Code`**.
2. Haz clic en **`Download ZIP`**.
3. Clic derecho en el `.zip` → **`Extraer todo...`** → **`Extraer`**.
4. **Mueve la carpeta a un lugar fijo** (ej.: `C:\Proyectos`) y no la cambies más de lugar.

### 2️⃣ Instalar (un clic)
1. Haz **doble clic** en **`INSTALAR.bat`** ("instalar" en portugués).
2. Si Windows muestra *"Windows protegió su PC"*: **`Más información`** → **`Ejecutar de todos modos`**. (Es normal con archivos descargados. Puedes abrir `INSTALAR.bat` con el Bloc de notas antes: solo instala Node.js, los componentes y Claude Code.)
3. Espera a que termine la ventana negra. **No la cierres.**
4. Si dice que instaló **Node.js** y pide abrir de nuevo: **ciérrala y haz doble clic en `INSTALAR.bat` otra vez** (pasa solo una vez).
5. Cuando aparezca **PRONTO!** ("¡listo!"), pulsa una tecla: el programa se abre.

### 3️⃣ Responder las preguntas
Una por pantalla. Si dudas, **Enter** acepta el valor sugerido.
- **Idioma** de las respuestas · **Nombre del robot** (puede ser *Claude*) · **Nombre del grupo** (puede ser *Claude_bot*; se crea solo)
- **Tu número** con código de país y de área, solo dígitos. Ej.: `5491112345678`
- **Tu cuenta de Claude**: se abre el navegador para que entres y autorices.

### 4️⃣ Vincular WhatsApp
1. La pantalla muestra un **código de 8 caracteres**.
2. En el celular: WhatsApp → **Dispositivos vinculados** → **Vincular un dispositivo** → **Vincular con el número de teléfono**.
3. Escribe el código. ¡Listo! ✅

### 5️⃣ Usar
1. Aparece un **robotito** junto al reloj de Windows (a veces dentro de la flechita `^`).
2. Abre el grupo en WhatsApp y **escribe o graba un audio**.
3. **Clic derecho en el robotito**: mostrar/ocultar la terminal, ver registros, reiniciar o salir.

> 🔁 **Las próximas veces:** solo doble clic en **`__START.bat`**.

---

## 🔒 Seguridad (¡lee esto!)

- 👤 **Solo tú mandas en el robot.** Solo se obedecen los mensajes de **tu número**. Para permitir a otra persona, agrega su número en `allowed` de `data\config.json`.
- ⚠️ **Claude realmente cambia cosas en tu PC**, por defecto **sin pedir confirmación** en cada paso. Pide solo lo que confías y **no dejes que otros usen tu grupo**.
- 🔐 **Nunca compartas la carpeta `data`**: tiene el acceso a tu WhatsApp. El `.gitignore` ya evita subirla; si publicas tu copia, **no borres el `.gitignore`**.
- 🚫 Nunca envíes contraseñas, tarjetas ni documentos por el robot.

---

## 🛠️ Problemas comunes

| Problema | Qué hacer |
|---|---|
| *"Node.js no encontrado"* | Doble clic en `INSTALAR.bat`. Si sigue, instala Node.js **LTS** desde <https://nodejs.org> y ejecútalo de nuevo. |
| No aparece el robotito | Mira dentro de la flechita `^` junto al reloj o abre `__START.bat`. |
| WhatsApp se desconectó | `__START.bat` y repite el paso 4. |
| El robot no responde | ¿PC encendida? ¿Internet? ¿Cuenta de Claude con plan de pago? Clic derecho en el robot → **Reiniciar**. |
| El primer audio tarda | Normal: descarga el "oído" del robot una vez (~150 MB). |
| Claude pide iniciar sesión | Clic derecho en el robot → mostrar terminal → sigue la pantalla. |

¿Nada funcionó? Abre un **Issue** aquí contando lo que pasó y pegando el error.

---

## ☕ Apoya el proyecto

Este proyecto es **100 % gratuito**. Si te ayudó y quieres invitarme un cafecito, ¡me haría muy feliz! 💛 (Totalmente opcional.)

| | |
|---|---|
| 🌎 **PayPal** | [**Donar con PayPal**](https://www.paypal.com/donate/?business=darcio1989%40gmail.com&currency_code=USD&item_name=claude-zap) o `darcio1989@gmail.com` |
| 🇧🇷 **Pix** (Brasil) | Clave: **`14988035885`** |
| ⭐ **Gratis** | ¡Dale una **estrella** al repositorio y cuéntaselo a un amigo! |

---

## 🧩 Por dentro (opcional)

```
claude-zap/
  INSTALAR.bat   instala todo (Node.js, componentes, Claude Code) y abre el programa
  __START.bat    abre el programa las próximas veces
  app/           el "puente" de WhatsApp, el robotito y el transcriptor de voz
  data/          TUS datos (acceso a WhatsApp, config, logs) — privado
```

Usa [Baileys](https://github.com/WhiskeySockets/Baileys) para WhatsApp, Whisper local (transformers.js) para la voz y [Claude Code](https://docs.claude.com/en/docs/claude-code) de Anthropic.

> Proyecto **no oficial**, sin relación con WhatsApp/Meta ni Anthropic. Úsalo bajo tu propio riesgo y respeta los términos de WhatsApp (cuenta personal, sin spam).
