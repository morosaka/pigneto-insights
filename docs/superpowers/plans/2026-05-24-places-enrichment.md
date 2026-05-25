# Places Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completare le schede dei 62 places attivi con dati fattuali multi-sorgente (Google Maps, TheFork, TripAdvisor, Gambero Rosso) e creare la skill `pausania-enrich-place` per l'arricchimento editoriale interattivo.

**Architecture:** Fase 1 one-shot con subagenti in batch (8-10 places per subagent) per la ricerca fattuale → review doc → SQL bulk UPDATE. Fase 2 skill riutilizzabile per arricchimento editoriale interattivo (description + editorial_intro_md + tags) con approvazione place-by-place.

**Tech Stack:** Supabase MCP (`execute_sql`, `apply_migration`), WebSearch, subagenti paralleli, skill SKILL.md in `~/.claude/skills/`

---

## Schema aggiornato (migration 005 — applicata)

Campi aggiunti alla tabella `places`:

```sql
thefork_rating        FLOAT        -- valutazione TheFork
thefork_review_count  INTEGER      -- numero recensioni TheFork
tripadvisor_rating    FLOAT        -- valutazione TripAdvisor
tripadvisor_review_count INTEGER   -- numero recensioni TripAdvisor
rating_avg            FLOAT        -- media pesata tra tutte le sorgenti disponibili
rating_sources        TEXT[]       -- sorgenti usate, es. ARRAY['google','thefork']
```

I campi `google_rating` e `google_review_count` (migration 004) rimangono per il dato Google specifico.

**Formula rating_avg:** media semplice dei rating disponibili tra Google, TheFork, TripAdvisor. Se una sorgente non ha dati per quel place, viene esclusa dalla media.

```
rating_avg = AVG(rating non-NULL tra google_rating, thefork_rating, tripadvisor_rating)
rating_sources = lista sorgenti che hanno contribuito
```

---

## File Structure

- **Create:** `docs/places-factual-review-2026-05-24.md` — documento di review con tutti i dati fattuali trovati dai subagenti
- **Create:** `~/.claude/skills/pausania-enrich-place/SKILL.md` — skill riutilizzabile
- **Create (symlink):** `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/a86d5241-1538-4c2a-b79f-82cd6d020d71/0fe4c0dd-1f9b-4cb0-a49b-225b8541ab10/skills/pausania-enrich-place/SKILL.md`
- **Modified:** `supabase/migrations/20260524000001_places_multi_source_rating.sql` ✓ (già applicata)
- **Modified:** `lib/types.ts` ✓ (già aggiornato)
- **Modify:** tabella `places` su Supabase (via SQL UPDATE nei Task 1-3)

---

## Task 1: Dispatch subagenti batch — ricerca fattuale eat-drink

**Files:**
- Create: `docs/places-factual-review-2026-05-24.md` (sezione eat-drink)

Dispatcha 4 subagenti in parallelo, ognuno con un batch di ~8 places. Ogni subagent fa web search su Google Maps, TheFork, TripAdvisor e (dove pertinente) Gambero Rosso per i places assegnati, e restituisce JSON strutturato.

- [ ] **Step 1:** Dispatch 4 subagenti in parallelo con questi batch:

**Batch A (id: 1,2,3,4,5,6,7,8):** Birra+, Cargo al Pigneto, Beliveat, Dar Ciriola, Necci dal 1924, Rosti al Pigneto, Fattori, Margarì

**Batch B (id: 9,10,11,12,13,14,15,16):** Vigneto, Le Leccornie, Pigneto Quarantuno, Dolce e Fantasia, Tempesta di Gusti, The Factory, Mr Manzo, Food Art

**Batch C (id: 17,18,19,20,21,22,23,24):** El Dorado, Taverna del Mossob, La Santeria di Mare, Pisù Pigneto, Va.Do., Na Cosetta, Il capriccio di Carla, Fax Factory

**Batch D (id: 25,26,27,28,29,30,58,59,60,61):** Premiata Panineria, Spirito, Lo Yeti, Approdo 56, Scomodo, Corner Pigneto, Da Adriana, IMHO, Frisson, Cantina Dulceri

**Istruzioni per ogni subagent:**

