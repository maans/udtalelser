# Udtalelser v1.0

En lille, statisk browser-app til at skrive elevudtalelser.

- **Ingen server**. Kører som ren HTML/CSS/JS (GitHub Pages eller lokalt).
- **Gemmer lokalt** i browserens `localStorage` (pr. enhed/browser).
- Importér en elevliste (`students.csv`) og skriv udtalelser / markeringer / print.

## Start

### Lokalt
Åbn `index.html` i en moderne browser.

### GitHub Pages
Publicér repoet som GitHub Pages og åbn siden.

## Import af elevliste (students.csv)

Appen forventer en CSV med overskrifter. Separator kan typisk være `;` eller `,` (appens import forsøger at håndtere begge).

### Primære kolonner (anbefalet)
- Fornavn
- Efternavn
- Unilogin (valgfri men anbefalet)
- Køn (valgfri)
- Klasse
- Kontaktlærer1
- Kontaktlærer2

### Valgfri kolonner (for initialer)
- Initialer for k-lærer1
- Initialer for k-lærer2

**Regel:**
- Hvis *Initialer for k-lærerX* er udfyldt → bruges direkte (trim + uppercase).
- Hvis tom → appen udleder initialer generisk fra kontaktlærer-navnet (første bogstav i første og sidste ord).

> Appen viser og bruger kontaktlærere som **initialer** i UI (persondata-sikkert).

### Uni‑C variant (accepteret)
Appen forsøger også at genkende disse (case‑insensitivt):
- Klasse, Fornavn, Efternavn, Uni‑C brugernavn
- Relationer‑Kontaktlærer‑Navn
- Relationer‑Anden kontaktlærer‑Navn
- (valgfri) Initialer for k‑lærer1 / k‑lærer2

## Demo-data

Repoet indeholder `demo_students.csv` med **152 fiktive elever** fordelt på **8 K‑grupper** (2 kontaktlærere pr. gruppe).
Alle navne og kontaktlærere er opdigtede.

## Backup / import / flet

Backup eksporteres som en fil, du kan gemme lokalt. Når du importerer en backup igen, **fletter** appen data:
- udfyldte felter i din nuværende browser overskrives ikke af tomme felter fra backup
- formålet er at kunne samle arbejde fra flere maskiner uden at miste tekst

## Notes

- Fordi `localStorage` er lokalt, skal man lave backup ved skift af enhed/browser.
