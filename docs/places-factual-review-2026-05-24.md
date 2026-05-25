# Places Factual Review — 2026-05-24

> **Stato:** Batch D (id 25-30, 58-61) ancora in arrivo — sezione marcata come PENDING.
> **Dopo la review:** segnare le correzioni e confermare per il bulk UPDATE SQL.

---

## ⚠️ FLAG CRITICHE — Da verificare prima del salvataggio

| ID | Nome | Flag |
|----|------|------|
| 16 | Food Art | **POSSIBILE CHIUSURA DEFINITIVA** — più fonti segnalano chiusura permanente. Verificare prima di aggiornare, valutare `active = false`. |
| 61 | Cantina Dulceri | **STESSO INDIRIZZO DI APPRODO 56** — Via Augusto Dulceri 56 è identico a id=28. Facebook reindirizza a Approdo 56. Potrebbe essere un format serale dello stesso spazio. Chiarire prima di aggiornare. |
| 48 | Casilina/Villini RMG | **LINEA SOSPESA?** — fonti 2026 indicano tratta Centocelle-Laziali chiusa, sostituita da bus in attesa del metrotram linea G. Verificare prima di mantenere active=true. |
| 51 | Farmacia Sanassi | **ORARI ERRATI IN DB** — DB ha "24/7" ma ricerca trova lun-sab 07:00-22:00, dom 16:00-22:00. |
| 55 | Deposito Bagagli Termini | **INDIRIZZO INCERTO** — DB ha Via Giolitti 14, ricerca trova Via Giolitti 34. |
| 7  | Fattori | **INDIRIZZO POTENZIALMENTE OBSOLETO** — DB ha Via Alberto da Giussano 76 (storica), sede attiva Pigneto potrebbe essere Piazza dei Condottieri 55. |

> **Nota generale sugli URL Google Maps:** i subagenti non riescono a estrarre URL diretti CID-based via web search. La maggior parte degli URL restituiti sono search URL o direction URL — non aprono la scheda business direttamente. Da sostituire manualmente con gli URL veri dopo verifica su Google Maps.

---

## EAT & DRINK

### [1] Birra + — Brewery
*Via del Pigneto 105*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | — | — |
| TripAdvisor | **4.7** | 31 |

**rating_avg proposto:** 4.7 (1 sorgente)
**rating_sources:** `['tripadvisor']`
**google_maps_url:** non trovato
**Campi mancanti trovati:** nessuno (website già NULL nel DB)
**Note:** Non presente su TheFork. Google rating non confermato.

---

### [2] Cargo al Pigneto — Restaurant
*Via del Pigneto 20*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.2** | — |
| TheFork | — | — |
| TripAdvisor | **4.4** | 335 |

**rating_avg proposto:** 4.3 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Non presente su TheFork.

---

### [3] Beliveat al Pigneto — Seafood
*Via Braccio da Montone 7*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | URL trovato, rating non estratto | — |
| TripAdvisor | **4.5** | 254 |

**rating_avg proposto:** 4.5 (1 sorgente — TripAdvisor)
**rating_sources:** `['tripadvisor']`
**google_maps_url:** `https://goo.gl/maps/1en2SAvCZPS2` *(da verificare)*
**Note:** Presente su TheFork (thefork.it/ristorante/beliveat-al-pigneto/262811) ma rating non estratto. Google rating non confermato direttamente.

---

### [4] Dar Ciriola — Café
*Via Pausania 2a*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.5** | — |
| TheFork | — | — |
| TripAdvisor | **4.3** | 454 |

**rating_avg proposto:** 4.4 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Non presente su TheFork.

---

### [5] Necci dal 1924 — Café
*Via Fanfulla da Lodi 68*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.2** | — |
| TheFork | URL trovato, rating non estratto | — |
| TripAdvisor | **4.0** | 1360 |

**rating_avg proposto:** 4.1 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** `https://www.google.com/maps?cid=1532750368611773760` *(CID trovato — verificare)*
**Note:** Presente su TheFork (r52884) ma rating non estratto.

---

### [6] Rosti al Pigneto — Restaurant
*Via Bartolomeo d'Alviano 65*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.0** | — |
| TheFork | — | — |
| TripAdvisor | **3.1** | 1672 |