Per ciascun place nel batch assegnato, esegui ricerche web su queste sorgenti:
1. **Google Maps:** cerca `"[nome] Pigneto Roma site:maps.google.com"` o `"[nome] Roma"` su Google — estrai URL Google Maps, rating, numero recensioni
2. **TheFork:** cerca `"[nome] Pigneto Roma site:thefork.it"` o `"[nome] Roma thefork"` — estrai rating (scala /10 → converti in /5 dividendo per 2) e numero recensioni
3. **TripAdvisor:** cerca `"[nome] Pigneto Roma site:tripadvisor.it"` o `"[nome] Roma tripadvisor"` — estrai rating (scala /5) e numero recensioni
4. **Gambero Rosso** (solo per ristoranti, trattorie, wine bar, gelaterie): cerca `"[nome] Pigneto gambero rosso"` — nota solo se presente (sì/no, eventuale punteggio)

Restituisci un JSON array con questa struttura per ogni place:

```json
[
  {
    "id": 5,
    "name": "Necci dal 1924",
    "google_maps_url": "https://maps.google.com/...",
    "google_rating": 4.4,
    "google_review_count": 1823,
    "thefork_rating": 4.1,
    "thefork_review_count": 312,
    "tripadvisor_rating": 4.5,
    "tripadvisor_review_count": 287,
    "gambero_rosso": "non presente",
    "address": null,
    "phone": null,
    "hours": null,
    "website": null,
    "notes": "orari variano stagionalmente"
  }
]
```

Regole:
- Se una sorgente non ha dati per quel place, usa `null` (non omettere il campo)
- `address`, `phone`, `hours`, `website`: compilare SOLO se il valore è NULL nel DB (vedi tabella sotto)
- Se un dato non è trovato su nessuna sorgente, scrivere `null` e aggiungere una nota in `notes`
- TheFork usa scala /10: converti dividendo per 2 prima di restituire

**Places con campi fattuali mancanti (NULL nel DB):**

| ID | Nome | addr | phone | hours | web |
|----|------|------|-------|-------|-----|
| 58 | Da Adriana | ✗ | ✗ | ✗ | ✗ |
| 59 | IMHO Bun & Bites | ✗ | ✗ | ✗ | ✗ |
| 60 | Frisson | ✗ | ✗ | ✗ | ✗ |
| 61 | Cantina Dulceri | ✗ | ✗ | ✗ | ✗ |
| 1  | Birra + | — | — | — | ✗ |
| 10 | Le Leccornie | — | — | — | ✗ |
| 12 | Dolce e Fantasia | — | — | — | ✗ |
| 13 | Tempesta di Gusti | — | — | — | ✗ |
| 14 | The Factory | — | — | — | ✗ |
| 17 | El Dorado | — | — | — | ✗ |
| 18 | Taverna del Mossob | — | — | — | ✗ |

(✗ = mancante, — = già presente, non cercare)

- [ ] **Step 2:** Ricevuti i JSON dai 4 subagenti, compilare la sezione eat-drink di `docs/places-factual-review-2026-05-24.md`:

```markdown
## Eat & Drink

### [ID] Nome locale

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | X.X | NNN |
| TheFork | X.X | NNN |
| TripAdvisor | X.X | NNN |

- **rating_avg calcolato:** X.X (media di N sorgenti)
- **rating_sources:** ['google', 'thefork', 'tripadvisor']
- **google_maps_url:** https://...
- **address:** [solo se era NULL]
- **phone:** [solo se era NULL]
- **hours:** [solo se era NULL]
- **website:** [solo se era NULL]
- **note:** [eventuali note dal subagent]
```

- [ ] **Step 3:** Commit intermedio:

```bash
git -C /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights add docs/places-factual-review-2026-05-24.md
git -C /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights commit -m "data: places factual review — eat-drink batch complete"
```

---

## Task 2: Dispatch subagenti batch — ricerca fattuale essentials

**Files:**
- Modify: `docs/places-factual-review-2026-05-24.md` (sezione essentials)

Dispatcha 3 subagenti in parallelo per gli essentials.

- [ ] **Step 1:** Dispatch 3 subagenti in parallelo:

**Batch E (id: 31,32,34,35,36,37,38,39,40):** Conad City, Il Castoro, Ma Little Market, Da Yasmin, Mercato Rionale, Mercato Condottieri, Edicola, Lavanderia, Ondablu

