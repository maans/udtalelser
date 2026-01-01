# Udtalelser v1.0

Statisk (serverløs) browser-app til elevudtalelser og eksportlister.
Alt kører lokalt i din browser og gemmes i `localStorage` — ingen server, ingen database.

## Start

### A) Lokalt
1. Download/clone repo
2. Åbn `index.html` i en browser

### B) GitHub Pages
1. Push repo til GitHub
2. Slå GitHub Pages til (Deploy fra repo root)
3. Åbn Pages-linket

## Data (students.csv)

Appen kræver import af en `students.csv` for at vise elever og K-grupper.

### Påkrævede kolonner (primær)
- Fornavn
- Efternavn
- Unilogin
- Køn
- Klasse
- Kontaktlærer1
- Kontaktlærer2

### Valgfri kolonner (initial overrides)
Case-insensitivt accepteret:
- Initialer for k-lærer1
- Initialer for k-lærer2

Regel:
- Hvis initial-kolonnen har værdi → bruges (trim + uppercase)
- Hvis tom → appen udleder initialer efter konvention (første bogstav i første ord + første bogstav i sidste ord)

> Ingen hardcodede lærerlister: identitet/K-lærer-valg bygges ud fra den importerede elevliste.

## Demo-data

Repoet indeholder `demo_students.csv` med 152 fiktive elever fordelt på 8 K-grupper (2 kontaktlærere pr. gruppe).
Demoen inkluderer også en 3-bogstavs initial-override (fx `MTP`) for at demonstrere feltet.

## Backup / flet

Appen kan eksportere en backup (JSON) og importere den igen.
Import fletter data og overskriver ikke allerede udfyldte felter.

## Print

Print-funktioner er lavet til at kunne bruges direkte fra browseren (Print-dialog).
