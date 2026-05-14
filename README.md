# Prayer Cards App

A local-first prayer card app for names, requests, priorities, prayer history, timed prayer, and offline verse suggestions.

Live web app:

https://ezhu03.github.io/Prayer-Cards-App/

This repository includes the static web app plus the native macOS wrapper source. Personal prayer cards are not stored in this repository; each user's data stays in their own browser or macOS app storage unless they manually export it.

## Use The Website

Open the live GitHub Pages site:

https://ezhu03.github.io/Prayer-Cards-App/

The website can also be opened locally by running a small server from this folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

## Download The macOS App

Go to the latest release:

https://github.com/ezhu03/Prayer-Cards-App/releases/latest

Download `Prayer-Cards-macOS.zip`, unzip it, then open `Prayer Cards.app`.

Because this is a locally signed app, macOS may warn that it cannot verify the developer. If that happens, right-click `Prayer Cards.app`, choose **Open**, then choose **Open** again.

The macOS app stores its cards separately from the browser version. Use **Export** and **Import** inside the app if you want to move cards between the website and desktop app.

## Build The macOS App From Source

Requirements:

- macOS
- Xcode Command Line Tools
- Python 3 with Pillow available to the build script

Build:

```bash
./scripts/build-macos-app.sh
```

Open:

```text
build/macos/Prayer Cards.app
```

The build script signs the app locally and stages the bundle in `/private/tmp/prayer-cards-macos-build`. It copies only the web files and assets required by the app.

## Verse Suggestions

Verse suggestions work offline with the built-in verse matcher and avoid reusing verse references across cards. The matcher has a broad local category bank for common prayer requests, scores related intent profiles and phrase/token overlap, and rotates through extra default verses when there is no direct category match.

In the macOS app, optional OpenAI-assisted verse selection is enabled when the app process has `OPENAI_API_KEY` set, or when `~/.prayer-cards-openai-key` contains a key. The native wrapper calls the OpenAI Responses API and asks the model to choose one unused reference from the app's local candidate list; verse text still comes from the local app data, and the API key is never embedded in browser JavaScript. Set `OPENAI_MODEL` to override the default model.

## Import Format

Imports support this app's JSON export and CSV files with:

```csv
name,note,priority,flags
Jane,Pray for healing,high,health;family
```
