# Manuale Bilingue delle Euristiche e Domande Trabocchetto — Patente A/B 2026
# Bilingual Heuristics & Trick-Question Playbook — Italian Patente A/B 2026

**IT:** Questo documento analizza in modo statistico tutte le 6.963 domande ufficiali estratte in `questions.json` (3.488 VERE, 3.475 FALSE). Ogni sezione presenta prima il testo in italiano e subito dopo la traduzione in inglese, per aiutarti sia a riconoscere i meccanismi linguistici del Ministero sia ad acquisire sicurezza nella lettura dell'italiano giuridico d'esame.

**EN:** This document statistically analyzes all 6,963 extracted Patente A/B questions in `questions.json` (3,488 VERO / True, 3,475 FALSO / False). Every prose section presents the Italian paragraph first, immediately followed by its English translation, helping you master both Ministry wording patterns and legal Italian reading fluency.

## 1. Panoramica e Limiti Statistici / Overview & Statistical Reality Check

**IT:** Un classificatore lineare basato esclusivamente sul testo (TF-IDF su 1–3 grammi + regressione logistica, valutato senza dispersione di dati tra domande gemelle tramite GroupKFold a 5 blocchi) raggiunge un'accuratezza fuori campione del 61.96% (± 1.54%), rispetto al 61.91% in StratifiedKFold. Ciò dimostra che il solo lessico sposta le probabilità ben oltre il 50:50 su specifici segnali, ma circa il 38% dell'esame dipende dal contenuto dell'immagine (3.827 domande su 6.963 hanno un'immagine) e dalla conoscenza puntuale del Codice della Strada.

**EN:** A text-only linear classifier (1–3-gram TF-IDF + Logistic Regression evaluated with leakage-free 5-fold GroupKFold across sibling question blocks) achieves 61.96% (± 1.54%) out-of-sample accuracy, compared with 61.91% under StratifiedKFold. Wording cues shift odds materially above 50:50 on high-confidence items, yet roughly 38% of the gap reflects image content (3,827 of 6,963 questions include an image) and exact traffic-law facts.

**IT:** Quando il modello testuale supera una confidenza di almeno 65% (copertura sul 34.6% delle domande), l'accuratezza sale al 71.4%. A confidenza >= 75% (copertura 10.0%), l'accuratezza raggiunge il 80.3%. Usa quindi queste euristiche come segnale di allarme e di spareggio quando sei indeciso, non come sostituto dello studio.

**EN:** When the wording-only model reaches >= 65% confidence (covering 34.6% of questions), accuracy rises to 71.4%. At >= 75% confidence (covering 10.0%), accuracy reaches 80.3%. Treat wording cues as tie-breakers and red flags when uncertain, never as a blind replacement for knowing the rules.

| Metrica / Metric | Valore / Value |
| :--- | :--- |
| Totale domande / Total questions | 6963 (3488 VERO / 3475 FALSO, base=50.1%) |
| StratifiedKFold 5-fold accuracy | 61.91% (± 1.61%) |
| GroupKFold (no sibling leakage) 5-fold accuracy | 61.96% (± 1.54%) |
| Soglia confidenza >= 65% / Confidence >= 0.65 | Accuracy **71.4%** su **34.6%** del corpus |
| Soglia confidenza >= 75% / Confidence >= 0.75 | Accuracy **80.3%** su **10.0%** del corpus |
| Distribuzione livelli preliminari / Preliminary tiers | Trap: 495, Moderate: 2852, Straightforward: 3616 |

## 2. Parole e Frasi ad Alta Affidabilità (VERO e FALSO) / High-Reliability Cues

**IT:** Le espressioni assolute o restrittive ('in ogni caso', 'qualunque', 'solo', 'purché', 'soltanto', 'qualsiasi', 'è obbligatorio') tendono sistematicamente al FALSO perché i quiz ministeriali fabbricano divieti o condizioni arbitrarie. Al contrario, le formule di cautela, possibilità o eccezione esplicita ('moderare la velocità', 'consigliabile', 'salvo', 'opportuno', 'di norma', 'si può trovare', 'invita') riflettono il tono prudente e flessibile del Codice della Strada e inclinano verso il VERO.

**EN:** Absolute or restrictive qualifiers ('in ogni caso', 'qualunque', 'solo', 'purché', 'soltanto', 'qualsiasi', 'è obbligatorio') skew sharply FALSO because distractors fabricate rigid bans or fake caveats. Conversely, hedged recommendations, cautious behavior, and statutory exceptions ('moderare la velocità', 'consigliabile', 'salvo', 'opportuno', 'di norma', 'si può trovare', 'invita') match official legal drafting and skew VERO.

### Segnali FALSO più forti / Strongest FALSO Cues (p < 0.01, n >= 15)

| Frase / Phrase | Occorrenze (`n`) | VERO | FALSO | Bias | IC 95% Wilson (VERO) | Fisher `p` | Esempio / Example |
| :--- | ---: | ---: | ---: | :--- | :--- | ---: | :--- |
| `segnale di indicazione` | 16 | 1 | 15 | **FALSO 93.8%** | [0.011, 0.283] | 2.65e-04 | #1173: Il segnale raffigurato è un segnale di indicazione |
| `in ogni caso` | 21 | 2 | 19 | **FALSO 90.5%** | [0.026, 0.289] | 1.16e-04 | #1878: Il segnale raffigurato indica che in ogni caso bisogna tenersi il più possi... |
| `il conducente può` | 19 | 2 | 17 | **FALSO 89.5%** | [0.029, 0.314] | 3.87e-04 | #404: Il conducente può lanciare oggetti dal finestrino sulla banchina |
| `raffigurato indica una strada` | 35 | 4 | 31 | **FALSO 88.6%** | [0.045, 0.260] | 1.77e-06 | #1333: Il segnale raffigurato indica una strada riservata ai carri agricoli |
| `la velocità di` | 17 | 2 | 15 | **FALSO 88.2%** | [0.033, 0.343] | 1.27e-03 | #120: Nelle aree pedonali possono transitare i quadricicli a motore, purché non s... |
| `un senso` | 15 | 2 | 13 | **FALSO 86.7%** | [0.037, 0.379] | 4.08e-03 | #906: Il segnale raffigurato preannuncia un senso unico alternato con l'obbligo d... |
| `riservata ai` | 21 | 3 | 18 | **FALSO 85.7%** | [0.050, 0.346] | 8.25e-04 | #199: La banchina è riservata ai veicoli lenti, nelle strade in salita |
| `rapidamente` | 20 | 3 | 17 | **FALSO 85.0%** | [0.052, 0.360] | 1.44e-03 | #452: Quando le persone anziane attraversano la carreggiata bisogna tenere presen... |
| `corsia riservata` | 19 | 3 | 16 | **FALSO 84.2%** | [0.055, 0.376] | 2.50e-03 | #825: Il segnale raffigurato preannuncia una corsia riservata ai filobus |
| `ma non` | 44 | 7 | 37 | **FALSO 84.1%** | [0.079, 0.294] | 2.81e-06 | #36: L'attraversamento pedonale è una parte della carreggiata in cui è consentit... |
| `divieto di transito` | 17 | 3 | 14 | **FALSO 82.3%** | [0.062, 0.410] | 7.37e-03 | #908: Il segnale raffigurato preannuncia un divieto di transito agli autobus |
| `sosta per` | 17 | 3 | 14 | **FALSO 82.3%** | [0.062, 0.410] | 7.37e-03 | #63: L'isola di traffico è una piazzola di sosta per i veicoli |
| `ma solo` | 17 | 3 | 14 | **FALSO 82.3%** | [0.062, 0.410] | 7.37e-03 | #1204: Il segnale raffigurato non consente l'ingresso, ma solo l'uscita dalla stra... |
| `raffigurato indica una` | 79 | 14 | 65 | **FALSO 82.3%** | [0.109, 0.276] | 2.44e-09 | #589: Il segnale raffigurato indica una banchina cedevole |
| `raffigurato preannuncia la presenza` | 22 | 4 | 18 | **FALSO 81.8%** | [0.073, 0.385] | 2.52e-03 | #927: Il segnale raffigurato preannuncia la presenza di un cordolo alto per separ... |
| `chilometri` | 27 | 5 | 22 | **FALSO 81.5%** | [0.082, 0.367] | 8.75e-04 | #2906: Il segnale raffigurato indica che mancano 180 chilometri per l'area di serv... |
| `segnale raffigurato indica una` | 58 | 11 | 47 | **FALSO 81.0%** | [0.109, 0.308] | 1.08e-06 | #589: Il segnale raffigurato indica una banchina cedevole |
| `di indicazione` | 20 | 4 | 16 | **FALSO 80.0%** | [0.081, 0.416] | 7.02e-03 | #1173: Il segnale raffigurato è un segnale di indicazione |
| `di posizione` | 20 | 4 | 16 | **FALSO 80.0%** | [0.081, 0.416] | 7.02e-03 | #6411: L'illuminazione interna dello specchio retrovisore si accende con l'accensi... |
| `10` | 24 | 5 | 19 | **FALSO 79.2%** | [0.092, 0.405] | 3.95e-03 | #879: Il segnale raffigurato indica che non è consentito superare la velocità di ... |
| `indica una` | 95 | 20 | 75 | **FALSO 79.0%** | [0.141, 0.303] | 5.53e-09 | #589: Il segnale raffigurato indica una banchina cedevole |
| `riservata` | 70 | 15 | 55 | **FALSO 78.6%** | [0.134, 0.324] | 8.87e-07 | #127: La strada è riservata alla circolazione dei soli autoveicoli e motocicli |
| `solo se` | 54 | 12 | 42 | **FALSO 77.8%** | [0.132, 0.349] | 3.00e-05 | #419: Il conducente di un veicolo deve rispettare gli agenti del traffico solo se... |
| `contemporaneamente` | 36 | 8 | 28 | **FALSO 77.8%** | [0.117, 0.381] | 7.15e-04 | #3562: Il segnale raffigurato indica quanti veicoli possono transitare contemporan... |
| `ma` | 106 | 24 | 82 | **FALSO 77.4%** | [0.157, 0.315] | 6.32e-09 | #36: L'attraversamento pedonale è una parte della carreggiata in cui è consentit... |

