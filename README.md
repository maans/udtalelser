# Elevudtalelsesapp (B1.3)

B1.3 tilføjer 3 input-faner til faglærere:
- **Sang** (dropdown pr elev → eksport `sang_marks.csv`)
- **Gymnastik/roller** (dropdown + flueben → eksport `gym_marks.csv`)
- **Elevråd** (flueben → eksport kun markerede `elevraad_marks.csv`)

Alle data importeres lokalt i browseren. Intet uploades til nettet.

## Lokal start
```bash
npm install
npm run dev
```

## GitHub Pages
- Settings → Pages → Source: **GitHub Actions**
- Push til `main` → appen deployes.

## CSV-formater
### students.csv (fra kontoret)
Headere (præcis):
`Fornavn,Efternavn,UNIlogin,Køn`

Køn: `dreng/pige` eller `m/k` (appens normalisering er tolerant).

### sang_marks.csv (eksport fra Sang-fanen)
`UNIlogin,SangValgTekst`

### gym_marks.csv (eksport fra Gym-fanen)
`UNIlogin,GymValgTekst,RollerTekst`  
RollerTekst er `|`-separeret (fx `Fanebærer|DGI-hjælper`).

### elevraad_marks.csv (eksport fra Elevråd-fanen)
Kun markerede elever:
`UNIlogin`