**Batch F (id: 41,42,43,44,45,46,47,48,49):** Vodafone, New Generation, Dolce Vespa, WeArt Hair, Mr Belly Tattoo, Roma Termini, Pigneto Metro C, Casilina/Villini, Prenestina/Giussano

**Batch G (id: 50,51,52,53,54,55,56,57):** Farmacia Tupputi, Farmacia Sanassi, Farmacia Saltarelli, Poste Italiane, Mail Boxes, Deposito Bagagli, Garage L'Aurora, Autorimessa Malatesta

**Istruzioni per ogni subagent:** stesse del Task 1, con queste differenze per gli essentials:
- Per **Transit** (metro, tram, treni): TheFork e TripAdvisor non pertinenti, cerca solo Google Maps per URL e orari ufficiali. `google_rating` spesso non disponibile per fermate transit — usa `null`.
- Per **Farmacia**: TripAdvisor può avere dati, TheFork non pertinente.
- Per **Grocery/Market**: TheFork non pertinente, Google Maps e TripAdvisor sì.
- Gambero Rosso: non pertinente per nessun essential.

**Places essentials con campi fattuali mancanti:**

| ID | Nome | phone | hours | web |
|----|------|-------|-------|-----|
| 34 | Ma Little Market | ✗ | ✗ | ✗ |
| 35 | Da Yasmin | ✗ | ✗ | ✗ |
| 36 | Mercato Rionale | ✗ | — | ✗ |
| 37 | Mercato Condottieri | ✗ | — | ✗ |
| 38 | Edicola Condottieri | ✗ | ✗ | ✗ |
| 39 | Lavanderia | ✗ | ✗ | ✗ |
| 40 | Ondablu | ✗ | — | — |
| 41 | Vodafone | ✗ | ✗ | — |
| 46 | Roma Termini | ✗ | ✗ | — |
| 47 | Pigneto Metro C | ✗ | — | ✗ |
| 48 | Casilina/Villini | ✗ | — | — |
| 49 | Prenestina/Giussano | ✗ | — | — |
| 50 | Farmacia Tupputi | ✗ | — | ✗ |
| 52 | Farmacia Saltarelli | — | ✗ | ✗ |
| 57 | Autorimessa Malatesta | ✗ | — | ✗ |

- [ ] **Step 2:** Compilare sezione essentials del documento di review (stesso formato eat-drink).

- [ ] **Step 3:** Commit:

```bash
git -C /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights add docs/places-factual-review-2026-05-24.md
git -C /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights commit -m "data: places factual review — essentials batch complete"
```

---

## Task 3: Review utente + SQL bulk UPDATE

**Files:**
- Modify: tabella `places` su Supabase

- [ ] **Step 1:** Presentare il documento di review completo. Attendere approvazione o correzioni dall'utente.

- [ ] **Step 2:** Incorporare le correzioni.

- [ ] **Step 3:** Per ogni place, eseguire l'UPDATE. Template SQL per un place:

```sql
UPDATE places SET
  google_maps_url          = 'https://maps.google.com/?cid=...',
  google_rating            = 4.4,
  google_review_count      = 1823,
  thefork_rating           = 4.1,
  thefork_review_count     = 312,
  tripadvisor_rating       = 4.5,
  tripadvisor_review_count = 287,
  rating_avg               = 4.33,   -- (4.4 + 4.1 + 4.5) / 3
  rating_sources           = ARRAY['google', 'thefork', 'tripadvisor']
WHERE id = 5;
```

Per i places con sorgenti parziali (es. solo Google e TheFork):

```sql
UPDATE places SET
  google_maps_url      = 'https://maps.google.com/?cid=...',
  google_rating        = 4.2,
  google_review_count  = 156,
  thefork_rating       = 4.0,
  thefork_review_count = 43,
  tripadvisor_rating   = NULL,
  rating_avg           = 4.1,       -- (4.2 + 4.0) / 2
  rating_sources       = ARRAY['google', 'thefork']
WHERE id = 14;
```

- [ ] **Step 4:** Verifica post-update:

```sql
SELECT id, name, google_rating, thefork_rating, tripadvisor_rating, rating_avg, rating_sources
FROM places
WHERE active = true
ORDER BY tab, name;
```

Atteso: `rating_avg` e `rating_sources` compilati per tutti i places con almeno una sorgente trovata.

- [ ] **Step 5:** Commit documento di review approvato:

```bash
git -C /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights add docs/places-factual-review-2026-05-24.md
git -C /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights commit -m "data: places factual review approved and applied to DB"
```

---

## Task 4: Scrittura skill `pausania-enrich-place`

**Files:**
- Create: `~/.claude/skills/pausania-enrich-place/SKILL.md`

- [ ] **Step 1:**

```bash
mkdir -p ~/.claude/skills/pausania-enrich-place
```

- [ ] **Step 2:** Scrivere `~/.claude/skills/pausania-enrich-place/SKILL.md`:

````markdown
---
name: pausania-enrich-place
description: Arricchimento editoriale interattivo di un place in Pigneto Insights. Fa web search, propone description (~20 parole) + editorial_intro_md (~60-70 parole, plain text) + tags, attende approvazione, salva nel DB via Supabase MCP.
---

# Skill: pausania-enrich-place

Skill per completare le schede dei places in Pigneto Insights con testi editoriali.
Usa Supabase MCP per leggere e scrivere. Usa WebSearch per raccogliere contesto.

## Flusso

### 1. Selezione place

Se viene passato un nome o ID come argomento, usalo direttamente.

Altrimenti esegui:

```sql
SELECT id, name, tab, category, description, editorial_intro_md
FROM places
WHERE active = true AND editorial_intro_md IS NULL
ORDER BY tab, category, name;
```

Mostra la lista e chiedi quale place trattare.

### 2. Lettura dati esistenti

```sql
SELECT id, name, tab, category, description, address, hours, phone, website,
       google_rating, thefork_rating, tripadvisor_rating, rating_avg, rating_sources,
       editorial_intro_md, tags
FROM places
WHERE id = [id scelto];
```

### 3. Web search

Esegui 1-2 ricerche web per raccogliere contesto aggiuntivo sul locale:
- `"[nome] Pigneto Roma"` per caratteristiche, atmosfera, specialità
- Cerca recensioni recenti se il locale ha aperto da poco

Usa il contesto per arricchire i testi — non per riportare dati fattuali già in DB.

### 4. Generazione proposte

**A. description** (~20 parole)
- Due frasi che catturano l'essenza del locale
- Tono editoriale diretto, mai promozionale
- In inglese
- Nessun superlativo
- Deve trasmettere perché vale la pena andarci — questi sono posti raccomandati agli ospiti