### Segnali VERO più forti / Strongest VERO Cues (p < 0.01, n >= 15)

| Frase / Phrase | Occorrenze (`n`) | VERO | FALSO | Bias | IC 95% Wilson (VERO) | Fisher `p` | Esempio / Example |
| :--- | ---: | ---: | ---: | :--- | :--- | ---: | :--- |
| `segnale raffigurato si può` | 17 | 17 | 0 | **VERO 100.0%** | [0.816, 1.000] | 1.50e-05 | #712: Dopo il segnale raffigurato si può trovare un dispositivo acustico che avve... |
| `pannello che` | 16 | 16 | 0 | **VERO 100.0%** | [0.806, 1.000] | 3.00e-05 | #1141: Il segnale raffigurato è integrato dal pannello che indica la lunghezza del... |
| `richiede` | 16 | 16 | 0 | **VERO 100.0%** | [0.806, 1.000] | 3.00e-05 | #84: L'intersezione (incrocio) a raso richiede di fare attenzione ai veicoli pro... |
| `moderare la velocità per` | 15 | 15 | 0 | **VERO 100.0%** | [0.796, 1.000] | 6.01e-05 | #553: In presenza del segnale raffigurato è necessario moderare la velocità per e... |
| `moderare la velocità` | 36 | 35 | 1 | **VERO 97.2%** | [0.858, 0.995] | 9.95e-10 | #553: In presenza del segnale raffigurato è necessario moderare la velocità per e... |
| `si può trovare` | 23 | 22 | 1 | **VERO 95.7%** | [0.790, 0.992] | 5.55e-06 | #102: In un passaggio a livello si può trovare la croce di S. Andrea |
| `raffigurato si può` | 22 | 21 | 1 | **VERO 95.5%** | [0.782, 0.992] | 1.07e-05 | #712: Dopo il segnale raffigurato si può trovare un dispositivo acustico che avve... |
| `potrebbero` | 17 | 16 | 1 | **VERO 94.1%** | [0.730, 0.990] | 2.71e-04 | #373: Entrando in un centro abitato, bisogna continuare a mantenere la concentraz... |
| `il segnale raffigurato invita` | 17 | 16 | 1 | **VERO 94.1%** | [0.730, 0.990] | 2.71e-04 | #775: Il segnale raffigurato invita a fare attenzione, prima di attraversare, per... |
| `la visibilità` | 17 | 16 | 1 | **VERO 94.1%** | [0.730, 0.990] | 2.71e-04 | #425: I montanti interni degli autoveicoli condizionano la visibilità |
| `invita` | 32 | 29 | 3 | **VERO 90.6%** | [0.758, 0.968] | 2.44e-06 | #775: Il segnale raffigurato invita a fare attenzione, prima di attraversare, per... |
| `raffigurato invita` | 29 | 26 | 3 | **VERO 89.7%** | [0.736, 0.964] | 1.47e-05 | #775: Il segnale raffigurato invita a fare attenzione, prima di attraversare, per... |
| `la velocità per` | 19 | 17 | 2 | **VERO 89.5%** | [0.686, 0.971] | 7.18e-04 | #553: In presenza del segnale raffigurato è necessario moderare la velocità per e... |
| `attenzione ai` | 19 | 17 | 2 | **VERO 89.5%** | [0.686, 0.971] | 7.18e-04 | #84: L'intersezione (incrocio) a raso richiede di fare attenzione ai veicoli pro... |
| `prestare` | 18 | 16 | 2 | **VERO 88.9%** | [0.672, 0.969] | 1.30e-03 | #805: In presenza del segnale raffigurato, il conducente deve prestare maggiore a... |
| `altri utenti della strada` | 24 | 21 | 3 | **VERO 87.5%** | [0.690, 0.957] | 2.71e-04 | #371: Entrati in un centro abitato, bisogna tenere conto che gli altri utenti del... |
| `orizzontale` | 16 | 14 | 2 | **VERO 87.5%** | [0.640, 0.965] | 4.14e-03 | #764: Il segnale raffigurato può essere posto sia in senso orizzontale che in sen... |
| `valutare` | 16 | 14 | 2 | **VERO 87.5%** | [0.640, 0.965] | 4.14e-03 | #450: Le persone anziane che attraversano la carreggiata sono esposte a maggiori ... |
| `altri utenti` | 30 | 26 | 4 | **VERO 86.7%** | [0.703, 0.947] | 5.75e-05 | #371: Entrati in un centro abitato, bisogna tenere conto che gli altri utenti del... |
| `raffigurato può essere posto` | 15 | 13 | 2 | **VERO 86.7%** | [0.621, 0.963] | 7.33e-03 | #764: Il segnale raffigurato può essere posto sia in senso orizzontale che in sen... |
| `particolare` | 35 | 30 | 5 | **VERO 85.7%** | [0.706, 0.937] | 2.14e-05 | #677: Su strada a due corsie e a doppio senso di circolazione, in presenza del se... |
| `abbinato` | 21 | 18 | 3 | **VERO 85.7%** | [0.654, 0.950] | 1.47e-03 | #778: Il segnale (A) può essere abbinato al segnale (B) (908) |
| `utenti` | 34 | 29 | 5 | **VERO 85.3%** | [0.699, 0.935] | 3.71e-05 | #371: Entrati in un centro abitato, bisogna tenere conto che gli altri utenti del... |
| `particolarmente` | 27 | 23 | 4 | **VERO 85.2%** | [0.675, 0.941] | 3.03e-04 | #496: Alla guida di un veicolo, in vicinanza di una piazzola di fermata di autobu... |
| `può essere integrato` | 19 | 16 | 3 | **VERO 84.2%** | [0.624, 0.945] | 4.38e-03 | #607: Il segnale raffigurato può essere integrato con pannello con la scritta TOR... |

## 3. Falsi Miti da Evitare / Folklore Myths Near 50:50

**IT:** Molti consigli informali suggeriscono di diffidare automaticamente della parola 'non', di 'è vietato', di 'è consentito' o della congiunzione 'se'. I dati su 6.963 domande smentiscono queste regole popolari: tutte queste forme cadono praticamente al 50% (lancio di moneta) e non devono mai influenzare la risposta da sole.

**EN:** Popular study folklore warns students to guess FALSO whenever they see 'non', 'è vietato', or 'se', or to trust 'è consentito'. Across all 6,963 items, these myths perform identically to a 50:50 coin flip and offer zero standalone predictive edge.

| Espressione / Phrase | `n` | VERO | FALSO | `P(VERO)` | Fisher `p` |
| :--- | ---: | ---: | ---: | ---: | ---: |
| `non` | 827 | 399 | 428 | 0.482 | 0.267 |
| `se` | 703 | 362 | 341 | 0.515 | 0.450 |
| `anche` | 236 | 132 | 104 | 0.559 | 0.074 |
| `consente` | 235 | 123 | 112 | 0.523 | 0.507 |
| `possono` | 204 | 97 | 107 | 0.475 | 0.478 |
| `è consentito` | 200 | 101 | 99 | 0.505 | 0.943 |
| `vieta` | 190 | 82 | 108 | 0.432 | 0.056 |
| `preavvisa` | 79 | 36 | 43 | 0.456 | 0.431 |
| `è vietato` | 72 | 37 | 35 | 0.514 | 0.906 |
| `in prossimità` | 62 | 35 | 27 | 0.565 | 0.372 |
| `qualora` | 31 | 16 | 15 | 0.516 | 1.000 |
| `tutte` | 28 | 11 | 17 | 0.393 | 0.263 |
| `sufficiente` | 21 | 11 | 10 | 0.524 | 1.000 |
| `prescrive` | 21 | 11 | 10 | 0.524 | 1.000 |

