# Udtalelser v1.0

Udtalelser v1.0 er en lille, serverløs browser-app til at skrive og koordinere elevudtalelser uden login og uden server.
Alt gemmes lokalt i din browser (localStorage) — ingen elevdata sendes nogen steder.

## Hvem er den til?
- **Kontaktlærere**: skriver udtalelser og samler input fra kolleger
- **Faglærere** (fx sang/gym/roller/elevråd): sætter vurderinger og **eksporterer CSV** til kontaktlærere

## Data, samarbejde og “CSV vs. Backup”
- **CSV** = del vurderinger (små fag-specifikke input-filer)
- **Backup (JSON)** = gem/flyt/del *det hele* (elever, udtalelser, indstillinger, tekster m.m.)
- Backup-import har en **sikker flettefunktion**: udfyldte felter overskrives ikke af tomme felter.

## Kom i gang
1. Åbn `index.html` i en moderne browser (Chrome/Edge/Firefox).
2. Indlæs elevliste under **Indstillinger → Import**.
3. Vælg/indtast din identitet under **Indstillinger → Generelt**.

## Dokumentation
- **Hjælp-fanen** i appen: kort og praktisk (workflow + FAQ)
- **Udvidet guide (PDF)**: `docs/Udtalelser_Enkelhed_Sikkerhed.pdf`
- **Infografik (PNG)**: `docs/infografik.png`

## Status
v1.0 er designet til stabil drift i udtalelsesperioder med fokus på:
robusthed, forudsigelighed og enkel samarbejdslogik (filer fremfor server).