**rating_avg proposto:** 3.6 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Rating TripAdvisor basso (3.1) nonostante alto volume. Confermare inclusione nella media.

---

### [7] Fattori — Café/Gelateria
*Via Alberto da Giussano 76 (DB) — ⚠️ verificare se sede attiva è Piazza dei Condottieri 55*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.2** | — |
| TheFork | — | — |
| TripAdvisor | **4.0** | 318 |

**rating_avg proposto:** 4.1 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Scheda TripAdvisor corrisponde alla sede Piazza dei Condottieri 55. Verificare indirizzo corretto nel DB.

---

### [8] Margarì — Restaurant
*Via Marco Vincenzo Coronelli 30*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.3** | >1000 |
| TheFork | — | — |
| TripAdvisor | **4.0** | 324 |

**rating_avg proposto:** 4.2 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Esiste anche scheda Via Coronelli 59 su TripAdvisor — usata quella del 30.

---

### [9] Vigneto — Wine bar
*Piazza dei Condottieri 26/27*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.4** | — |
| TheFork | — | — |
| TripAdvisor | **4.0** | 64 |
| **Gambero Rosso** | ✅ citato | guida "migliori wine bar di Roma" |

**rating_avg proposto:** 4.2 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note Gambero Rosso:** citato nella guida ai migliori wine bar di Roma — ottimo per editoriale.

---

### [10] Le Leccornie — Seafood
*Via Capitan Ottobono 6*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.2** | — |
| TheFork | **4.45** | — |
| TripAdvisor | **4.0** | 185 |

**rating_avg proposto:** 4.2 (3 sorgenti)
**rating_sources:** `['google', 'thefork', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Campi mancanti trovati:** website → **non trovato** (rimane NULL)
**Note:** TheFork URL: thefork.it/ristorante/le-leccornie-r304789. È una pescheria con cucina.

---

### [11] Pigneto Quarantuno — Trattoria
*Via del Pigneto 41*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.3** | — |
| TheFork | **4.4** | 85 |
| TripAdvisor | **4.0** | 457 |

**rating_avg proposto:** 4.2 (3 sorgenti)
**rating_sources:** `['google', 'thefork', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** TheFork URL: thefork.it/ristorante/pigneto-quarantuno-r803281.

---

### [12] Dolce e Fantasia — Street food/Bakery
*Via Pausania 1/B*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.4** | **429** |
| TheFork | — | — |
| TripAdvisor | **4.3** | 70 |

**rating_avg proposto:** 4.4 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Campi mancanti trovati:** website → **non trovato** (rimane NULL)
**Note:** Indirizzo esatto Via Pausania 1/B.

---

### [13] Tempesta di Gusti — Gelateria
*Via del Pigneto 191*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.7** | — |
| TheFork | — | — |
| TripAdvisor | **4.5** | 44 |

**rating_avg proposto:** 4.6 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato
**Campi mancanti trovati:** website → **non trovato** (rimane NULL)
**Note:** Specializzata in opzioni vegan/dairy-free. Email: gelateria.tempesta@gmail.com (non da salvare).

---

### [14] The Factory — Brewery
*Piazza dei Condottieri 40*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.4** | — |
| TheFork | — | — |
| TripAdvisor | **4.3** | 216 |

**rating_avg proposto:** 4.4 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Campi mancanti trovati:** website → **https://www.thefactoryroma.it/** ✅

---

### [15] Mr Manzo Griglieria — Steakhouse
*Via Alberto da Giussano 82*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.4** | — |
| TheFork | — | — |
| TripAdvisor | **4.1** | 565 |

**rating_avg proposto:** 4.3 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)

---

### [16] Food Art — Restaurant ⚠️ POSSIBILE CHIUSURA DEFINITIVA
*Via Giovanni de Agostini 80*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | URL trovato, prob. chiuso | — |
| TripAdvisor | **4.0** | 116 |

**AZIONE RICHIESTA:** Verificare se il locale è ancora aperto prima di aggiornare i dati. Se chiuso, impostare `active = false`.

---