## 4. Struttura e Presentazione della Domanda / Sentence Structure & Presentation Patterns

**IT:** Anche la forma della frase trasmette informazione: le frasi brevi (< 70 caratteri) risultano più spesso FALSE, spesso perché enunciano una definizione tagliata o una falsa attribuzione secca di un segnale. Le frasi lunghe (>= 130 caratteri) sono più spesso VERE perché includono le precisazioni legali richieste per rendere corretta la norma.

**EN:** Sentence shape also carries signal: short items (< 70 chars) lean FALSO because truncated definitions and blunt mislabeled signs need fewer words, whereas long items (>= 130 chars) lean VERO because statutory accuracy requires extra qualifying clauses and exceptions.

| Caratteristica / Feature | Categoria / Bucket | `n` | `P(VERO)` | IC 95% Wilson |
| :--- | :--- | ---: | ---: | :--- |
| `sentence_length` | `70-129 chars` | 4187 | 0.505 | [0.490, 0.520] |
| `negation_count` | `0 negations` | 5805 | 0.502 | [0.489, 0.515] |
| `double_negation` | `absent` | 6949 | 0.502 | [0.490, 0.514] |
| `numeric_or_unit` | `absent` | 5991 | 0.508 | [0.495, 0.521] |
| `parenthetical` | `absent` | 6454 | 0.499 | [0.487, 0.511] |
| `conditional_or_exception` | `absent` | 6132 | 0.500 | [0.488, 0.513] |
| `image_presence` | `with_image` | 3827 | 0.485 | [0.469, 0.501] |
| `negation_count` | `1 negation` | 1048 | 0.493 | [0.463, 0.524] |
| `sentence_length` | `>=130 chars` | 1440 | 0.572 | [0.546, 0.598] |
| `conditional_or_exception` | `present` | 831 | 0.504 | [0.470, 0.538] |
| `sentence_length` | `<70 chars` | 1336 | 0.412 | [0.386, 0.438] |
| `image_presence` | `text_only` | 3136 | 0.520 | [0.503, 0.538] |
| `parenthetical` | `present` | 509 | 0.528 | [0.485, 0.572] |
| `numeric_or_unit` | `present` | 972 | 0.457 | [0.426, 0.488] |
| `negation_count` | `>=2 negations` | 110 | 0.518 | [0.426, 0.609] |
| `double_negation` | `present` | 14 | 0.071 | [0.013, 0.315] |

## 5. Zona Pericolo: Le Eccezioni Anti-Euristica / Danger Zone: Anti-Heuristic Exceptions

**IT:** Questa è la sezione più preziosa per evitare autogol: raccoglie le 265 occorrenze in cui una domanda contiene un segnale forte (come 'in ogni caso', 'solo', 'purché', 'sempre', 'qualunque', 'consigliabile', 'salvo') ma la risposta ufficiale è l'OPPOSTO della regola euristica. Studiare queste eccezioni neutralizza la principale causa d'errore di chi applica scorciatoie.

**EN:** This is the highest-leverage protection against heuristic traps: it catalogs the 265 instances where a question contains a strong cue (e.g. 'in ogni caso', 'solo', 'purché', 'sempre', 'qualunque', 'consigliabile', 'salvo') yet the official answer is the OPPOSITE of the statistical majority. Memorizing these exceptions stops shortcuts from backfiring.

### Eccezioni `in ogni caso` → **VERO** (solitamente FALSO 90.5% | 2 eccezioni)

- **#5293** (Ch 16, img 0, **VERO**): La sosta e la fermata sono vietate in ogni caso sulle piste ciclabili e agli sbocchi di esse
- **#5538** (Ch 17, img 302, **VERO**): Il pannello in figura deve essere applicato in ogni caso in cui il carico sporge posteriormente, anche se di poco (302)

### Eccezioni `qualunque` → **VERO** (solitamente FALSO 77.8% | 4 eccezioni)

- **#710** (Ch 2, img 8, **VERO**): Il segnale raffigurato preannuncia un attraversamento ferroviario protetto da barriere o semibarriere, qualunque sia il numero dei binari
- **#4161** (Ch 11, img 0, **VERO**): Nel caso in cui, a un passaggio a livello, ci si trova ancora sui binari col proprio veicolo quando le barriere cominciano a chiudersi, occorre mantenere la calma e sgomberare in qualunque modo la sede ferroviaria
- **#4162** (Ch 11, img 0, **VERO**): Nel caso in cui, a un passaggio a livello, ci si trova ancora sui binari col proprio veicolo quando le barriere cominciano a chiudersi, occorre sgomberare in qualunque modo la sede ferroviaria, se necessario anche sfondando le barriere
- **#6672** (Ch 19, img 0, **VERO**): La visiera del casco deve garantire la perfetta visione con qualunque condizione di luce o illuminazione

### Eccezioni `solo` → **VERO** (solitamente FALSO 75.6% | 58 eccezioni)

- **#41** (Ch 1, img 0, **VERO**): Nelle strade extraurbane principali possono circolare solo alcune categorie di veicoli a motore
- **#89** (Ch 1, img 0, **VERO**): Una zona a traffico limitato è un'area in cui può essere limitata la circolazione dei veicoli solo in alcune ore
- **#90** (Ch 1, img 0, **VERO**): Una zona a traffico limitato è un'area nella quale può essere limitata la circolazione solo di particolari categorie di veicoli
- **#91** (Ch 1, img 0, **VERO**): In una zona a traffico limitato possono circolare solo i veicoli autorizzati
- **#205** (Ch 1, img 0, **VERO**): Il marciapiede consente la sosta dei veicoli solo in presenza di apposite strisce di parcheggio
- **#759** (Ch 2, img 10, **VERO**): Il segnale raffigurato indica che la sede ferroviaria ha un solo binario
- **#814** (Ch 2, img 14, **VERO**): In presenza del segnale raffigurato si può sorpassare a destra il tram fermo al centro della strada per la salita e discesa dei passeggeri, solo se esiste l'apposito salvagente
- **#1299** (Ch 3, img 59, **VERO**): In presenza del segnale raffigurato è consentito l'uso del clacson solo in caso di pericolo immediato
- **#1597** (Ch 3, img 947, **VERO**): Il segnale (A) con il pannello (B) vieta la sosta solo nei giorni lavorativi (947)
- **#1859** (Ch 4, img 99, **VERO**): Il segnale raffigurato consente solo di proseguire diritto o svoltare a destra
- **#1880** (Ch 4, img 100, **VERO**): Il segnale raffigurato consente solo di proseguire diritto o svoltare a sinistra
- **#2007** (Ch 4, img 107, **VERO**): Il segnale raffigurato indica che la circolazione è consentita solo con catene o pneumatici invernali
- **#2008** (Ch 4, img 107, **VERO**): Il segnale raffigurato consente il transito solo ai veicoli muniti di catene o pneumatici invernali
- **#2036** (Ch 4, img 110, **VERO**): Il segnale raffigurato è posto in corrispondenza di un itinerario che si può percorrere solo con le biciclette
- **#2044** (Ch 4, img 111, **VERO**): Il segnale raffigurato è posto in corrispondenza della fine di un itinerario percorribile solo con biciclette
- *(+ altre 43 eccezioni presenti in `question_analytics.json`)*

### Eccezioni `purché` → **VERO** (solitamente FALSO 75.0% | 15 eccezioni)