**B. editorial_intro_md** (~60-70 parole)
- PLAIN TEXT — nessuna formattazione Markdown (niente *, **, #, _, backtick)
  Il campo è renderizzato come <p fontStyle="italic"> senza parser Markdown.
  Asterischi e underscore apparirebbero letteralmente nel testo pubblicato.
- Non iniziare con il nome del locale
- Inizia con un dettaglio fisico, sensoriale o di contesto specifico
- Chiudi con una micro-raccomandazione pratica (quando andare, cosa ordinare, a chi è adatto)
- Non includere l'indirizzo (è già visibile nella UI come campo separato)
- Nessun superlativo, nessun "il miglior", nessun "eccellente"
- Non usare corsivo come enfasi: tutto il blocco è già in italic CSS

Riferimenti di stile approvati:

Da Adriana (Trattoria): "Adriana's tortelli are filled with coda alla vaccinara — oxtail stew, the smell of Roman Sunday lunch before the city forgot how to cook it. The pasta is hand-rolled every morning. It opened this spring and the neighbourhood noticed immediately: a weekday table is still possible, a weekend one less so. Go for lunch if you can."

IMHO Bun & Bites (Street food): "The name is unpromising and the space is small. But since March 2026, this corner has been turning out gourmet buns with the kind of sourcing discipline that doesn't need a press release. Fast, good, closes early. When the heat makes a full sit-down feel like too much, this is the answer."

Frisson (Gastropub): "The room at Via Alberto da Giussano 37 wants to be several things at once — a record listening space, an indie bookshop, a restaurant. The shared plates are described by the kitchen as acidic and sharp, which turns out to be exactly what they are. Go for aperitivo hour; stay longer if the music earns it."

Cantina Dulceri (Wine bar): "A wine cellar that has quietly become the neighbourhood's natural wine room. The selection is Lazio-focused, mostly biodynamic, producers you won't find near the Colosseum. The ritual is simple: arrive at aperitivo, let them pour something obscure, ask about it. The conversation is usually worth the evening."

Adatta tono e struttura alla categoria del place:
- Trattoria/Restaurant: più narrativo, dettaglio sul cibo o sulla storia
- Bar/Café: atmosfera, rituale, momento della giornata
- Wine bar: selezione, produttori, rituale dell'aperitivo
- Street food: praticità, velocità, qualità inaspettata
- Essentials (farmacia, lavanderia, transit): tono pratico ma non piatto — trovare il dettaglio che lo rende utile da sapere

**C. tags** (array di stringhe)
Proponi tag pertinenti. Esempi (non esaustivi):
`outdoor-seating`, `live-music`, `dog-friendly`, `cash-only`, `reservations-needed`,
`good-for-groups`, `takeaway`, `late-night`, `breakfast`, `natural-wine`,
`craft-beer`, `vegetarian-options`, `wifi`, `delivery`, `open-sunday`,
`no-reservations`, `standing-only`, `good-for-dates`

### 5. Presentazione e approvazione

Mostra le proposte in modo chiaro:

---
**[ID] Nome locale** (category · tab)
Rating medio: [rating_avg]/5 da [rating_sources]

**description:**
> [testo proposto]

**editorial_intro_md:**
> [testo proposto]

**tags:** ["tag1", "tag2", "tag3"]

---

Chiedi: "Approvi tutto, o vuoi modificare qualcosa? Puoi anche chiedermi di rigenerare un campo specifico."

Accetta correzioni campo per campo finché l'utente approva.

### 6. Salvataggio

Solo dopo approvazione esplicita:

```sql
UPDATE places SET
  description        = '[testo approvato]',
  editorial_intro_md = '[testo approvato]',
  tags               = ARRAY['tag1', 'tag2', 'tag3']
WHERE id = [id];
```

Conferma con:

```sql
SELECT id, name, description, editorial_intro_md, tags FROM places WHERE id = [id];
```

### 7. Continuazione

Chiedi: "Vuoi continuare con un altro place?"
Se sì, torna al passo 1.
Se no, mostra quanti places hanno ancora `editorial_intro_md IS NULL`.
````

- [ ] **Step 3:** Verifica:

```bash
head -5 ~/.claude/skills/pausania-enrich-place/SKILL.md
```

Atteso: le prime righe del frontmatter YAML (`---`, `name: pausania-enrich-place`).

---

## Task 5: Symlink skill in Cowork/Chat

- [ ] **Step 1:**

```bash
COWORK="$HOME/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/a86d5241-1538-4c2a-b79f-82cd6d020d71/0fe4c0dd-1f9b-4cb0-a49b-225b8541ab10/skills"
mkdir -p "$COWORK/pausania-enrich-place"
ln -sf "$HOME/.claude/skills/pausania-enrich-place/SKILL.md" "$COWORK/pausania-enrich-place/SKILL.md"
```

- [ ] **Step 2:** Verifica:

```bash
ls -la "$HOME/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/a86d5241-1538-4c2a-b79f-82cd6d020d71/0fe4c0dd-1f9b-4cb0-a49b-225b8541ab10/skills/pausania-enrich-place/"
```

Atteso: symlink che punta a `~/.claude/skills/pausania-enrich-place/SKILL.md`.

---

## Task 6: Test skill su place campione

- [ ] **Step 1:** Invoca `/pausania-enrich-place` su Cargo al Pigneto (id=2) — ha tutti i dati fattuali, `editorial_intro_md` NULL. Verifica flusso completo: lettura DB → web search → proposte → approvazione → salvataggio.

- [ ] **Step 2:** Verifica nel DB dopo salvataggio:

```sql
SELECT id, name, description, editorial_intro_md, tags FROM places WHERE id = 2;
```

Atteso: i tre campi compilati con i valori approvati.

---

## Note operative

- Completare i Task 1-3 (batch fattuale) prima di usare la skill editoriale: la skill legge `rating_avg` e `rating_sources` per contestualizzare i testi.
- Per i places Transit (metro, tram, treni): editorial_intro_md sarà pratico, non lirico — adattare tono di conseguenza.
- Se web search restituisce poco (local poco noto, no social), basarsi su `description` esistente e Google Maps reviews.
- **Gambero Rosso** non ha API — ricerca via web. Se presente, citare nella nota del documento di review ma non salvare in DB (nessun campo dedicato).
