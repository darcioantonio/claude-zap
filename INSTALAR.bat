@echo off
rem ============================================================
rem  INSTALAR.bat - instala tudo que o projeto precisa e abre o programa.
rem  Basta dar DOIS CLIQUES. Pode rodar de novo quando quiser (nao estraga nada).
rem ============================================================
chcp 65001 >nul
cd /d "%~dp0"
title Claude x WhatsApp - Instalacao
echo.
echo  ===================================================
echo    CLAUDE x WHATSAPP  -  INSTALACAO AUTOMATICA
echo  ===================================================
echo.

rem ---------- 1) Node.js (o programa que faz tudo rodar)
where node >nul 2>&1
if errorlevel 1 (
  echo [1/3] Node.js nao encontrado. Vou instalar agora...
  where winget >nul 2>&1
  if errorlevel 1 (
    echo.
    echo  Seu Windows nao tem o instalador automatico ^(winget^).
    echo  Vou abrir o site do Node.js. Baixe a versao "LTS", instale
    echo  ^(Next, Next, Next^) e depois de DOIS CLIQUES neste INSTALAR.bat de novo.
    start https://nodejs.org
    pause
    exit /b 1
  )
  winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  echo.
  echo  Node.js instalado. FECHE esta janela e de DOIS CLIQUES no INSTALAR.bat de novo
  echo  ^(o Windows precisa reiniciar este programa para reconhecer o Node.js^).
  pause
  exit /b 0
) else (
  echo [1/3] Node.js ja instalado. OK
)

rem ---------- 2) componentes do projeto
echo.
echo [2/3] Baixando os componentes do projeto ^(pode demorar alguns minutos, so na primeira vez^)...
pushd app
call npm install --no-audit --no-fund
if errorlevel 1 (
  popd
  echo.
  echo  ERRO ao baixar os componentes. Confira a internet e tente de novo.
  pause
  exit /b 1
)
popd
echo  Componentes instalados. OK

rem ---------- 3) Claude Code (o assistente que recebe seus pedidos)
echo.
where claude >nul 2>&1
if errorlevel 1 (
  echo [3/3] Instalando o Claude Code...
  call npm install -g @anthropic-ai/claude-code
) else (
  echo [3/3] Claude Code ja instalado. OK
)

echo.
echo  ===================================================
echo    PRONTO! Agora vou abrir o programa.
echo    Responda as perguntas na tela. Se ficar em duvida,
echo    leia o arquivo README.md ^(passo a passo^).
echo  ===================================================
echo.
pause
call "%~dp0__START.bat"