- **#1663** (Ch 3, img 90, **VERO**): Il segnale raffigurato consente la fermata, purché il veicolo non sia di intralcio
- **#2398** (Ch 6, img 501, **VERO**): La striscia di mezzo in figura consente il sorpasso senza superarla, purché non vi siano motivi che lo vietino (501)
- **#2676** (Ch 7, img 154, **VERO**): La luce gialla fissa obbliga a fermarsi prima del punto di arresto, purché lo si possa fare senza creare pericolo
- **#4385** (Ch 13, img 0, **VERO**): È opportuno che il conducente di un veicolo, quando in un centro abitato si imbatte in un corteo, imbocchi, se possibile, una strada laterale, purché la manovra possa essere fatta in maniera corretta
- **#5111** (Ch 15, img 0, **VERO**): E' consentito il sorpasso nelle intersezioni se la strada è a precedenza purché a due carreggiate separate e le corsie siano delimitate dall'apposita segnaletica orizzontale
- **#5314** (Ch 16, img 0, **VERO**): Salvo diversa segnalazione il conducente, in caso di sosta nei centri abitati, deve collocare il veicolo il più vicino possibile al margine destro della carreggiata, parallelamente ad esso e secondo il senso di marcia, purché esista il marciapiede rialzato
- **#5323** (Ch 16, img 0, **VERO**): Nelle strade urbane a senso unico di marcia, la sosta è consentita anche lungo il margine sinistro della carreggiata, purché rimanga uno spazio sufficiente al transito almeno di una fila di veicoli
- **#5324** (Ch 16, img 0, **VERO**): Nelle strade urbane a senso unico di marcia, la sosta è consentita anche lungo il margine sinistro della carreggiata, purché rimanga uno spazio non inferiore a tre metri di larghezza per il transito dei veicoli
- **#5511** (Ch 17, img 0, **VERO**): Sui veicoli è consentito il trasporto di animali domestici anche in numero superiore ad uno, purché custoditi in gabbia o nel vano posteriore, appositamente diviso da rete
- **#5552** (Ch 17, img 0, **VERO**): Il traino per situazione di emergenza di un veicolo da parte di un altro deve avvenire attraverso un solido collegamento, come fune, catena, cavo, barra rigida, purché idoneamente segnalati
- **#5553** (Ch 17, img 0, **VERO**): Il traino per incombente situazione di emergenza di un veicolo in avaria deve avvenire attraverso un solido collegamento, purché idoneamente segnalato per rendere i veicoli chiaramente avvistabili dagli altri utenti della strada
- **#6743** (Ch 20, img 0, **VERO**): Con la patente di categoria A2 si possono condurre i motocicli (con o senza carrozzetta) di potenza fino a 35 kW, rapporto potenza/peso non superiore a 0,2 kW/kg purché non siano derivati da una versione dello stesso modello che sviluppi oltre il doppio d
- **#6782** (Ch 20, img 0, **VERO**): La patente di categoria B abilita a condurre le autovetture trainanti un rimorchio non leggero (massa oltre 750 chilogrammi) purché la massa massima autorizzata del complesso non superi 3,5 tonnellate
- **#6798** (Ch 20, img 0, **VERO**): La patente di categoria B con codice armonizzato 96, consente di guidare le autovetture trainanti un rimorchio non leggero (oltre 750 chilogrammi), purché la massa massima autorizzata del complesso non sia superiore a 4.250 chilogrammi
- **#6801** (Ch 20, img 0, **VERO**): Il codice armonizzato 96, apposto sulla patente di categoria B, abilita alla guida di autoveicoli trainanti un rimorchio non leggero (oltre 750 chilogrammi), purché la massa massima autorizzata del complesso non sia superiore a 4.250 chilogrammi

### Eccezioni `soltanto` → **VERO** (solitamente FALSO 71.0% | 9 eccezioni)

- **#1610** (Ch 3, img 946, **VERO**): Il segnale (A), integrato con il pannello (B), vieta la sosta soltanto nei giorni festivi (946)
- **#1760** (Ch 4, img 94, **VERO**): Il segnale raffigurato indica che si può svoltare soltanto a sinistra
- **#1784** (Ch 4, img 95, **VERO**): Il segnale raffigurato indica che si può svoltare soltanto a destra
- **#2658** (Ch 7, img 154, **VERO**): Quando è accesa la luce verde del semaforo in figura si può impegnare l'incrocio, soltanto avendo la certezza di poterlo sgomberare prima dell'accensione della luce rossa
- **#2795** (Ch 7, img 158, **VERO**): Il semaforo in figura, con luce verde accesa, consente soltanto ai conducenti di biciclette di attraversare l'incrocio
- **#2814** (Ch 7, img 161, **VERO**): Delle tre luci del semaforo in figura se ne accende soltanto una, mentre le altre sono spente
- **#5220** (Ch 16, img 0, **VERO**): In una zona in cui la sosta è regolamentata con parchimetro, non occorre utilizzarlo se ci si ferma soltanto per far salire o scendere un passeggero
- **#6197** (Ch 24, img 0, **VERO**): Per risparmiare carburante e salvaguardare l'ambiente dall'inquinamento atmosferico, è consigliabile azionare il climatizzatore il meno possibile e soltanto quando serve effettivamente
- **#6986** (Ch 25, img 0, **VERO**): Con freni squilibrati può avvenire che, in frenata, si blocchino soltanto le ruote di un lato

### Eccezioni `qualsiasi` → **VERO** (solitamente FALSO 70.4% | 8 eccezioni)

- **#786** (Ch 2, img 13, **VERO**): I pannelli raffigurati sono posti prima di qualsiasi tipo di passaggio a livello
- **#1363** (Ch 3, img 64, **VERO**): Il segnale raffigurato vieta il transito ai motocicli di qualsiasi cilindrata
- **#1627** (Ch 3, img 85, **VERO**): Il segnale raffigurato vieta qualsiasi volontaria fermata del veicolo
- **#2484** (Ch 6, img 596, **VERO**): In presenza delle strisce di guida in figura il veicolo A può andare in qualsiasi direzione
- **#5416** (Ch 17, img 0, **VERO**): In caso di ingombro della carreggiata per caduta del carico o per qualsiasi altra causa, il conducente deve rimuovere l'ingombro, per quanto possibile
- **#6459** (Ch 17, img 0, **VERO**): Il massimo rapporto di traino per un rimorchio sprovvisto di qualsiasi dispositivo di frenatura è di 0,5
- **#6485** (Ch 17, img 0, **VERO**): Prima di effettuare qualsiasi manovra con il rimorchio agganciato è bene accertarsi che non vi siano cose e/o persone nel raggio di manovra del complesso
- **#6616** (Ch 19, img 0, **VERO**): Le cinture di sicurezza devono essere utilizzate in qualsiasi situazione di marcia

### Eccezioni `è obbligatorio` → **VERO** (solitamente FALSO 70.5% | 23 eccezioni)

- **#1093** (Ch 2, img 34, **VERO**): Il segnale raffigurato è obbligatorio sulle strade extraurbane
- **#1260** (Ch 3, img 57, **VERO**): In presenza del segnale raffigurato è obbligatorio mantenere una distanza di almeno 70 metri dal veicolo che precede
- **#1824** (Ch 4, img 97, **VERO**): Il segnale raffigurato precede un incrocio ove è obbligatorio svoltare a sinistra
- **#2106** (Ch 4, img 118, **VERO**): Il segnale raffigurato segnala un varco doganale al quale è obbligatorio fermarsi
- **#2114** (Ch 4, img 119, **VERO**): Il segnale raffigurato segnala posto di blocco stradale istituito da organi di polizia al quale è obbligatorio fermarsi
- **#2123** (Ch 4, img 120, **VERO**): Il segnale raffigurato segnala una stazione autostradale alla quale è obbligatorio fermarsi
- **#2125** (Ch 4, img 120, **VERO**): Il segnale raffigurato è posto in corrispondenza degli accessi autostradali controllati dove è obbligatorio fermarsi
- **#4526** (Ch 13, img 0, **VERO**): Agli incroci è obbligatorio dare la precedenza ai veicoli circolanti su rotaie (tram e treni), salvo diversa segnalazione
- **#5427** (Ch 17, img 0, **VERO**): Fuori dei centri abitati, di notte, quando mancano o sono insufficienti le luci posteriori di posizione o di emergenza, è obbligatorio presegnalare il veicolo, fermo sulla carreggiata, con il segnale triangolare mobile di pericolo
- **#5428** (Ch 17, img 0, **VERO**): Fuori dei centri abitati, di notte, è obbligatorio presegnalare con il segnale triangolare mobile di pericolo ogni carico caduto accidentalmente dal veicolo sulla carreggiata
- **#5429** (Ch 17, img 0, **VERO**): Fuori dei centri abitati, è obbligatorio anche di giorno presegnalare un veicolo fermo sulla carreggiata mediante il segnale triangolare di pericolo quando non può essere visto nettamente a 100 metri di distanza
- **#5430** (Ch 17, img 0, **VERO**): Fuori dei centri abitati è obbligatorio, anche di giorno, presegnalare un carico accidentalmente caduto sulla carreggiata mediante il segnale triangolare mobile di pericolo, quando l'ingombro non può essere visto nettamente a 100 metri di distanza
- **#5479** (Ch 17, img 0, **VERO**): Durante la marcia sulle autostrade e strade extraurbane principali è obbligatorio l'uso dei proiettori anabbaglianti anche di giorno
- **#5671** (Ch 18, img 0, **VERO**): Nelle autostrade e strade extraurbane, è obbligatorio accendere i fari anabbaglianti anche di giorno o, in alternativa, le luci di marcia diurna
- **#5675** (Ch 18, img 0, **VERO**): Durante la marcia nei centri abitati, è obbligatorio tenere accese le luci anabbaglianti da mezz'ora dopo il tramonto del sole a mezz'ora prima del suo sorgere
- *(+ altre 8 eccezioni presenti in `question_analytics.json`)*

### Eccezioni `tutti` → **VERO** (solitamente FALSO 65.0% | 36 eccezioni)