### [17] El Dorado — International (Peruviano)
*Via Prenestina 135*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.5** *(bassa confidenza)* | — |
| TheFork | — | — |
| TripAdvisor | — | — |

**rating_avg proposto:** 4.5 (1 sorgente, bassa confidenza)
**rating_sources:** `['google']`
**google_maps_url:** non trovato
**Campi mancanti trovati:** website → **non trovato** (rimane NULL)
**Note:** Il rating 4.5 proviene da RestaurantGuru (aggregatore), non direttamente da Google. Bassa confidenza. Il locale è cucina Peruviana/Latinoamericana, non genericamente "International" come nel DB — valutare se aggiornare category.

---

### [18] Taverna del Mossob — International (Eritreo/Etiopico)
*Via Prenestina 109*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.5** | — |
| TheFork | — | — |
| TripAdvisor | **4.2** | 154 |

**rating_avg proposto:** 4.4 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato
**Campi mancanti trovati:** website → **https://tavernadelmossob.eatbu.com** *(sito su piattaforma eatbu — da valutare)*

---

### [19] La Santeria di Mare — Seafood
*Via del Pigneto 209*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | **4.45** | — |
| TripAdvisor | **4.0** | 219 |

**rating_avg proposto:** 4.2 (2 sorgenti)
**rating_sources:** `['thefork', 'tripadvisor']`
**google_maps_url:** non trovato

---

### [20] Pisù Pigneto (piSù Sushi) — Japanese
*Via Luigi Filippo de Magistris 74*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.1** | — |
| TheFork | — | — |
| TripAdvisor | — | — |

**rating_avg proposto:** 4.1 (1 sorgente)
**rating_sources:** `['google']`
**google_maps_url:** non trovato

---

### [21] Va.Do. al Pigneto — Restaurant
*Via Braccio da Montone 56*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.4** | **1772** |
| TheFork | **4.6** | — |
| TripAdvisor | **4.4** | 632 |

**rating_avg proposto:** 4.5 (3 sorgenti)
**rating_sources:** `['google', 'thefork', 'tripadvisor']`
**google_maps_url:** non trovato

---

### [22] Na Cosetta — Club/Restaurant
*Via Ettore Giovenale 54*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | — | — |
| TripAdvisor | **3.5** | 532 |

**rating_avg proposto:** 3.5 (1 sorgente)
**rating_sources:** `['tripadvisor']`
**google_maps_url:** non trovato
**Note:** Rating relativamente basso (3.5). Da tenere in mente per l'editoriale.

---

### [23] Il capriccio di Carla — Gelateria
*Piazzale Prenestino 30*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.7** | — |
| TheFork | — | — |
| TripAdvisor | **4.7** | 240 |

**rating_avg proposto:** 4.7 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** `https://www.google.com/maps/search/?api=1&query=Gelateria+Il+Capriccio+di+Carla&query_place_id=ChIJ8T4IVYhhLxMRTphNJ7UgfHo` *(Place ID trovato)*

---

### [24] Fax Factory — Café
*Via Antonio Raimondi 87*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.6** | ~406 (su aggregatore) |
| TheFork | — | — |
| TripAdvisor | — | — |

**rating_avg proposto:** 4.6 (1 sorgente)
**rating_sources:** `['google']`
**google_maps_url:** non trovato

---

### [25] Premiata Panineria Pigneto — Street food
*Via Fanfulla da Lodi 53*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.0** | — |
| TheFork | — | — |
| TripAdvisor | **3.3** | 185 |

**rating_avg proposto:** 3.7 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Su TheFork appare unificato con Spirito come "Spirito Premiata Panineria". TripAdvisor ha due schede distinte.

---

### [26] Spirito — Club
*Via Fanfulla da Lodi 53*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.1** | **960** |
| TheFork | **4.35** | — |
| TripAdvisor | **3.4** | 198 |

