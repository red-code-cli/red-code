<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="RedCode logo">
    </picture>
  </a>
</p>
<p align="center">Otwartoźródłowy agent kodujący AI.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/redcode-ai"><img alt="npm" src="https://img.shields.io/npm/v/redcode-ai?style=flat-square" /></a>
  <a href="https://github.com/Vempire-X/RedCode/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/Vempire-X/RedCode/release.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![RedCode Terminal UI](services/site/public/v1/docs/assets/lander/screenshot.png)](https://opencode.ai)

---

### Instalacja

```bash
# YOLO
curl -fsSL https://opencode.ai/v2/install | bash

# Menedżery pakietów
npm i -g redcode-ai@latest      # albo bun/pnpm/yarn
brew install anomalyco/tap/opencode-v2 # macOS i Linux (polecane, zawsze aktualne)
brew install opencode              # macOS i Linux (oficjalna formuła brew, rzadziej aktualizowana)
sudo pacman -S opencode            # Arch Linux (Stable)
paru -S redcode-beta              # Arch Linux (Latest from AUR)
mise use -g opencode               # dowolny system
nix run github:Vempire-X/RedCode  # Nix
```

> [!TIP]
> Przed instalacją usuń wersje starsze niż 0.1.x.

### Aplikacja desktopowa (BETA)

RedCode jest także dostępny jako aplikacja desktopowa. Pobierz ją z [opencode.ai/download](https://opencode.ai/download).

| Platforma             | Pobieranie                         |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `redcode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `redcode-desktop-mac-x64.dmg`     |
| Windows               | `redcode-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm` lub AppImage        |

```bash
# macOS (Homebrew)
brew install --cask redcode-desktop
```

#### Katalog instalacji

Skrypt instalacyjny instaluje RedCode w `$HOME/.redcode/bin`.

### Agents

RedCode zawiera dwóch wbudowanych agentów, między którymi możesz przełączać się klawiszem `Tab`.

- **build** - Domyślny agent z pełnym dostępem do pracy developerskiej
- **plan** - Agent tylko do odczytu do analizy i eksploracji kodu
  - Domyślnie odmawia edycji plików
  - Pyta o zgodę przed uruchomieniem komend bash
  - Idealny do poznawania nieznanych baz kodu lub planowania zmian

Dodatkowo jest subagent **general** do złożonych wyszukiwań i wieloetapowych zadań.
Jest używany wewnętrznie i można go wywołać w wiadomościach przez `@general`.

Dowiedz się więcej o [agents](https://opencode.ai/docs/agents).

### Dokumentacja

Więcej informacji o konfiguracji RedCode znajdziesz w [**dokumentacji**](https://opencode.ai/docs).

### Współtworzenie

Jeśli chcesz współtworzyć RedCode, przeczytaj [contributing docs](./CONTRIBUTING.md) przed wysłaniem pull requesta.

### Budowanie na RedCode

Jeśli pracujesz nad projektem związanym z RedCode i używasz "opencode" jako części nazwy (na przykład "opencode-dashboard" lub "opencode-mobile"), dodaj proszę notatkę do swojego README, aby wyjaśnić, że projekt nie jest tworzony przez zespół RedCode i nie jest z nami w żaden sposób powiązany.

---

**Dołącz do naszej społeczności** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