- **#136** (Ch 1, img 0, **VERO**): Non tutti i tipi di veicoli possono circolare in autostrada
- **#1383** (Ch 3, img 66, **VERO**): Il segnale raffigurato vieta il transito a tutti gli autoveicoli
- **#1479** (Ch 3, img 75, **VERO**): Il segnale raffigurato si riferisce a tutti i veicoli di larghezza superiore a 2,30 metri
- **#1497** (Ch 3, img 77, **VERO**): Il segnale raffigurato vieta il transito a tutti i veicoli di lunghezza complessiva superiore a 10 metri
- **#1618** (Ch 3, img 85, **VERO**): Il segnale raffigurato vieta la fermata volontaria di tutti i veicoli
- **#1625** (Ch 3, img 85, **VERO**): Il segnale raffigurato vieta la fermata a tutti i veicoli
- **#1704** (Ch 3, img 151, **VERO**): Il segnale raffigurato indica che possono transitare tutti i veicoli esclusi quelli delle categorie rappresentate in figura
- **#2869** (Ch 7, img 0, **VERO**): Il suono prolungato del fischietto da parte dell'agente preposto al traffico significa che tutti i veicoli si devono arrestare, in condizioni di sicurezza
- **#3459** (Ch 8, img 273, **VERO**): Il segnale raffigurato interessa tutti i veicoli che hanno degli impianti igienico-sanitari
- **#3702** (Ch 10, img 123, **VERO**): Il pannello integrativo rappresentato in figura B indica le ore di tutti i giorni nelle quali vale il segnale (123)
- **#3932** (Ch 10, img 962, **VERO**): Il segnale in figura indica che possono parcheggiare tutti i veicoli tranne gli autobus (962)
- **#4142** (Ch 11, img 0, **VERO**): I limiti massimi di velocità vigenti sulle autostrade e sulle strade extraurbane non sono identici in tutti gli stati d'Europa
- **#4313** (Ch 13, img 676, **VERO**): Il veicolo S, muovendosi in retromarcia per immettersi nella circolazione, deve dare la precedenza a tutti i veicoli in transito
- **#4329** (Ch 13, img 0, **VERO**): Chi guida un veicolo, anche se ad elevate prestazioni, deve dare, di norma, la precedenza nei crocevia a tutti i veicoli, che provengono da destra
- **#4528** (Ch 13, img 0, **VERO**): E' obbligatorio dare la precedenza a tutti i veicoli circolanti sulle strade quando si effettua l'inversione del senso di marcia
- *(+ altre 21 eccezioni presenti in `question_analytics.json`)*

### Eccezioni `sempre` → **VERO** (solitamente FALSO 64.6% | 28 eccezioni)

- **#251** (Ch 1, img 0, **VERO**): La potenza dei quadricicli non leggeri è sempre inferiore o uguale a 15 kW
- **#413** (Ch 1, img 0, **VERO**): Il conducente di un veicolo non deve fare sempre affidamento sul comportamento degli altri, che può non essere corretto
- **#1094** (Ch 2, img 34, **VERO**): Sulle strade extraurbane il segnale è sempre obbligatorio
- **#1628** (Ch 3, img 85, **VERO**): In presenza del segnale raffigurato è sempre disposta la rimozione forzata del veicolo
- **#2639** (Ch 6, img 568, **VERO**): La striscia trasversale continua in figura indica il punto in cui dobbiamo sempre arrestarci ad un incrocio, se il vigile lo impone (568)
- **#3955** (Ch 11, img 0, **VERO**): Il conducente deve sempre mantenere il controllo del veicolo
- **#3956** (Ch 11, img 0, **VERO**): Il conducente deve sempre essere in grado di arrestare il veicolo in condizioni di sicurezza
- **#4155** (Ch 11, img 0, **VERO**): Nei veicoli dotati di servofreno, se si percorre una lunga discesa con il cambio in folle e a motore spento, diventa sempre più difficoltoso arrestare il veicolo
- **#4300** (Ch 12, img 0, **VERO**): La distanza di sicurezza va sempre mantenuta, anche prima di iniziare un sorpasso
- **#4422** (Ch 13, img 0, **VERO**): In caso di traffico intenso il conducente deve mantenere sempre la distanza di sicurezza dal veicolo che lo precede
- **#5257** (Ch 16, img 0, **VERO**): Durante la fermata il conducente deve essere sempre presente e pronto a riprendere la marcia
- **#5258** (Ch 16, img 0, **VERO**): Durante la fermata il conducente deve sempre adottare le opportune cautele atte ad evitare incidenti
- **#5292** (Ch 16, img 0, **VERO**): La sosta e la fermata sono sempre vietate sugli attraversamenti pedonali
- **#5326** (Ch 16, img 0, **VERO**): Nelle zone nelle quali gli spazi di sosta sono delimitati da segnaletica orizzontale, il conducente deve sempre sistemare il proprio veicolo entro uno degli appositi spazi(stalli), senza invadere quelli contigui
- **#5662** (Ch 17, img 302, **VERO**): Il pannello raffigurato deve essere sistemato all'estremità del carico sporgente dal veicolo, in modo che sia sempre ben visibile
- *(+ altre 13 eccezioni presenti in `question_analytics.json`)*

### Eccezioni `consigliabile` → **FALSO** (solitamente VERO 77.8% | 4 eccezioni)

- **#5435** (Ch 17, img 0, **FALSO**): Fuori dei centri abitati, di notte, quando mancano o sono insufficienti le luci posteriori di posizione o di emergenza, è consigliabile presegnalare il veicolo fermo sulla carreggiata, con il segnale triangolare mobile di pericolo
- **#5460** (Ch 17, img 0, **FALSO**): Sulle autostrade e strade extraurbane principali è consigliabile evitare la circolazione di veicoli a tenuta non stagna e con carico scoperto, se trasportano materiali che possono disperdersi
- **#5638** (Ch 17, img 0, **FALSO**): Per garantire una maggiore sicurezza durante la guida di un veicolo con rimorchio, è consigliabile concentrare il carico massimo in corrispondenza del gancio di traino
- **#6502** (Ch 17, img 0, **FALSO**): Per garantire una maggiore sicurezza durante la guida di un veicolo con rimorchio, è consigliabile concentrare il carico massimo in corrispondenza del gancio di traino

### Eccezioni `salvo` → **FALSO** (solitamente VERO 72.0% | 14 eccezioni)

- **#1603** (Ch 3, img 84, **FALSO**): Il segnale raffigurato, nei centri urbani, prescrive il divieto di sosta dalle ore 20.00 alle ore 8.00, salvo diversa indicazione
- **#1635** (Ch 3, img 85, **FALSO**): Il segnale raffigurato vale solo nei giorni feriali, salvo diversa indicazione
- **#4074** (Ch 11, img 0, **FALSO**): Salvo diversa segnalazione, il limite massimo di velocità consentito sulle strade urbane è di 80 km/h
- **#4075** (Ch 11, img 0, **FALSO**): Salvo diversa segnalazione, il limite massimo di velocità consentito per i quadricicli non leggeri è di 70 km/h.
- **#4123** (Ch 11, img 0, **FALSO**): Salvo diversa segnalazione, il limite massimo di velocità sulle strade extraurbane principali è di 100 km/h
- **#4124** (Ch 11, img 0, **FALSO**): Salvo diversa segnalazione, il limite massimo di velocità nei centri abitati è di 60 km/h, valido fino ad un chilometro dopo l'uscita del paese
- **#4458** (Ch 13, img 0, **FALSO**): In una carreggiata a doppio senso di circolazione per svoltare a sinistra bisogna dare la precedenza ai veicoli che arrivano da sinistra, salvo diversa segnalazione
- **#6375** (Ch 11, img 0, **FALSO**): Nel caso in cui, a un passaggio a livello, ci si trova ancora sui binari col proprio veicolo quando le barriere cominciano a chiudersi, occorre scendere e abbandonare rapidamente il veicolo per mettersi in salvo
- **#6892** (Ch 20, img 0, **FALSO**): Se si commettono contemporaneamente più violazioni che comportano perdita di punti sulla patente, possono essere decurtati al massimo 10 punti, salvo che si tratti di infrazioni che comportano la revoca della patente
- **#6931** (Ch 20, img 0, **FALSO**): La patente di guida di categoria B, salvo diversa limitazione riportata sul documento stesso o salvo allineamento alla data del compleanno del titolare, vale otto anni se rilasciata o confermata a chi ha una età compresa fra i 50 e i 70 anni
- **#6932** (Ch 20, img 0, **FALSO**): La patente di guida di categoria BE, salvo diversa limitazione riportata sul documento stesso o salvo allineamento alla data del compleanno del titolare, vale cinque anni se rilasciata o confermata a chi non ha superato i 50 anni di età
- **#6934** (Ch 20, img 0, **FALSO**): La patente di guida di categoria B, salvo diversa limitazione riportata sul documento stesso o salvo allineamento alla data del compleanno del titolare, vale cinque anni se rilasciata o confermata a chi non ha superato i 50 anni di età
- **#6935** (Ch 20, img 0, **FALSO**): La patente di guida di categoria B, salvo diversa limitazione riportata sul documento stesso o salvo allineamento alla data del compleanno del titolare, vale dieci anni in ogni caso di rilascio o di conferma
- **#6936** (Ch 20, img 0, **FALSO**): La patente di guida di categoria B, salvo diversa limitazione riportata sul documento stesso, non ha scadenza di validità fino al compimento dei 50 anni di età

