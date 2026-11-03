<div align="center">

# 💬 claude-zap

### Mande pedidos pelo WhatsApp. O Claude faz no seu computador.

[![Windows](https://img.shields.io/badge/Windows-10%20%7C%2011-0078D4?style=for-the-badge&logo=windows&logoColor=white)](#-passo-a-passo-para-quem-é-leigo)
[![Node.js](https://img.shields.io/badge/Node.js-instalado%20sozinho-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Claude](https://img.shields.io/badge/Claude-Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://claude.ai)
[![Instalação](https://img.shields.io/badge/instala%C3%A7%C3%A3o-1%20clique-F59E0B?style=for-the-badge)](#-passo-a-passo-para-quem-é-leigo)
[![Apoie](https://img.shields.io/badge/%E2%98%95-apoie%20o%20projeto-FF813F?style=for-the-badge)](#-apoie-o-projeto)

**🇧🇷 Português** · [🇺🇸 English](README.md) · [🇪🇸 Español](README.es.md) · [🇵🇱 Polski](README.pl.md)

</div>

---

## ✨ O que é isso

Você escreve (ou **grava um áudio**) num grupo do WhatsApp, o Claude entende, **faz o trabalho no seu computador** e responde no próprio WhatsApp. Funciona de qualquer lugar, até com o celular na mão.

| 📱 Você | 🤖 Robô no seu PC |
|---|---|
| *"Cria um site de receitas"* | Cria, abre e te avisa |
| *"Me manda um print do jogo"* | Tira o print e manda no WhatsApp |
| 🎤 Um áudio falando o que quer | Entende a voz **no seu próprio PC** (nada da sua voz vai para a internet nessa etapa) |

---

## ✅ O que você precisa

| | |
|---|---|
| 🖥️ **Windows 10 ou 11** | Ligado e com internet |
| 🧠 **Conta do Claude** | Plano pago (Pro ou Max) **ou** chave de API da Anthropic. Crie em <https://claude.ai>. **Sem isso o programa instala, mas o Claude não responde.** |
| 📱 **WhatsApp no celular** | O programa se liga a ele como o "WhatsApp Web" |
| 🌐 **Internet** | Na primeira vez baixa uns 500 MB |

Você **não precisa saber programar**. O arquivo `INSTALAR.bat` faz tudo.

---

## 🚀 Passo a passo (para quem é leigo)

### 1️⃣ Baixar
1. Nesta página do GitHub, clique no botão verde **`< > Code`**.
2. Clique em **`Download ZIP`**.
3. Clique com o botão direito no `.zip` baixado → **`Extrair tudo...`** → **`Extrair`**.
4. **Mova a pasta para um lugar fixo** (ex.: `C:\Projetos`) e não mude mais de lugar.

### 2️⃣ Instalar (um clique)
1. Dê **dois cliques** em **`INSTALAR.bat`**.
2. Se o Windows mostrar *"O Windows protegeu o computador"*: **`Mais informações`** → **`Executar assim mesmo`**. (Normal para arquivos baixados. Você pode abrir o `INSTALAR.bat` no Bloco de Notas antes: ele só instala o Node.js, os componentes e o Claude Code.)
3. Espere a janela preta terminar. **Não feche.**
4. Se ela disser que instalou o **Node.js** e pedir para abrir de novo: **feche e dê dois cliques no `INSTALAR.bat` outra vez** (acontece uma vez só).
5. Quando aparecer **PRONTO!**, aperte uma tecla: o programa abre.

### 3️⃣ Responder as perguntas
Uma por tela. Na dúvida, **Enter** aceita o valor sugerido.
- **Idioma** das respostas · **Nome do robô** (pode ser *Claude*) · **Nome do grupo** (pode ser *Claude_bot*, o programa cria sozinho)
- **Seu número** com país e DDD, só números. Ex.: `5511999998888`
- **Sua conta do Claude**: abre o navegador para você entrar e autorizar.

### 4️⃣ Ligar o WhatsApp
1. A tela mostra um **código de 8 caracteres**.
2. No celular: WhatsApp → **Dispositivos conectados** → **Conectar um dispositivo** → **Conectar com número de telefone**.
3. Digite o código. Pronto! ✅

### 5️⃣ Usar
1. Um **robozinho** aparece perto do relógio do Windows (às vezes dentro da setinha `^`).
2. Abra o grupo no WhatsApp e **escreva ou grave um áudio**.
3. **Botão direito no robozinho**: mostrar/esconder o terminal, ver registros, reiniciar ou sair.

> 🔁 **Nas próximas vezes:** só dois cliques em **`__START.bat`**.

---

## 🔒 Segurança (leia!)

- 👤 **Só você manda no robô.** Só as mensagens do **seu número** são obedecidas. Para liberar outra pessoa, coloque o número dela em `allowed` no `data\config.json`.
- ⚠️ **O Claude mexe de verdade no seu PC**, por padrão **sem pedir confirmação**. Só peça o que você confia e **não deixe outros usarem o grupo**.
- 🔐 **Nunca compartilhe a pasta `data`**: ela tem o login do seu WhatsApp. O `.gitignore` já impede de subir; se publicar sua cópia, **não apague o `.gitignore`**.
- 🚫 Nunca mande senhas, cartões ou documentos pelo robô.

---

## 🛠️ Problemas comuns

| Problema | O que fazer |
|---|---|
| *"Node.js não encontrado"* | Dois cliques no `INSTALAR.bat`. Se continuar, instale o Node.js **LTS** em <https://nodejs.org> e rode de novo. |
| Robozinho não aparece | Olhe dentro da setinha `^` ao lado do relógio ou abra o `__START.bat`. |
| WhatsApp desconectou | `__START.bat` e refaça o passo 4. |
| Robô não responde | PC ligado? Internet? Conta do Claude com plano pago? Botão direito no robô → **Reiniciar**. |
| Primeiro áudio demora | Normal: baixa o "ouvido" do robô uma vez (~150 MB). |
| Claude pede login | Botão direito no robô → mostrar terminal → siga a tela. |

Nada resolveu? Abra um **Issue** aqui contando o que houve e colando o erro.

---

## 🆘 O WhatsApp parou de responder / desconectou? (passo a passo)

O WhatsApp não é oficialmente compatível com este tipo de programa e às vezes **desconecta ou limita** a conexão. Isso tem conserto. Sinais comuns: o robô não responde, aparece `LOGGED_OUT`, `401`, `rate-overlimit`, ou o grupo não é encontrado.

**Jeito fácil:** diga ao seu Claude (no terminal do robô): *"o WhatsApp parou, resolve"*. Ele lê as regras (`app/INSTRUCOES.md`), olha o erro e te guia passo a passo.

**Jeito manual (resetar a conexão):**
1. Feche o robozinho perto do relógio (botão direito → **Sair**).
2. No celular: WhatsApp → **Aparelhos conectados** → toque no aparelho do programa (Ubuntu/Chrome) → **Desconectar**.
3. No PC, abra a pasta `data` e **renomeie** a pasta `auth` para `auth-antigo` (não apague).
4. **Espere 15 a 30 minutos.** Isso é importante: tentar de novo logo piora o limite.
5. Abra o `__START.bat` **uma vez só** e siga as perguntas.
6. No celular: **Aparelhos conectados → Conectar um aparelho → Conectar com número de telefone** e digite o código de 8 caracteres.
7. Mande um "oi" no grupo e espere uns 30 segundos.

Ao parear de novo, o programa **arquiva o histórico antigo** (`data/logs/arquivo-...`) e só lê mensagens **novas**.

**Para reduzir o risco de bloqueio:** use um **número secundário** (não o principal); não refaça o pareamento várias vezes seguidas; não mande muitas mensagens de uma vez; não use em grupos grandes com desconhecidos. O programa já finge "digitando…", espaça as respostas e reconecta devagar.

Se o WhatsApp recusar o código várias vezes ou disser que o número está limitado/banido, **espere 24 h** ou use **outro número**.

---

## ☕ Apoie o projeto

Este projeto é **100% gratuito**. Se ele te ajudou e você quiser retribuir com um cafezinho, fico muito feliz! 💛 (Totalmente opcional.)

| | |
|---|---|
| 🇧🇷 **Pix** | Chave: **`14988035885`** |
| 🌎 **PayPal** | [**Doar com PayPal**](https://www.paypal.com/donate/?business=darcio1989%40gmail.com&currency_code=USD&item_name=claude-zap) ou `darcio1989@gmail.com` |
| ⭐ **De graça** | Dê uma **estrela** no repositório e conte para um amigo! |

---

## 🧩 Por dentro (opcional)

```
claude-zap/
  INSTALAR.bat   instala tudo (Node.js, componentes, Claude Code) e abre o programa
  __START.bat    abre o programa nas próximas vezes
  app/           a "ponte" do WhatsApp, o robozinho e o transcritor de voz
  data/          SEUS dados (login do WhatsApp, config, logs) — privado
```

Usa [Baileys](https://github.com/WhiskeySockets/Baileys) para o WhatsApp, Whisper local (transformers.js) para a voz e o [Claude Code](https://docs.claude.com/en/docs/claude-code) da Anthropic.

> Projeto **não oficial**, sem ligação com WhatsApp/Meta ou Anthropic. Use por sua conta e risco e respeite os termos do WhatsApp (conta pessoal, sem spam).