**rating_avg proposto:** 3.9 (3 sorgenti)
**rating_sources:** `['google', 'thefork', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Speakeasy accessibile dall'interno della Premiata Panineria. TheFork lista come "Spirito Premiata Panineria" (8.7/10 → 4.35/5).

---

### [27] Lo Yeti — Restaurant
*Via Perugia 4*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.6** | — |
| TheFork | — | — |
| TripAdvisor | **4.2** | 41 |

**rating_avg proposto:** 4.4 (2 sorgenti)
**rating_sources:** `['google', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Libreria-caffè con cucina biologica e vegana.

---

### [28] Approdo 56 — Seafood
*Via Augusto Dulceri 56*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | URL trovato, rating non estratto | — |
| TripAdvisor | **4.7** | 91 |

**rating_avg proposto:** 4.7 (1 sorgente)
**rating_sources:** `['tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Rating TripAdvisor eccellente (4.7, rank #2165 su 11919 Roma). Aperto solo sab e dom (orari limitati). TheFork presente (r743560) ma rating non estratto.

---

### [29] Scomodo Food & Music — Gastropub
*Via Casilina 198*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | **4.25** | **2602** |
| TripAdvisor | **4.4** | 832 |

**rating_avg proposto:** 4.3 (2 sorgenti)
**rating_sources:** `['thefork', 'tripadvisor']`
**google_maps_url:** non trovato (URL diretto)
**Note:** Rank TripAdvisor #194 su 11641 ristoranti Roma — uno dei locali più recensiti del batch. Volume altissimo su TheFork (2602 recensioni).

---

### [30] Corner Pigneto — Café
*Piazza dei Condottieri 46*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | **4.4** | 224 |
| TripAdvisor | presente, rating non estratto | — |

**rating_avg proposto:** 4.4 (1 sorgente)
**rating_sources:** `['thefork']`
**google_maps_url:** non trovato (URL diretto)

---

### [58] Da Adriana — Trattoria ✅ DATI TROVATI
*Piazza dei Condottieri 49*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | — | — |
| TheFork | — | — |
| TripAdvisor | — | — |
| **Gambero Rosso** | ✅ articolo nuova apertura | — |

**rating_avg:** null (troppo recente)
**Campi mancanti trovati:**
- address → **Piazza dei Condottieri 49, 00176 Roma RM** ✅
- phone → **(+39) 06 558 2752** ✅
- hours → **Mar–Dom 19:00–23:30; Sab–Dom anche pranzo 12:00–15:00; Lun chiuso** ✅
- website → **https://www.daadrianatrattoria.it/** ✅
**Note:** Aperta fine febbraio 2026. Chef Michele De Chirico (ex Epiro), gestita da Simone Rosati. Gambero Rosso: articolo "nuova (promettente) trattoria a prezzi onesti".

---

### [59] IMHO Bun & Bites — Street food ⚠️ DATI PARZIALI
*Via Renzo da Ceri 6/6A*

**rating_avg:** null (troppo recente)
**Campi mancanti trovati:**
- address → **Via Renzo da Ceri 6/6A, 00176 Roma RM** ✅
- phone → null (non trovato)
- hours → null (non trovato)
- website → null (non trovato)
**Note:** Aperto marzo 2026. Chef Alessio Congias. Collaborazione con The Smoking/Gruppo Galli (carne) e Triticum/Matteo Valentini (pane). Non ancora su TripAdvisor, TheFork o Google Maps.

---

### [60] Frisson — Gastropub ✅ DATI TROVATI
*Via Alberto da Giussano 37*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.1** | — |
| TheFork | — | — |
| TripAdvisor | **3.0** | 6 *(solo 6 rec — non significativo)* |
| **Gambero Rosso** | ✅ articolo nuova apertura | — |

**rating_avg proposto:** 4.1 (solo Google — TripAdvisor con 6 rec non include nella media)
**rating_sources:** `['google']`
**Campi mancanti trovati:**
- address → **Via Alberto da Giussano 37, 00176 Roma RM** ✅
- phone → **(+39) 366 154 7123** ✅
- hours → **Lun chiuso; Mar 18:00–00:00; Mer–Gio 8:30–15:00 e 18:00–00:00; Ven–Sab 8:30–15:00 e 18:00–01:00; Dom 9:00–16:00** ✅
- website → **https://frissonroma.superbexperience.com/** ✅
**Note:** Trasferito al Pigneto dicembre 2025. Chef Leopoldo Di Martino (ex La Pergola, Mirazur). Gambero Rosso: "listening bar con bakery e cucina d'autore".

---

### [61] Cantina Dulceri — Wine bar ⚠️ INDAGARE
*Via Augusto Dulceri 56*

**rating_avg:** null
**Campi mancanti trovati:**
- address → **Via Augusto Dulceri 56, 00176 Roma RM** ✅ *(ma vedi nota)*
- phone → null
- hours → null
- website → null
**⚠️ ATTENZIONE:** Via Augusto Dulceri 56 è lo stesso indirizzo di **Approdo 56** (id=28, ristorante di pesce). La pagina Facebook di Cantina Dulceri reindirizza all'account di Approdo 56. Instagram: @cantinadulceri esiste. Probabile che Cantina Dulceri sia un format serale/enoteca all'interno dello stesso spazio fisico di Approdo 56, o un'apertura molto recente. Da chiarire se sono lo stesso posto con due identità, o due attività distinte allo stesso indirizzo.

---

## ESSENTIALS

### [31] Conad City — Grocery
*Via Alberto da Giussano 45/49*

**rating_avg:** null (nessun rating trovato)
**google_maps_url:** non trovato
**Campi mancanti trovati:** nessuno
**Note:** Orari verificati: lun-sab 07:15-20:30, dom 08:15-13:30 (coincidono con DB? Verificare).

---

### [32] Il Castoro — Grocery
*Piazza dei Condottieri 9 / Via Erasmo Gattamelata 124*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** nessuno
**Note:** Ingresso/parcheggio da Via Gattamelata 124.

---

### [34] Ma Little Market — Grocery
*Via Pausania 1*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** phone → null, hours → null, website → null
**Note:** Nessun risultato trovato su nessuna sorgente. Potrebbe corrispondere ai supermercati MA (masupermercati.it) — da verificare sul posto.

---

### [35] Da Yasmin — Grocery
*Via Alberto da Giussano 103*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** phone → null, hours → null, website → null
**Note:** Presenza confermata nella zona ma nessun dato di contatto trovato online.

---

### [36] Mercato Rionale del Pigneto — Market
*Via del Pigneto*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** phone → null, website → null
**Note:** Mercato all'aperto senza contatti centralizzati. Email trovata per il Mercato Condottieri (non questo).

---

### [37] Mercato Condottieri Labicano — Market
*Via Alberto da Giussano 58*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** phone → null, website → null
**Note:** Email trovata: mercatolabicanocondottieri@gmail.com (non da salvare nel DB). ~60 operatori, mercato coperto.

---

### [38] Edicola 'n piazza dei Condottieri — Transit/Edicola
*Piazza dei Condottieri*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:**
- phone → **06 2147900** ✅
- hours → non trovati
- website → non trovato

---

### [39] Lavanderia — Laundry
*Via Roberto Malatesta 65*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** phone → null, hours → null, website → null
**Note:** Si chiama "Lavasciuga", è self-service — tipicamente senza numero di telefono.

---

### [40] Ondablu Lavanderie Fast Service — Laundry
*Via Prenestina 168/E*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** phone → null (self-service, numero per sede non pubblicato)
**Note:** Orari confermati 08:00-20:00 tutti i giorni.

---

### [41] Vodafone — Phone & SIM
*Via Alberto da Giussano 62*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:**
- phone → **(+39) 06 8923 7904** ✅ *(verificare che sia ancora attivo)*
- hours → **Lun-Sab 09:00-13:00, 16:00-19:30; Dom chiuso** ✅

---

### [42] New Generation — Phone & SIM
*Via Roberto Malatesta 81*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** website → null (nessun sito proprietario)

---

### [43] Dolce Vespa — Rental
*Via Adriano Balbi 14*

**rating_avg:** null (nessun TripAdvisor trovato)
**google_maps_url:** non trovato

---

### [44] WeArt Hair Design — Other
*Via di Acqua Bullicante 329*

**rating_avg:** null
**google_maps_url:** non trovato
**Note:** 98% raccomandazione su 265 recensioni Fresha. Telefono confermato in DB.

---

### [45] Mr Belly Tattoo Pigneto — Other
*Via Macerata 67*

| Sorgente | Rating | Recensioni |
|----------|--------|------------|
| Google | **4.9** | 48 |

**rating_avg proposto:** 4.9 (1 sorgente)
**rating_sources:** `['google']`
**google_maps_url:** non trovato

---

### [46] Roma Termini — Transit
*Piazza dei Cinquecento 1*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:**
- phone → **892021** (call center Trenitalia, numero nazionale) ✅
- hours → **Aperta 24/7; accesso notturno (22:30-05:00) limitato a varchi specifici** ✅

---

### [47] Pigneto Metro C — Transit
*Via del Pigneto 100*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:** phone → null, website → null
**Note:** Orari linea C: dom-gio 05:30-23:30, ven-sab fino 01:30. ATAC sito generale non conta come website della fermata.

---

### [48] Casilina/Villini RMG — Transit ⚠️ VERIFICARE OPERATIVITÀ
*Via Casilina 315*

**rating_avg:** null
**Campi mancanti trovati:** phone → null
**⚠️ ATTENZIONE:** Fonti 2026 indicano la tratta Centocelle-Laziali potrebbe essere sospesa e sostituita da servizio bus in attesa del metrotram G. Verificare prima di mantenere active=true.

---

### [49] Prenestina/Giussano Tram — Transit
*Via Prenestina 180*

**rating_avg:** null
**Campi mancanti trovati:** phone → null (per definizione: fermate tram non hanno telefono)

---

### [50] Farmacia Dr. Tupputi — Pharmacy
*Via Roberto Malatesta 35*

**rating_avg:** null
**google_maps_url:** non trovato
**Campi mancanti trovati:**
- phone → **(+39) 06 2752786** ✅
- website → **https://www.farmaciatupputi.com** ✅
- hours (info aggiuntiva, non nel DB): lun-sab 08:30-20:00, dom 08:30-13:00 e 16:00-19:30

---

### [51] Farmacia Sanassi — Pharmacy ⚠️ ORARI DA CORREGGERE
*Via Alberto da Giussano 42*

**rating_avg:** null
**Campi mancanti trovati:** website → **https://www.farmaciagiussano.it** ✅
**⚠️ ORARI:** DB ha "24/7" — ricerca trova lun-sab 07:00-22:00, dom 16:00-22:00. Il 24/7 NON è confermato da nessuna fonte. Aggiornare?

---

### [52] Farmacia Saltarelli — Pharmacy
*Via di Acqua Bullicante 202*

**rating_avg:** null
**Campi mancanti trovati:**
- hours → **07:00-00:00 tutti i giorni (365 giorni l'anno)** ✅
- website → **https://www.farmaciasaltarelli.it** ✅
**Note:** Ora gestita da gruppo DrMax.

---

### [53] Poste Italiane — Post & Shipping
*Via Capitan Ottobono 27*

**rating_avg:** null
**Campi mancanti trovati:** nessuno
**Note:** Ufficio Roma 63. Tutti i dati confermati.

---

### [54] Mail Boxes etc — Post & Shipping
*Via Alberto da Giussano 2 / Via Prenestina 178 D/E*

**rating_avg:** null
**Campi mancanti trovati:** nessuno
**Note:** Centro MBE 0520. Indirizzo ha due riferimenti (angolo tra via Prenestina e via Giussano).

---

### [55] Deposito Bagagli Termini — Luggage Storage ⚠️ INDIRIZZO
*Via Giovanni Giolitti 14 (DB) — fonti trovano Via Giolitti 34*

**rating_avg:** null (TripAdvisor presente ma rating non estratto — scheda Kibag/Kipoint)
**Campi mancanti trovati:** nessuno
**⚠️ Verificare indirizzo:** DB ha civico 14, ricerche trovano civico 34.

---

### [56] Garage L'Aurora — Parking
*Via Erasmo Gattamelata 178*

**rating_avg:** null
**google_maps_url:** non trovato *(garageaurora.business.site è il sito, non l'URL Maps)*
**Note:** Orari trovati online sembrano insoliti (da verificare). Tutti i dati principali già in DB.

---

### [57] Autorimessa Malatesta — Parking
*Via Roberto Malatesta 78*

**rating_avg:** null
**Campi mancanti trovati:**
- phone → **(+39) 06 21703361** ✅
- website → non trovato (rimane NULL)
