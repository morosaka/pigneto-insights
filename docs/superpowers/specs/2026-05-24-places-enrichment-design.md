# Places Enrichment — Design Spec
**Data:** 2026-05-24

## Contesto

62 places attivi nel DB (34 eat-drink, 28 essentials). La maggior parte ha già `description`, `cover_url`, `address`, `phone`, `hours`. I campi che mancano sistematicamente sono:

| Campo | Gap |
|---|---|
| `google_maps_url` | 62/62 mancanti |
| `google_rating` + `google_review_count` | 62/62 mancanti |
| `editorial_intro_md` | 58/62 mancanti |
| `description` (revisione) | 62/62 da riscrivere |
| `tags` | 62/62 vuoti |
| `address/phone/hours` | 4–8 mancanti |

---

## Fase 1 — Batch fattuale (sessione unica, no skill)

**Obiettivo:** compilare tutti i campi fattuali per tutti i 62 places in una sola sessione.

**Esecuzione:**
1. Web search mirata per ogni place (`"[nome] Pigneto Roma"` o `"[nome] Roma"`)
2. Estrazione: `google_maps_url`, `google_rating`, `google_review_count`, e dove mancanti: `address`, `phone`, `hours`, `website`
3. Output: documento Markdown di review con tutti i dati trovati, organizzato per place
4. L'utente rivede e segna le correzioni
5. Bulk SQL UPDATE da file revisionato

**Scope:** questa fase avviene subito dopo l'approvazione del design — non è una skill, è lavoro di questa sessione.

---

## Fase 2 — Skill `pausania-enrich-place`

**Scopo:** arricchimento editoriale di un place alla volta, con approvazione dell'utente prima del salvataggio. Riutilizzabile ogni volta che viene aggiunto un nuovo place o si vuole riscrivere i testi di uno esistente.

### Flusso

1. **Selezione place** — se non viene passato nome/ID, mostra la lista dei places con `editorial_intro_md IS NULL`, l'utente sceglie
2. **Ricerca** — web search per raccogliere contesto sul locale (menu, recensioni, caratteristiche)
3. **Lettura DB** — legge i campi esistenti (`name`, `category`, `description`, `address`, `hours`, `tab`)
4. **Generazione proposte:**
   - `description` — ~20 parole, due frasi, tono editoriale diretto, in inglese
   - `editorial_intro_md` — ~60–70 parole, voce literaria/insider, plain text (no Markdown), in inglese
   - `tags` — array proposto basato su caratteristiche riscontrate
5. **Approvazione** — mostra tutto in chiaro; l'utente può approvare, correggere campo per campo, o richiedere rigenerazione di un campo specifico
6. **Salvataggio** — `UPDATE places SET description=?, editorial_intro_md=?, tags=? WHERE id=?`
7. **Continuazione** — chiede se procedere con il prossimo place o fermarsi

### Regole voce editoriale

- **Lingua:** inglese
- **Formato:** plain text — il campo `editorial_intro_md` è renderizzato come `<p fontStyle="italic">` senza parser Markdown; usare Markdown causerebbe caratteri grezzi visibili
- **Lunghezza:** 60–70 parole per `editorial_intro_md`, ~20 parole per `description`
- **Apertura:** inizia con un dettaglio fisico, sensoriale o di contesto — mai con il nome del locale
- **Chiusura:** micro-raccomandazione pratica (quando andare, cosa ordinare, a chi è adatto)
- **No indirizzo nel testo:** è già visibile come campo separato nella UI
- **No superlativi:** niente "il miglior", "eccellente", "fantastico"
- **No corsivo nel testo:** l'intera UI renderizza già il blocco in italic via CSS
- **Coerenza di stile:** stesso tono su tutti i places, senza diventare formulaico — variare struttura e apertura

### Esempi di riferimento (4 intro già approvate)

**Da Adriana (Trattoria):**
> Adriana's tortelli are filled with coda alla vaccinara — oxtail stew, the smell of Roman Sunday lunch before the city forgot how to cook it. The pasta is hand-rolled every morning at Piazza dei Condottieri 49. It opened this spring and the neighbourhood noticed immediately: a weekday table is still possible, a weekend one less so. Go for lunch if you can.

**IMHO Bun & Bites (Street food):**
> The name is unpromising and the space is small. But since March 2026, Via Renzo da Ceri 6 has been turning out gourmet buns with the kind of sourcing discipline that doesn't need a press release. Fast, good, closes early. When the heat makes a full sit-down feel like too much, this is the answer.

**Frisson (Gastropub):**
> The room at Via Alberto da Giussano 37 wants to be several things at once — a record listening space, an indie bookshop, a restaurant. Chef Leopoldo Di Martino's shared plates are described by the kitchen as "acidic and sharp," which turns out to be exactly what they are. Go for aperitivo hour; stay longer if the music earns it.

**Cantina Dulceri (Wine bar):**
> At Via Augusto Dulceri 56, a wine cellar that has quietly become the neighbourhood's natural wine room. The selection is Lazio-focused, mostly biodynamic, producers you won't find near the Colosseum. The ritual is simple: arrive at aperitivo, let them pour something obscure, ask about it. The conversation is usually worth the evening.

---

## Decisioni chiave

- La fase fattuale non è una skill: si fa una volta sola, non ha senso incapsularla
- I tag non hanno vocabolario predefinito: vengono proposti dall'AI per ogni place
- Il campo si chiama `editorial_intro_md` ma non renderizza Markdown — il testo deve essere plain text
- Il corsivo non funziona come enfasi perché tutto il blocco è già in italic CSS