### Eccezioni `opportuno` → **FALSO** (solitamente VERO 67.1% | 28 eccezioni)

- **#364** (Ch 1, img 0, **FALSO**): Per una maggiore sicurezza, quando nei centri urbani si viaggia in fila con altri veicoli, è opportuno tenere sempre accese le luci di emergenza
- **#366** (Ch 1, img 0, **FALSO**): Quando si viaggia dietro in fila con altri veicoli, è opportuno spostarsi il più possibile a sinistra, per creare una corsia libera a destra
- **#367** (Ch 1, img 0, **FALSO**): Quando si viaggia in fila con altri veicoli, è opportuno spostarsi al centro della carreggiata, per controllare la situazione del traffico
- **#4380** (Ch 13, img 0, **FALSO**): In un centro abitato, quando un pedone, fuori delle strisce di attraversamento, non accenni a darci la precedenza, è opportuno nelle ore notturne, procedere con gli abbaglianti accesi così che possa accorgersi di noi
- **#4381** (Ch 13, img 0, **FALSO**): In un centro abitato, quando un pedone, fuori delle strisce di attraversamento, non accenni a darci la precedenza, è opportuno cercare di richiamare la sua attenzione con qualsiasi mezzo, perché ci dia la precedenza
- **#4391** (Ch 13, img 0, **FALSO**): È opportuno che il conducente di un veicolo, quando in un centro abitato si imbatte in un corteo, accenda le luci di profondità per vedere meglio ed evitare incidenti
- **#4392** (Ch 13, img 0, **FALSO**): È opportuno che il conducente di un veicolo, quando in un centro abitato si imbatte in un corteo, se proprio ha molta fretta, passi rapidamente usando il clacson in maniera continua
- **#4400** (Ch 13, img 0, **FALSO**): Quando ad un incrocio urbano, al segnale di via libera, il veicolo che precede tarda a riprendere la marcia, è opportuno suonare insistentemente per sollecitare il conducente a rimettersi in moto
- **#4401** (Ch 13, img 0, **FALSO**): Quando ad un incrocio urbano, al segnale di via libera, il veicolo che precede tarda a riprendere la marcia, è opportuno richiamare con il clacson l'attenzione degli automobilisti che seguono
- **#4402** (Ch 13, img 0, **FALSO**): Quando ad un incrocio urbano, al segnale di via libera, il veicolo che precede tarda a riprendere la marcia, è opportuno tirare il freno a mano e scendere per cercare un agente del traffico che prenda i dovuti provvedimenti
- **#4403** (Ch 13, img 0, **FALSO**): Quando ad un incrocio urbano, al segnale di via libera, il veicolo che precede tarda a riprendere la marcia, è opportuno cercare di sgombrare al più presto la carreggiata, anche invertendo il senso di marcia
- **#5835** (Ch 21, img 0, **FALSO**): In presenza di tratti di strada ghiacciati è opportuno marciare molto vicino alla barriera laterale
- **#5836** (Ch 21, img 0, **FALSO**): In presenza di tratti di strada ghiacciati è opportuno non usare le catene, ma gomme chiodate sulle ruote anteriori
- **#5837** (Ch 21, img 0, **FALSO**): In presenza di tratti di strada ghiacciati è opportuno frenare energicamente ogni volta che si incrocia un altro veicolo
- **#5838** (Ch 21, img 0, **FALSO**): In presenza di tratti di strada ghiacciati è opportuno procedere con il cambio in folle
- *(+ altre 13 eccezioni presenti in `question_analytics.json`)*

### Eccezioni `di norma` → **FALSO** (solitamente VERO 65.0% | 21 eccezioni)

- **#12** (Ch 1, img 552, **FALSO**): Nella strada rappresentata, per ogni senso di marcia, la corsia di centro è dedicata, di norma, alla marcia ordinaria
- **#13** (Ch 1, img 552, **FALSO**): Nella strada rappresentata, per ogni senso di marcia, la corsia di destra è dedicata, di norma, al sorpasso
- **#15** (Ch 1, img 552, **FALSO**): Nella strada rappresentata, per ogni senso di marcia, la corsia di sinistra è dedicata, di norma, alla marcia ordinaria
- **#23** (Ch 1, img 562, **FALSO**): La strada rappresentata, di norma, ha due carreggiate a doppio senso di circolazione
- **#26** (Ch 1, img 562, **FALSO**): Nelle carreggiate laterali della strada rappresentata è consentita, di norma, l'inversione di marcia
- **#80** (Ch 1, img 0, **FALSO**): L'intersezione (incrocio) a livelli sfalsati è, di norma, regolata da semafori
- **#210** (Ch 1, img 0, **FALSO**): Il marciapiede è una parte della strada dove, di norma, è consentita la sosta dei ciclomotori
- **#416** (Ch 1, img 0, **FALSO**): Il conducente di un veicolo di grandi dimensioni ha, di norma, la precedenza sul conducente di un veicolo più piccolo
- **#618** (Ch 2, img 4, **FALSO**): Il segnale raffigurato è posto, di norma, a 5 metri dall'inizio della curva
- **#771** (Ch 2, img 10, **FALSO**): Il segnale raffigurato si trova, di norma, a 150 metri dai binari
- **#1203** (Ch 3, img 54, **FALSO**): Il segnale raffigurato consente, di norma, di entrare nella strada per effettuare la sosta e le operazioni di carico e scarico
- **#1948** (Ch 4, img 103, **FALSO**): Il segnale raffigurato è, di norma, preceduto dal segnale ROTATORIA
- **#2153** (Ch 5, img 40, **FALSO**): Il segnale raffigurato è posto, di norma, 150 metri prima dell'incrocio
- **#2181** (Ch 5, img 41, **FALSO**): Il segnale raffigurato è posto, di norma, 150 metri prima dell'incrocio
- **#2221** (Ch 5, img 44, **FALSO**): Il segnale raffigurato si trova, di norma, a non più di 50 metri dall'incrocio
- *(+ altre 6 eccezioni presenti in `question_analytics.json`)*

### Eccezioni `contemporaneamente` → **VERO** (solitamente FALSO 77.8% | 8 eccezioni)

- **#2230** (Ch 5, img 45, **VERO**): Il segnale raffigurato preannuncia che la circolazione non può svolgersi contemporaneamente nei due sensi
- **#4558** (Ch 13, img 0, **VERO**): Se ad un incrocio giungono contemporaneamente da strade diverse due veicoli, l'obbligo di dare la precedenza spetta, di norma, al conducente del veicolo che arriva da sinistra
- **#4559** (Ch 13, img 0, **VERO**): Se ad un incrocio giungono contemporaneamente da strade diverse due veicoli, entrambi hanno l'obbligo di moderare la velocità, per evitare incidenti
- **#4741** (Ch 14, img 637, **VERO**): Nell'attraversare l'incrocio in figura i veicoli C e A passano contemporaneamente dopo il veicolo L
- **#4765** (Ch 14, img 638, **VERO**): Secondo le norme di precedenza nell'incrocio rappresentato in figura i veicoli D e N passano contemporaneamente dopo che è passato il veicolo R
- **#4810** (Ch 14, img 647, **VERO**): Secondo le norme di precedenza nell'incrocio rappresentato in figura i veicoli L e H passano contemporaneamente per primi
- **#4901** (Ch 14, img 639, **VERO**): Nell'incrocio rappresentato nella figura i veicoli T e B possono transitare contemporaneamente
- **#6885** (Ch 20, img 0, **VERO**): Se si commettono contemporaneamente più violazioni che comportano perdita di punti sulla patente, possono essere decurtati al massimo 15 punti, salvo che si tratti di infrazioni che comportano la sospensione della patente

## 6. Le Mutazioni del Ministero (Coppie Minime) / Ministry Distractor Mutations (Minimal Pairs)

**IT:** Raggruppando il database in 618 blocchi tematici contigui, abbiamo individuato 372 blocchi misti VERO+FALSO (coprendo 6600 domande) ed estratto 314 coppie minime pulite in cui il Ministero trasforma una regola VERA in un trabocchetto FALSO cambiando una sola breve espressione.

**EN:** By clustering the bank into 618 contiguous topic blocks, we found 372 mixed VERO+FALSO blocks (6600 questions) and extracted 314 clean minimal pairs where the Ministry turns a TRUE rule into a FALSE trap by editing a single short span.

