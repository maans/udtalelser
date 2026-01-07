# Udtalelser v1.0

En lille, statisk browser-app til at skrive elevudtalelser.

- **Ingen server**. Kører som ren HTML/CSS/JS (GitHub Pages eller lokalt).
- **Gemmer lokalt** i browserens `localStorage` (pr. enhed/browser).
- Importér en elevliste (CSV) og skriv udtalelser / markeringer / print.

## Start

### Lokalt
Åbn `index.html` i en moderne browser.

### GitHub Pages
Publicér repoet som GitHub Pages og åbn siden.

## Data & import (overblik)

Typisk arbejdsgang:

1. **Indlæs elevliste (CSV)** (eller brug demo-data).
2. Sæt dine **initialer / K‑lærer** i *Indstillinger → Generelt*.
3. Arbejd i fanerne:
   - **K-elever**: overblik, søgning, markeringer, print
   - **Redigér**: skabeloner/tekster (med låst redigering hvor relevant)
   - **Indstillinger**: identitet, import/backup og generelle valg

Tip: I headeren kan du klikke på **✏️ + K‑lærerens fulde navn** for hurtigt at gå til *Indstillinger → Generelt* og skifte K‑lærer.

## Demo-data

Repoet indeholder `demo_students.csv` med **fiktive elever** fordelt på K‑grupper.
Alle navne og kontaktlærere er opdigtede.

## Backup / import / flet

Backup eksporteres som en fil, du kan gemme lokalt.

Når du importerer en backup igen, **fletter** appen data:

- udfyldte felter i din nuværende browser overskrives ikke af tomme felter fra backup
- formålet er at kunne samle arbejde fra flere maskiner uden at miste tekst
- backup kan deles med kolleger uden at “nulstille” deres lokale data

### Import-adfærd (K-lærer)

- Hvis backuppen indeholder aktiv K‑lærer, gendannes den, og appen går direkte til **K‑elever**.
- Hvis backuppen mangler aktiv K‑lærer, går appen til **Indstillinger → Generelt** og beder dig vælge K‑lærer.
- Hvis filnavnet starter med fx `AB-...` eller `EB_...`, bruges det som **prefill** (genvej), men du skal stadig bekræfte valget.

## Multi-fane: “tab-lås” (single-writer)

For at undgå konflikter i `localStorage` kan kun **én** browser-fane skrive ad gangen:

- Første fane der åbnes får redigering.
- Andre faner går i **visning-tilstand** og får et banner: *“Appen er åben i en anden fane”*.
- I banneret kan man trykke **“Overtag redigering”** (fx hvis den anden fane er lukket eller frosset).

## Notes

- Fordi `localStorage` er lokalt, skal man lave backup ved skift af enhed/browser.
---

## Logo override ved udskrift (Model B)

Appen understøtter udskiftning af logo på udskrifter **uden ændringer i kode**.

### Sådan gør du
1. Gå til mappen:
   ```
   /overrides
   ```
2. Her ligger `print_logo.example.png` som en **skabelon** (korrekt størrelse/proportioner og transparent baggrund).
3. Kopiér skabelonen, erstat grafikken med dit eget logo, og gem som:
   ```
   print_logo.png
   ```

### Prioritet ved print
1. Lokalt test-logo (hvis valgt i UI – kun til preview)
2. `/overrides/print_logo.png`
3. Indbygget fallback-logo

### Tekniske noter
- Anbefalet format: **PNG** (SVG understøttes også)
- Baggrund: **transparent**
- Størrelse: lille og bred (ca. max 600×200 px)
- `print_logo.example.png` bruges **aldrig** af appen – den er kun reference
