# Claude × WhatsApp

**Mande pedidos pelo WhatsApp e o Claude (a inteligência artificial) faz no seu computador.**
Você escreve ou grava um áudio no WhatsApp, o Claude entende, mexe nos seus arquivos e projetos, e responde no próprio WhatsApp. Funciona até com o celular na mão, longe do computador.

> English summary at the bottom of this page.

---

## O que é isso, em palavras simples

1. Você deixa o computador ligado.
2. Este programa fica rodando escondidinho, ao lado do relógio do Windows, com um **robozinho**.
3. Você manda uma mensagem num grupo do WhatsApp, por exemplo: *"cria um site de receitas"* ou *"me manda um print do jogo"*.
4. O Claude lê, faz o trabalho no computador e **responde no WhatsApp**.

Áudios também funcionam: o programa transforma a sua voz em texto, **no seu próprio computador** (nada da sua voz vai para a internet nessa etapa).

---

## O que você precisa antes de começar

| O quê | Observação |
|---|---|
| **Um computador com Windows 10 ou 11** | Precisa ficar ligado e com internet. |
| **Uma conta do Claude** | Precisa de um plano pago do Claude (Pro ou Max) ou de uma chave de API da Anthropic. Crie em <https://claude.ai>. **Sem isso o programa instala, mas o Claude não responde.** |
| **WhatsApp no celular** | O programa se liga ao seu WhatsApp como se fosse o "WhatsApp Web". |
| **Internet** | Na primeira vez ele baixa uns 500 MB de componentes. |

Você **não** precisa saber programar. Você **não** precisa instalar nada na mão: o arquivo `INSTALAR.bat` faz tudo.

---

## Passo a passo (para quem é leigo)

### Passo 1 — Baixar o projeto do GitHub

1. Abra a página do projeto no GitHub (o link que quem te passou enviou).
2. Clique no botão verde **`< > Code`**.
3. Clique em **`Download ZIP`**.
4. Quando terminar de baixar, ache o arquivo `.zip` (normalmente na pasta *Downloads*), clique com o botão direito e escolha **`Extrair tudo...`** → **`Extrair`**.
5. Vai aparecer uma pasta. **Mova essa pasta para um lugar fixo**, por exemplo a Área de Trabalho ou `C:\Projetos`. Depois não mude mais de lugar.

> Dica: não deixe a pasta dentro de outra pasta com nome gigante ou com muitos acentos. `C:\Projetos\Claude-WA-Bridge` é perfeito.

### Passo 2 — Instalar (um clique)

1. Abra a pasta e dê **dois cliques** em **`INSTALAR.bat`**.
2. Se o Windows mostrar uma tela azul *"O Windows protegeu o computador"*, clique em **`Mais informações`** e depois em **`Executar assim mesmo`**. (É normal para arquivos baixados da internet. Você pode abrir o `INSTALAR.bat` no Bloco de Notas antes para ver que ele só instala o Node.js, os componentes e o Claude Code.)
3. Uma janela preta vai aparecer e instalar tudo sozinha. **Não feche.**
4. Se ela avisar que instalou o **Node.js** e pedir para fechar e abrir de novo: **feche a janela e dê dois cliques no `INSTALAR.bat` outra vez**. Isso só acontece uma vez.
5. Quando aparecer **PRONTO!**, aperte qualquer tecla. O programa abre.

### Passo 3 — Responder as perguntas na tela

Uma pergunta por tela. Em caso de dúvida, aperte **Enter** para aceitar o valor sugerido.

- **Idioma** das respostas (português, inglês, espanhol...).
- **Nome do robô** (como ele aparece no WhatsApp). Pode deixar *Claude*.
- **Nome do grupo** do WhatsApp onde você vai conversar com ele. Pode deixar *Claude_bot*. O programa cria o grupo sozinho.
- **Seu número de WhatsApp**, com código do país e DDD, **só números**. Exemplo: `5511999998888`.
- **Sua conta do Claude**: o programa abre uma janelinha do navegador para você entrar na sua conta do Claude. Entre e autorize.

### Passo 4 — Ligar o WhatsApp (código de 8 letras)

1. A tela vai mostrar um **código de 8 caracteres**.
2. No celular, abra o WhatsApp → **Configurações** (ou os três pontinhos) → **Dispositivos conectados** → **Conectar um dispositivo** → **Conectar com número de telefone em vez disso**.
3. Digite o código de 8 caracteres.
4. Pronto: o WhatsApp está ligado.

### Passo 5 — Usar