| Famiglia di mutazione / Mutation Family | Coppie minime / Pairs |
| :--- | ---: |
| `other_factual_edit` | 90 |
| `terminology_swap` | 42 |
| `sign_category_swap` | 41 |
| `direction_polarity_swap` | 40 |
| `numeric_threshold_swap` | 30 |
| `negation_flip` | 30 |
| `intersection_vehicle_order` | 22 |
| `quantifier_scope_swap` | 19 |

### Top 25 Mutazioni VERO → FALSO più ricorrenti / Top 25 Recurring VERO → FALSO Mutations

| N | Famiglia / Family | VERO (Originale) | FALSO (Trappola) | Esempio reale / Real Pair |
| ---: | :--- | :--- | :--- | :--- |
| 8 | `sign_category_swap` | `prescrizione` | `indicazione` | **V#1715:** Il segnale raffigurato è un segnale di prescrizione... <br>**F#1717:** Il segnale raffigurato è un segnale di indicazione... |
| 5 | `negation_flip` | `*(omesso / omitted)*` | `non` | **V#7119:** Durante la guida, la percezione di un pericolo e la conseguente r... <br>**F#7147:** Durante la guida, la percezione di un pericolo e la conseguente r... |
| 5 | `sign_category_swap` | `prescrizione` | `divieto` | **V#1727:** Il segnale raffigurato è un segnale di prescrizione... <br>**F#1737:** Il segnale raffigurato è un segnale di divieto... |
| 4 | `sign_category_swap` | `pericolo` | `prescrizione` | **V#536:** Il segnale raffigurato è un segnale di pericolo... <br>**F#540:** Il segnale raffigurato è un segnale di prescrizione... |
| 4 | `sign_category_swap` | `prescrizione` | `pericolo` | **V#1863:** Il segnale raffigurato è un segnale di prescrizione... <br>**F#1869:** Il segnale raffigurato è un segnale di pericolo... |
| 3 | `direction_polarity_swap` | `aumenta` | `diminuisce` | **V#4259:** Lo spazio di frenatura aumenta se la strada è in discesa... <br>**F#4265:** Lo spazio di frenatura diminuisce se la strada è in discesa... |
| 3 | `direction_polarity_swap` | `sinistra` | `destra` | **V#2863:** Il vigile disposto con le braccia ad angolo retto come in figura ... <br>**F#2864:** Il vigile disposto con le braccia ad angolo retto come in figura ... |
| 2 | `intersection_vehicle_order` | `c` | `a` | **V#4669:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... <br>**F#4675:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... |
| 2 | `intersection_vehicle_order` | `dopo il veicolo r` | `per primo` | **V#4761:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... <br>**F#4768:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... |
| 2 | `intersection_vehicle_order` | `r` | `a` | **V#4668:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... <br>**F#4674:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... |
| 2 | `intersection_vehicle_order` | `t` | `a` | **V#4847:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... <br>**F#4851:** Secondo le norme di precedenza nell'incrocio rappresentato in fig... |
| 2 | `negation_flip` | `dipende` | `è indipendente` | **V#4268:** Lo spazio totale di arresto dipende dall'usura dei pneumatici... <br>**F#4270:** Lo spazio totale di arresto è indipendente dall'usura dei pneumat... |
| 2 | `negation_flip` | `non` | `*(omesso / omitted)*` | **V#7138:** I nostri sensi non riescono a cogliere tutti gli stimoli presenti... <br>**F#7165:** I nostri sensi riescono a cogliere tutti gli stimoli presenti nel... |
| 2 | `numeric_threshold_swap` | `ha validità di dieci` | `vale cinque` | **V#6924:** La patente di guida di categoria BE, salvo diversa limitazione ri... <br>**F#6932:** La patente di guida di categoria BE, salvo diversa limitazione ri... |
| 2 | `quantifier_scope_swap` | `*(omesso / omitted)*` | `soltanto` | **V#1872:** Il segnale raffigurato indica che è consentito svoltare a destra... <br>**F#1866:** Il segnale raffigurato indica che è consentito soltanto svoltare ... |
| 2 | `quantifier_scope_swap` | `massimo` | `minimo` | **V#1286:** Il segnale raffigurato obbliga a rispettare un limite massimo di ... <br>**F#1283:** Il segnale raffigurato obbliga a rispettare un limite minimo di v... |
| 2 | `quantifier_scope_swap` | `periodica` | `ogni cinque anni` | **V#285:** Le autocaravan sono soggette a revisione periodica... <br>**F#290:** Le autocaravan sono soggette a revisione ogni cinque anni... |
| 2 | `sign_category_swap` | `l'obbligo` | `il divieto` | **V#1743:** Il segnale raffigurato indica l'obbligo di svoltare a sinistra... <br>**F#1762:** Il segnale raffigurato indica il divieto di svoltare a sinistra... |
| 2 | `sign_category_swap` | `obbligo` | `indicazione` | **V#1838:** Il segnale raffigurato è un segnale di obbligo... <br>**F#1848:** Il segnale raffigurato è un segnale di indicazione... |
| 2 | `sign_category_swap` | `pericolo` | `obbligo` | **V#577:** Il segnale raffigurato è un segnale di pericolo... <br>**F#581:** Il segnale raffigurato è un segnale di obbligo... |
| 2 | `sign_category_swap` | `pericolo` | `precedenza` | **V#577:** Il segnale raffigurato è un segnale di pericolo... <br>**F#583:** Il segnale raffigurato è un segnale di precedenza... |
| 2 | `terminology_swap` | `passaggio obbligatorio` | `direzione obbligatoria` | **V#1912:** Il segnale raffigurato indica passaggio obbligatorio a sinistra... <br>**F#1918:** Il segnale raffigurato indica direzione obbligatoria a sinistra... |
| 2 | `terminology_swap` | `rugoso` | `coperto di ghiaccio` | **V#6231:** La forza aderente aumenta se l'asfalto è rugoso... <br>**F#6235:** La forza aderente aumenta se l'asfalto è coperto di ghiaccio... |
| 2 | `terminology_swap` | `rugoso` | `coperto dal fango` | **V#6231:** La forza aderente aumenta se l'asfalto è rugoso... <br>**F#6236:** La forza aderente aumenta se l'asfalto è coperto dal fango... |
| 1 | `direction_polarity_swap` | `*(omesso / omitted)*` | `sulla destra` | **V#914:** Il segnale raffigurato preannuncia un restringimento della carreg... <br>**F#926:** Il segnale raffigurato preannuncia un restringimento sulla destra... |

### Esempi affiancati per famiglia / Side-by-Side Family Examples

