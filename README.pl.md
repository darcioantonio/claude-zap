<div align="center">

# 💬 claude-zap

### Wysyłaj polecenia przez WhatsApp. Claude wykona je na Twoim komputerze.

[![Windows](https://img.shields.io/badge/Windows-10%20%7C%2011-0078D4?style=for-the-badge&logo=windows&logoColor=white)](#-krok-po-kroku-dla-początkujących)
[![Node.js](https://img.shields.io/badge/Node.js-instaluje%20si%C4%99%20sam-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Claude](https://img.shields.io/badge/Claude-Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://claude.ai)
[![Instalacja](https://img.shields.io/badge/instalacja-1%20klik-F59E0B?style=for-the-badge)](#-krok-po-kroku-dla-początkujących)
[![Wsparcie](https://img.shields.io/badge/%E2%98%95-wesprzyj%20projekt-FF813F?style=for-the-badge)](#-wesprzyj-projekt)

[🇧🇷 Português](README.pt-BR.md) · [🇺🇸 English](README.md) · [🇪🇸 Español](README.es.md) · **🇵🇱 Polski**

</div>

---

## ✨ Co to jest

Piszesz (lub **nagrywasz wiadomość głosową**) w grupie WhatsApp, Claude to rozumie, **wykonuje pracę na Twoim komputerze** i odpowiada w WhatsAppie. Działa z każdego miejsca, nawet z telefonem w ręku.

| 📱 Ty | 🤖 Robot na Twoim PC |
|---|---|
| *„Zrób stronę z przepisami”* | Tworzy, otwiera i daje znać |
| *„Wyślij mi zrzut ekranu gry”* | Robi i wysyła na WhatsApp |
| 🎤 Wiadomość głosowa | Rozumie głos **lokalnie na Twoim PC** (na tym etapie głos nie trafia do internetu) |

---

## ✅ Czego potrzebujesz

| | |
|---|---|
| 🖥️ **Windows 10 lub 11** | Włączony i z internetem |
| 🧠 **Konto Claude** | Płatny plan (Pro lub Max) **albo** klucz API Anthropic. Załóż konto na <https://claude.ai>. **Bez tego program się zainstaluje, ale Claude nie odpowie.** |
| 📱 **WhatsApp w telefonie** | Program łączy się z nim jak „WhatsApp Web” |
| 🌐 **Internet** | Za pierwszym razem pobiera ok. 500 MB |

**Nie musisz umieć programować.** Plik `INSTALAR.bat` robi wszystko.

---

## 🚀 Krok po kroku (dla początkujących)

### 1️⃣ Pobierz
1. Na tej stronie GitHuba kliknij zielony przycisk **`< > Code`**.
2. Kliknij **`Download ZIP`**.
3. Kliknij prawym przyciskiem pobrany `.zip` → **`Wyodrębnij wszystkie...`** → **`Wyodrębnij`**.
4. **Przenieś folder w stałe miejsce** (np. `C:\Projekty`) i już go nie przenoś.

### 2️⃣ Zainstaluj (jedno kliknięcie)
1. **Kliknij dwukrotnie `INSTALAR.bat`** (po portugalsku „zainstaluj”).
2. Jeśli Windows pokaże *„System Windows ochronił ten komputer”*: **`Więcej informacji`** → **`Uruchom mimo to`**. (To normalne dla pobranych plików. Możesz wcześniej otworzyć `INSTALAR.bat` w Notatniku: instaluje tylko Node.js, komponenty i Claude Code.)
3. Poczekaj, aż czarne okno skończy. **Nie zamykaj go.**
4. Jeśli napisze, że zainstalowało **Node.js** i poprosi o ponowne uruchomienie: **zamknij i kliknij dwukrotnie `INSTALAR.bat` jeszcze raz** (zdarza się tylko raz).
5. Gdy zobaczysz **PRONTO!** („gotowe”), naciśnij dowolny klawisz: program się otworzy.

### 3️⃣ Odpowiedz na pytania
Jedno na ekranie. W razie wątpliwości **Enter** przyjmuje sugerowaną wartość.
- **Język** odpowiedzi · **Nazwa robota** (może być *Claude*) · **Nazwa grupy** (może być *Claude_bot*; program tworzy ją sam)
- **Twój numer** z kodem kraju i kierunkowym, same cyfry. Np.: `48500123456`
- **Twoje konto Claude**: otworzy się przeglądarka, aby się zalogować i autoryzować.

### 4️⃣ Połącz WhatsApp
1. Na ekranie pojawi się **8-znakowy kod**.
2. W telefonie: WhatsApp → **Połączone urządzenia** → **Połącz urządzenie** → **Połącz za pomocą numeru telefonu**.
3. Wpisz kod. Gotowe! ✅

### 5️⃣ Używaj
1. Obok zegara Windows pojawi się mały **robot** (czasem w strzałce `^`).
2. Otwórz grupę w WhatsAppie i **napisz lub nagraj wiadomość głosową**.
3. **Prawy przycisk na robocie**: pokaż/ukryj terminal, zobacz logi, uruchom ponownie lub zamknij.

> 🔁 **Następnym razem:** wystarczy dwukrotnie kliknąć **`__START.bat`**.

---

## 🔒 Bezpieczeństwo (przeczytaj!)

- 👤 **Tylko Ty kierujesz robotem.** Wykonywane są tylko wiadomości z **Twojego numeru**. Aby dopuścić kogoś innego, dodaj jego numer do `allowed` w `data\config.json`.
- ⚠️ **Claude naprawdę zmienia rzeczy na Twoim PC**, domyślnie **bez pytania o zgodę przy każdym kroku**. Proś tylko o rzeczy, którym ufasz, i **nie pozwalaj innym używać Twojej grupy**.
- 🔐 **Nigdy nie udostępniaj folderu `data`**: zawiera logowanie do Twojego WhatsAppa. `.gitignore` już blokuje jego wysłanie; jeśli publikujesz własną kopię, **nie usuwaj `.gitignore`**.
- 🚫 Nigdy nie wysyłaj robotowi haseł, kart ani dokumentów.

---

## 🛠️ Częste problemy

| Problem | Co zrobić |
|---|---|
| *„Node.js nie znaleziony”* | Kliknij dwukrotnie `INSTALAR.bat`. Jeśli dalej nie działa, zainstaluj Node.js **LTS** z <https://nodejs.org> i uruchom ponownie. |
| Robota nie widać | Zajrzyj do strzałki `^` obok zegara lub otwórz `__START.bat`. |
| WhatsApp się rozłączył | `__START.bat` i powtórz krok 4. |
| Robot nie odpowiada | PC włączony? Internet? Konto Claude z płatnym planem? Prawy przycisk na robocie → **Uruchom ponownie**. |
| Pierwsza wiadomość głosowa trwa długo | Normalne: jednorazowo pobiera „ucho” robota (~150 MB). |
| Claude prosi o logowanie | Prawy przycisk na robocie → pokaż terminal → postępuj według ekranu. |

Nic nie pomogło? Otwórz **Issue** tutaj, opisz co się stało i wklej błąd.

---

## ☕ Wesprzyj projekt

Ten projekt jest **w 100% darmowy**. Jeśli Ci pomógł i chcesz postawić mi kawę, będzie mi bardzo miło! 💛 (Całkowicie dobrowolnie.)

| | |
|---|---|
| 🌎 **PayPal** | [**Wesprzyj przez PayPal**](https://www.paypal.com/donate/?business=darcio1989%40gmail.com&currency_code=USD&item_name=claude-zap) lub `darcio1989@gmail.com` |
| 🇧🇷 **Pix** (Brazylia) | Klucz: **`14988035885`** |
| ⭐ **Za darmo** | Daj repozytorium **gwiazdkę** i powiedz znajomemu! |

---

## 🧩 Pod maską (opcjonalnie)

```
claude-zap/
  INSTALAR.bat   instaluje wszystko (Node.js, komponenty, Claude Code) i otwiera program
  __START.bat    otwiera program przy kolejnych uruchomieniach
  app/           „most” do WhatsAppa, mały robot i transkrypcja głosu
  data/          TWOJE dane (logowanie WhatsApp, konfiguracja, logi) — prywatne
```

Używa [Baileys](https://github.com/WhiskeySockets/Baileys) do WhatsAppa, lokalnego Whispera (transformers.js) do głosu oraz [Claude Code](https://docs.claude.com/en/docs/claude-code) od Anthropic.

> Projekt **nieoficjalny**, niezwiązany z WhatsApp/Meta ani Anthropic. Używasz na własne ryzyko; przestrzegaj regulaminu WhatsAppa (konto osobiste, bez spamu).