1. Um **robozinho** aparece perto do relógio do Windows (canto de baixo, à direita; às vezes dentro da setinha `^`).
2. Abra o WhatsApp e entre no grupo que o programa criou (por padrão **Claude_bot**).
3. **Escreva ou grave um áudio** pedindo o que quiser. O robô responde no grupo.

**Clique com o botão direito no robozinho** para: mostrar/esconder o terminal do Claude, ver os registros (logs), reiniciar ou sair.

### Nas próximas vezes

Só dê dois cliques em **`__START.bat`**. Não precisa instalar de novo.

---

## Exemplos de pedidos

- *"O que tem na pasta Projetos?"*
- *"Crie uma página de site simples com meu nome e abra."*
- *"Me manda um print da tela do jogo que está rodando."*
- Um **áudio** falando o que você quer.

Respostas ficam curtas de propósito (para ler no celular).

---

## Segurança (leia, é importante)

- **Só você manda no robô.** Por padrão, só as mensagens do **seu próprio número** são obedecidas. Outras pessoas no grupo são ignoradas, a menos que você autorize o número delas (campo `allowed` do arquivo `data\config.json`).
- **O Claude mexe de verdade no seu computador** e, por padrão, **sem pedir confirmação** a cada passo. Use só com pedidos que você confia, e **não deixe outras pessoas usarem seu grupo**.
- **Nunca compartilhe a pasta `data`.** Ela guarda o login do seu WhatsApp, seu número e seu e-mail. O projeto já vem com um `.gitignore` que **impede** de subir essa pasta para o GitHub. Se você for publicar sua cópia, **não apague o `.gitignore`**.
- Nunca mande senhas, números de cartão ou documentos pelo robô.

---

## Problemas comuns

| Problema | O que fazer |
|---|---|
| *"Node.js não encontrado"* | Dê dois cliques no `INSTALAR.bat`. Se continuar, instale o Node.js "LTS" em <https://nodejs.org> e rode o `INSTALAR.bat` de novo. |
| O robozinho não aparece | Olhe dentro da setinha `^` ao lado do relógio. Ou abra o `__START.bat` de novo. |
| O WhatsApp desconectou | Dê dois cliques no `__START.bat` e faça o Passo 4 de novo. |
| O robô não responde | Veja se o computador está ligado, com internet, e se a sua conta do Claude está ativa e com plano pago. Clique com o botão direito no robô → **Reiniciar**. |
| O primeiro áudio demora | Normal: na primeira vez ele baixa o "ouvido" do robô (uns 150 MB). Depois fica rápido. |
| Instalou mas o Claude pede login | Abra o terminal do Claude (botão direito no robô → mostrar) e siga a tela para entrar na sua conta. |

Se nada resolver, abra um **Issue** aqui no GitHub contando o que aconteceu e colando a mensagem de erro.

---

## Para quem quer saber como é por dentro (opcional)

```
Claude-WA-Bridge/
  INSTALAR.bat     instala tudo (Node.js, componentes, Claude Code) e abre o programa
  __START.bat      abre o programa nas próximas vezes
  app/             os arquivos do programa (a "ponte" do WhatsApp, o robozinho, o transcritor de voz)
  data/            SEUS dados: login do WhatsApp, configurações, logs. Privado, nunca suba para o GitHub
  .claude/skills/  habilidades extras do Claude
```

- A "ponte" usa a biblioteca [Baileys](https://github.com/WhiskeySockets/Baileys) para falar com o WhatsApp.
- A voz vira texto com o modelo Whisper rodando **no seu computador** (transformers.js).
- A resposta vem do [Claude Code](https://docs.claude.com/en/docs/claude-code), a ferramenta oficial da Anthropic.

> Este projeto **não é oficial** nem ligado ao WhatsApp/Meta ou à Anthropic. Use por sua conta e risco, e respeite os termos de uso do WhatsApp (use com a sua conta pessoal, sem spam).

---

## English summary

**Claude × WhatsApp** lets you control Claude Code on your Windows PC from a WhatsApp group (text or voice notes).

1. Download the repo as a ZIP (GitHub → *Code* → *Download ZIP*), extract it to a fixed folder.
2. Double-click **`INSTALAR.bat`** (installs Node.js via winget if missing, the npm packages and Claude Code, then starts the wizard).
3. Answer the wizard, link WhatsApp with the 8-character pairing code (*Linked devices → Link with phone number*).
4. A tray robot appears next to the clock; message the group and Claude answers.

Requires Windows 10/11, Node.js (auto-installed), a paid Claude plan or Anthropic API key, and WhatsApp. Next runs: double-click **`__START.bat`**. The `data/` folder holds your private WhatsApp session and settings and is excluded by `.gitignore`: never publish it.