- **`negation_flip`** (Ch 23, img 0, sim=0.97):
  - **VERO (#7119):** Durante la guida, la percezione di un pericolo e la conseguente reazione del conducente sono influenzate dalle condizioni ambientali
  - **FALSO (#7147):** Durante la guida, la percezione di un pericolo e la conseguente reazione del conducente non sono influenzate dalle condizioni ambientali
- **`other_factual_edit`** (Ch 17, img 0, sim=0.97):
  - **VERO (#5427):** Fuori dei centri abitati, di notte, quando mancano o sono insufficienti le luci posteriori di posizione o di emergenza, è obbligatorio presegnalare il veicolo, fermo sulla carreggiata, con il segnale triangolare mobile di pericolo
  - **FALSO (#5435):** Fuori dei centri abitati, di notte, quando mancano o sono insufficienti le luci posteriori di posizione o di emergenza, è consigliabile presegnalare il veicolo fermo sulla carreggiata, con il segnale triangolare mobile di pericolo
- **`numeric_threshold_swap`** (Ch 17, img 0, sim=0.97):
  - **VERO (#5554):** Qualora, in situazione di emergenza, il conducente traini con il suo veicolo un altro veicolo senza rispettare le prescrizioni relative alla solidità del collegamento è punito con la sottrazione di 2 punti dalla patente
  - **FALSO (#5558):** Qualora, in situazione di emergenza, il conducente traini con il suo veicolo un altro veicolo senza rispettare le prescrizioni relative alla solidità del collegamento è punito con la sottrazione di 4 punti dalla patente
- **`direction_polarity_swap`** (Ch 7, img 386, sim=0.96):
  - **VERO (#2859):** Il vigile disposto con le braccia ad angolo retto come in figura consente la svolta a sinistra ai veicoli che arrivano dalla sua sinistra
  - **FALSO (#2866):** Il vigile disposto con le braccia ad angolo retto come in figura consente la svolta a sinistra ai veicoli che arrivano dalla sua destra
- **`quantifier_scope_swap`** (Ch 4, img 99, sim=0.95):
  - **VERO (#1872):** Il segnale raffigurato indica che è consentito svoltare a destra
  - **FALSO (#1866):** Il segnale raffigurato indica che è consentito soltanto svoltare a destra
- **`intersection_vehicle_order`** (Ch 14, img 659, sim=0.95):
  - **VERO (#4701):** Secondo le norme di precedenza nell'incrocio rappresentato in figura il veicolo R non deve dare la precedenza ad alcun veicolo
  - **FALSO (#4703):** Secondo le norme di precedenza nell'incrocio rappresentato in figura il veicolo C non deve dare la precedenza ad alcun veicolo
- **`terminology_swap`** (Ch 3, img 83, sim=0.93):
  - **VERO (#1569):** Il segnale raffigurato indica la fine del divieto di sorpasso per veicoli merci di massa a pieno carico superiore a 3,5 tonnellate
  - **FALSO (#1573):** Il segnale raffigurato indica la fine del divieto di sorpasso per autobus di massa a pieno carico superiore a 3,5 tonnellate
- **`sign_category_swap`** (Ch 2, img 1, sim=0.88):
  - **VERO (#536):** Il segnale raffigurato è un segnale di pericolo
  - **FALSO (#540):** Il segnale raffigurato è un segnale di prescrizione

## 7. Profilo per Capitolo e Nota sui Titoli / Chapter-by-Chapter Profile & Label Audit

**IT:** Nota importante sui dati dell'app: in `output/chapters.json` 16 etichette su 25 (capitoli 6–10 e 15–25) risultano sfasate rispetto al contenuto reale delle domande (ad esempio il capitolo 15 contiene domande sul sorpasso ma è etichettato 'Fermata, sosta, arresto'). Nella tabella seguente mostriamo i titoli reali verificati sul contenuto, i tassi VERO/FALSO e la densità di domande classificate come 'trap' o 'moderate'. Non abbiamo modificato `output/chapters.json` in questa fase.

**EN:** Important dataset note: in `output/chapters.json`, 16 of 25 chapter titles (chapters 6–10 and 15–25) are misaligned with their actual question content (for example, Chapter 15 contains overtaking questions while labeled 'Stopping/Parking'). The table below displays the verified actual topic per chapter, true/false balance, and trap density. `output/chapters.json` was left untouched in this phase.

| Ch | Argomento Reale (IT) | Actual Topic (EN) | `n` | `P(VERO)` | Trap | Moderate | Etichetta `chapters.json` OK? |
| ---: | :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| 1 | Definizioni generali e doveri nell'uso della strada | General road definitions and duties | 492 | 0.500 | 26 | 179 | SÌ / YES |
| 2 | Segnali di pericolo | Danger warning signs | 613 | 0.485 | 23 | 181 | SÌ / YES |
| 3 | Segnali di divieto | Prohibition signs | 492 | 0.492 | 40 | 248 | SÌ / YES |
| 4 | Segnali di obbligo | Mandatory signs | 427 | 0.471 | 34 | 196 | SÌ / YES |
| 5 | Segnali di precedenza | Priority / right-of-way signs | 242 | 0.492 | 9 | 92 | SÌ / YES |
| 6 | Segnaletica orizzontale e segni sugli ostacoli | Road markings and obstacle markers | 260 | 0.504 | 19 | 132 | NO (`Segnalazioni semaforiche e degli agenti del traffico`) |
| 7 | Segnalazioni semaforiche e degli agenti del traffico | Traffic lights and traffic officer signals | 253 | 0.466 | 10 | 95 | NO (`Segnali di indicazione`) |
| 8 | Segnali di indicazione | Direction and information signs | 548 | 0.473 | 12 | 173 | NO (`Pannelli integrativi`) |
| 9 | Segnali complementari, temporanei e di cantiere | Complementary, temporary, and roadwork signs | 181 | 0.475 | 4 | 40 | NO (`Segnali orizzontali`) |
| 10 | Pannelli integrativi dei segnali | Supplementary sign panels | 262 | 0.477 | 28 | 156 | NO (`Sorpasso`) |
| 11 | Limiti di velocità, pericolo e intralcio alla circolazione | Speed limits, hazard, and traffic obstruction | 256 | 0.555 | 40 | 123 | SÌ / YES |
| 12 | Distanza di sicurezza | Safe following distance | 135 | 0.489 | 21 | 70 | SÌ / YES |
| 13 | Norme sulla circolazione dei veicoli | General vehicle circulation rules | 372 | 0.522 | 38 | 149 | SÌ / YES |
| 14 | Ordine di precedenza agli incroci | Intersection right-of-way diagrams | 402 | 0.510 | 18 | 243 | SÌ / YES |
| 15 | Norme sul sorpasso | Overtaking rules | 156 | 0.526 | 5 | 45 | NO (`Fermata, sosta, arresto`) |
| 16 | Fermata, sosta, arresto e partenza | Stopping, parking, halting, and pulling out | 191 | 0.576 | 16 | 87 | NO (`Uso delle luci e dei dispositivi acustici, spie e simboli`) |
| 17 | Norme varie (ingombro, carichi, rimorchi, autostrade) | Miscellaneous rules (obstructions, loads, trailers, highways) | 331 | 0.523 | 33 | 125 | NO (`Incidenti stradali e comportamenti in caso di incidente`) |
| 18 | Uso delle luci, dispositivi acustici, spie e simboli | Lights, horns, dashboard warning lights and symbols | 176 | 0.511 | 7 | 58 | NO (`Documenti di circolazione e assicurazione`) |
| 19 | Dispositivi di equipaggiamento (cinture, casco, airbag) | Safety equipment (seatbelts, helmets, airbags, child seats) | 135 | 0.519 | 13 | 53 | NO (`Patenti di guida, sistema sanzionatorio, punti patente`) |
| 20 | Patenti di guida, documenti, sanzioni e punti | Driver's licenses, documents, penalties, and points | 232 | 0.487 | 48 | 129 | NO (`Elementi costitutivi del veicolo, manutenzione e uso`) |
| 21 | Incidenti stradali e comportamenti in caso di incidente | Road accidents and post-accident conduct | 129 | 0.519 | 20 | 42 | NO (`Comportamenti sicuri e guida in relazione alle condizioni fisiche e psicofisiche`) |
| 22 | Condizioni psicofisiche, alcool, droga e primo soccorso | Physical/mental fitness, alcohol, drugs, and first aid | 141 | 0.511 | 4 | 50 | NO (`Prudenza e rispetto degli altri utenti della strada`) |
| 23 | Responsabilità civile, penale, amministrativa e RCA | Civil, criminal, administrative liability and RCA insurance | 149 | 0.470 | 8 | 58 | NO (`Quiz vari 1`) |
| 24 | Limitazione dei consumi, ambiente e inquinamento | Fuel efficiency, environment, and pollution | 103 | 0.592 | 4 | 25 | NO (`Quiz vari 2`) |
| 25 | Elementi costitutivi del veicolo, manutenzione e stabilità | Vehicle components, maintenance, tires, and stability | 285 | 0.523 | 15 | 103 | NO (`Quiz vari 3`) |

## 8. Prossimo Passo: Piano Pilota Layer 3 (Costi e Tempi) / Next Step: Layer 3 LLM Pilot Plan

**IT:** Le analisi di Layer 1 e Layer 2 sono state eseguite al 100% in locale a costo zero. Se vuoi aggiungere il Layer 3 (etichettatura strutturata con modello multimodale sulle 411 immagini + test cieco su tutte le domande per scovare trabocchetti logici e visivi non visibili dalle sole parole), si consiglia un pilota calibrato su 100 domande stratificate (con ~50 immagini) prima di elaborare l'intero archivio. La tabella stima costi orientativi (prezzi API di riferimento approssimativi).

**EN:** Layers 1 and 2 ran 100% locally at $0 API cost. If you want to proceed to Layer 3 (one-time multimodal captioning of the 411 images + blind-answering and structured trap tagging to catch logical and visual traps beyond surface wording), we recommend a calibrated 100-question stratified pilot (~50 images) before scaling to all 6,963 items. Approximate reference API cost estimates follow:

| Modello / Model | Input / 1M | Output / 1M | Stima Pilota 100 dom. | Stima Completa (6.963 × 2 + 411 img) | Note / Notes |
| :--- | ---: | ---: | ---: | ---: | :--- |
| Gemini 2.5 Flash-Lite (ref) | $0.10 | $0.40 | $0.019 | $1.02 | Fastest & lowest cost; good for initial 100-question blind + tag pilot. |
| Gemini 2.5 Flash (ref) | $0.30 | $2.50 | $0.091 | $4.80 | Strong multimodal sign vision & Italian nuance; recommended for 411 image captions. |
| GPT-4.1-mini (ref) | $0.40 | $1.60 | $0.077 | $4.06 | Strong structured JSON adherence and cross-check baseline. |
| Claude Haiku 4.5 (ref) | $1.00 | $5.00 | $0.218 | $11.51 | High instruction reliability; best reserved for auditing borderline/trap subsets. |

