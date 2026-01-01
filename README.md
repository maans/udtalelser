# Udtalelser v1.0

En statisk (serverløs) browser-app til kontaktlærere og faglærere på HU, der samler udtalelser, skabeloner og “flueben” lokalt i browseren (localStorage).

## Sådan bruger du appen (kort)

1. Åbn appen (GitHub Pages).
2. Gå til **Indstillinger → Import** og indlæs din elevliste (**students.csv**).
3. Gå til **Indstillinger → Generelt** og vælg/skriv dine initialer.
4. Brug fanen **K-elever** til at skrive udtalelser og fanen **Redigér** til fuld visning/print.
5. Brug **Backup (download)** som sikkerhed, og **Importér backup** til at samle flere læreres arbejde i én browser uden at overskrive udfyldte felter.

## Krav til elevliste (students.csv)

CSV’en skal mindst indeholde disse kolonner (header-navne er fleksible – appen genkender flere varianter):

- **Fornavn**
- **Efternavn**
- **Klasse**
- (valgfri) **UniLogin**
- (valgfri men anbefalet) **Kontaktlærer1** og **Kontaktlærer2**

### Valgfri “initial-override”
Hvis enkelte kontaktlærernavne ikke følger standardreglen (første bogstav i fornavn + første bogstav i efternavn), kan du tilføje:

- **Initialer for k-lærer1**
- **Initialer for k-lærer2**

Hvis felterne er tomme, bruger appen standardreglen (med få indbyggede undtagelser, kun hvis navnene faktisk forekommer i CSV’en).

## Demo
Repo’et kan indeholde en demo-fil med opdigtede data:

- `demo_students.csv`

Den kan indlæses i **Indstillinger → Import** for at prøve appen uden rigtige elevdata.

## Teknisk
- Ingen server, ingen login.
- Alt gemmes lokalt i browseren.
- Backup/Import er JSON-baseret og fletter sikkert (udfyldte felter bevares).
