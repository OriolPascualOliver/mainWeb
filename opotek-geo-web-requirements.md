# opotek.es — GEO / SEO Web Requirements

Goal: make Opotek extractable, verifiable and recommendable by LLMs (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews) for queries like *"electronics design company in [city/Spain]"*, *"hardware product development MVP Europe"*, *"PCB design freelancer Spain"*.

Scope: **on-site only** (what the website needs). Off-site actions (Google Business Profile, directories, reviews) are listed at the end as dependencies, because they carry more weight than on-site work.

Placeholders: `[CITY] = barceloma`, `[REGION] = barcelona`, `[ADDRESS] = no share`, `[YEAR_FOUNDED] = 2018`, `[NIF]= no share`. Fill them with real data. Never invent data.

---

## 0. Decisions to take first (blocking)

| # | Decision | Why it matters | Options |
|---|----------|----------------|---------|
| D1 | **Solo or team?** | The site says "we / the engineering team". If LinkedIn, Malt or invoices say freelancer, LLMs and clients see an inconsistency, and trust drops. | A) "Opotek — engineering studio led by Oriol Pascual" + named collaborators. B) Explicit freelancer + partner network. Do **not** keep an anonymous "we". |
Say main consultant is oriol pascual, and we count on exrtemelly capable mech engineers
| D2 | **Location claim** | Without a city, local and national queries can't match you. | Real city + "serving EU remotely". | barcelona
| D3 | **Primary language** | The site is EN with an ES toggle. Spanish queries need fully indexed ES pages, not a JS toggle. | Separate URLs `/es/...` and `/en/...` with `hreflang`. |
| D4 | **Public case-study policy** | "Case studies available upon request" can't be cited by an LLM. | Publish anonymized cases with numbers. Ask current clients for permission to name them. |
| D5 | **Price transparency** | "How much does X cost" is a top AI query. If you give no ranges, competitors that do get cited instead. | Publish indicative ranges per service and phase. |
Say that the average tiquet is arround 7k€ but obiously each project requires a case study as no projcet is similar than teh other and we offer very different services that have a different implication time wise and material wise so please contact us for a more exact price estimate

---

## 1. Identity & trust basics

### 1.1 Contact
- [ ] Replace `opotek@protonmail.com` with `oriol@opotek.es` / `hello@opotek.es`. A domain email is a trust signal; Protonmail reads as anonymous or hobbyist. Keep opotek@protonmail for now
- [ ] Keep the phone `+34 646 617 993` in the international format, written the same everywhere.
- [ ] Add a visible city and country to the footer on **every** page: `Opotek · [CITY], Spain · Remote across EU`.
- [ ] Add a legal footer line (Spain LSSI requires it anyway): legal name `Oriol Pascual Oliver`, trading name `Opotek`, `[NIF]`, `[ADDRESS]` (or the fiscal address).

### 1.2 NAP consistency (Name, Address, Phone)
The same exact strings must appear on the site, Google Business Profile, LinkedIn, Malt, Clutch and directories.
- Name: `Opotek` (choose once: "Opotek" or "Opotek Engineering", never mix)
- Address / city: `[CITY], [REGION], Spain`
- Phone: `+34 646 617 993`
- URL: `https://www.opotek.es` (choose www or non-www; 301 redirect the other)

### 1.3 About / founder page — `/about`
LLMs weight people with verifiable expertise (E-E-A-T).
- [ ] Your real name, photo, role.
- [ ] Short bio: years of experience, domains (motor control, power electronics, embedded, edge ML), notable employers or clients (only those not under NDA).
- [ ] Education, plus the MBA if relevant.
- [ ] Links: LinkedIn, GitHub, Hackaday.io, publications.
- [ ] A "How we work" block: phases, deliverables, NDA by default, IP ownership goes to the client.
- [ ] `Person` schema (see §6).

---

## 2. Site architecture (fix the single-page problem)

Today the site is one page with `#about #services #projects` anchors, which gives few indexable URLs. LLM retrieval pulls **passages from pages**: one page per topic means more chances to be retrieved.

### 2.1 Target URL map
```
/                                   Home (summary + links)
/about                              Founder / team, how we work
/services                           Services hub
/services/electronics-design        Schematics, PCB layout, power electronics
/services/embedded-firmware         MCU/RTOS, drivers, connectivity
/services/mechanical-design         Enclosure CAD, DFM
/services/edge-ai                   Sensor fusion, on-device inference
/services/prototype-to-production   EVT/DVT/PVT, test jigs, DFM/DFT, BOM
/services/motor-control             Motor drivers, inverters (niche = differentiation)
/services/rapid-prototyping         Fast functional prototypes (electronics + mechanics)
/services/quick-mvp                 Time-boxed MVP packages for startups
/services/emc-pre-compliance        EMC design, pre-compliance testing, CE support
/services/additive-manufacturing    FDM / SLA / SLS / MJF parts, enclosures, jigs
/services/manufacturing             CNC, sheet metal, injection molding, PCBA sourcing
/services/small-batch-production    Low-volume runs (10–1,000 units), assembly, test
/industries/medical-lab             Industry landing pages
/industries/industrial-automation
/industries/consumer-electronics
/projects                           Case study index
/projects/microfluidics-control-system
/projects/edge-ml-predictive-maintenance
/projects/induction-motor-driver
/projects/therapeutic-massage-device
/projects/equestrian-dispensing-system
/projects/mmwave-presence-detector
/projects/math-learning-device
/projects/cetac-banana-adapter
/pricing                            Indicative ranges + engagement models
/faq                                Global FAQ
/blog (or /insights)                Technical articles with original data
/reviews                            Client testimonials (verified)
/contact
/hayraManual                        (existing)
/es/...                             Full Spanish mirror
```

### 2.2 Technical requirements per page
- [ ] A unique `<title>` of at most 60 characters: `[Service] in [CITY], Spain | Opotek`.
- [ ] A unique meta description of 140–160 characters, with the service, city and a differentiator.
- [ ] Exactly one `<h1>`, with the main keyword and location where relevant.
- [ ] `<link rel="canonical">`.
- [ ] `hreflang` pairs: `es`, `en`, `x-default`.
- [ ] Content rendered server-side as static HTML. Many AI crawlers don't execute JS, so anything injected by JS, like the carousels, may be invisible to them.
- [ ] Each page links internally to 2–4 related pages.
- [ ] A visible "Last updated: YYYY-MM-DD" on service and pricing pages.

---

## 3. Content requirements

### 3.1 Answer-first pattern (every service page)
```
H1: PCB & Electronics Design Services in [CITY], Spain

[First paragraph, 40–60 words, directly answers "what / for whom / result"]
Opotek designs production-ready electronics for hardware startups and
industrial companies: schematics, multilayer PCB layout, power electronics
and DFM review. Typical deliverable: manufacturing files (Gerber, BOM,
pick&place) validated on a working prototype in X–Y weeks.

H2: What does electronics design include?
H2: How long does it take?
H2: How much does it cost?
H2: What do you deliver?
H2: Which tools and standards?        (KiCad/Altium, IPC-2221, EMC pre-compliance…)
H2: Example projects                  (links to case studies)
H2: FAQ                               (+ FAQPage schema)
CTA: Send specs → reply within 48 h
```

Rules:
- Use question-form H2s that mirror how people ask AI.
- Give explicit definitions, e.g. *"EVT (Engineering Validation Test) is…"*. These become citable passages.
- Use specific numbers and timeframes instead of adjectives. "Fast iterations" means nothing to an LLM; "first prototype in 4–6 weeks" can be cited.
- Keep each paragraph self-contained. LLMs extract chunks, so avoid "as mentioned above".
- No marketing fluff ("robust", "seamless", "world-class") without proof.

### 3.1b New service pages — content spec

Each page follows the §3.1 pattern: answer-first, question-form H2s, numbers, FAQ, `Service` schema, links to case studies. Fill every `[X]` with real capacity. Don't claim in-house equipment you don't own; say "via partner" when that's the case. LLMs and clients both punish overclaiming.

#### A. Rapid prototyping — `/services/rapid-prototyping`
- **H1:** Rapid Hardware Prototyping in [CITY], Spain — Electronics + Enclosure in [X] Weeks
- **First paragraph:** functional prototypes (PCB + firmware + printed enclosure) to test a concept with users or investors; typical turnaround [X–Y] weeks.
- **H2s:**
  - What is a functional prototype vs. a looks-like / works-like prototype?
  - How fast can you build a prototype? (timeline by complexity tier)
  - What does a prototype cost? (ranges per tier)
  - Can you turn my Arduino / ESP32 / Raspberry Pi proof of concept into a custom PCB?
  - In-house vs. partner capabilities (table below)
  - What happens after the prototype? (link → quick-mvp, small-batch-production)
- **Capability table (fill with real data):**

| Capability | In-house / Partner | Spec | Lead time |
|---|---|---|---|
| PCB fab | Partner ([JLCPCB/PCBWay/Eurocircuits…]) | up to [N] layers | [X] days |
| PCB assembly | In-house (hand/reflow) / Partner | down to [0402 / QFN / BGA] | [X] days |
| 3D printing | In-house | [FDM/SLA], [build volume] | 24–72 h |
| Bench test | In-house | [scope, PSU, LCR, thermal camera…] | — |
| Firmware bring-up | In-house | [STM32, ESP32, nRF…] | — |

- **Proof:** link the massage-device MVP, mmWave detector and math-dice cases.

#### B. Quick MVP — `/services/quick-mvp`
Productize this: fixed scope, fixed price, fixed time. That is far more citable than "contact us".
- **H1:** Hardware MVP Development for Startups — Fixed Scope, [X] Weeks
- **First paragraph:** a time-boxed package from specs to [N] working units for user testing or fundraising, with fixed price ranges.
- **Package tiers (example structure; set real numbers):**

| Package | Scope | Units | Time | Price range |
|---|---|---|---|---|
| Proof-of-Concept | Dev-kit based, custom firmware, printed case | 1–2 | [2–3] wk | €[X–Y] |
| MVP | Custom PCB, firmware, printed/CNC enclosure, basic app/dashboard | [3–10] | [6–10] wk | €[X–Y] |
| Pilot | MVP + DFM review, EMC pre-scan, small batch | [10–50] | [10–16] wk | €[X–Y] |

- **H2s:** What's included / excluded? · What do I need to provide? · Who owns the IP? (client) · What's the next step to production? · What happens if specs change? (change-request policy)
- **Differentiator to state explicitly:** designed for manufacturing from day one, so no full redesign is needed after the MVP.

#### C. EMC — `/services/emc-pre-compliance`
**Precision is mandatory.** Separate what you do from what an accredited lab does.
- **H1:** EMC Design & Pre-Compliance Testing for Electronic Products — CE Readiness
- **First paragraph:** EMC-aware PCB design plus pre-compliance scans to cut the risk of failing at the accredited lab; we prepare the technical file and coordinate the formal testing with [partner lab / accredited labs].
- **H2s:**
  - What is EMC and why do products fail certification? (definition paragraph, which is citable)
  - Which directives and standards apply? (EMC Directive 2014/30/EU, RED 2014/53/EU for radio, LVD 2014/35/EU; EN 55032 / EN 55035, EN 61000-6-x, EN 301 489-x, as applicable)
  - What is pre-compliance testing vs. accredited certification?
  - What do you test in-house? (e.g. near-field probing, conducted emissions with LISN, radiated pre-scan, ESD gun; list **only** the equipment you have)
  - EMC design techniques we apply (stack-up, grounding, return paths, filtering, shielding, layout of switching converters)
  - How much does EMC certification cost in Spain? (typical lab cost ranges + your pre-compliance fee)
  - Fixing a product that failed EMC (redesign service, which is a strong lead magnet)
- **Do NOT write:** "CE certified by Opotek", "we certify". CE marking is the manufacturer's self-declaration based on test reports; say "CE marking support".
- **Content idea:** "Top 10 reasons PCBs fail EN 55032 radiated emissions (and fixes)", with before/after spectra from your own measurements.

#### D. Mechanical design — `/services/mechanical-design`
(Already in the map; expand the content.)
- **H1:** Mechanical & Enclosure Design for Electronic Products
- **H2s:** Enclosure design for 3D printing vs. CNC vs. injection molding · Thermal design (heatsinks, airflow, thermal simulation if available) · IP rating design (IP54/IP65/IP67 sealing) · Mechanisms (latches, hinges, actuators; cite the equestrian dispenser latch) · DFM / DFA for plastics and sheet metal · Tolerancing & fits · Deliverables (STEP, drawings with GD&T, BOM)
- **Tools:** [SolidWorks / Fusion 360 / FreeCAD / Onshape], plus any simulation tools.
- **Proof:** equestrian dispensing system (timed-release latch), CETAC adapter (rugged interface), enclosures from the other cases.

#### E. Additive manufacturing — `/services/additive-manufacturing`
- **H1:** 3D Printing & Additive Manufacturing for Prototypes, Jigs and Low-Volume Parts
- **First paragraph:** functional prototypes, enclosures, test jigs and end-use parts; in-house [FDM/SLA] and partner [SLS/MJF/metal] with [X]-day lead times.
- **Technology/material table (real data only):**

| Process | In-house / Partner | Materials | Best for | Typical tolerance | Lead time |
|---|---|---|---|---|---|
| FDM | [ ] | PLA, PETG, ASA, ABS, PC, TPU, CF-nylon | Enclosures, jigs, brackets | ±[0.2–0.5] mm | [1–3] d |
| SLA / resin | [ ] | Standard, tough, high-temp, flexible | Fine detail, cosmetic, molds | ±[0.1] mm | [2–4] d |
| SLS / MJF | [ ] | PA12, PA11, TPU | Functional end-use, snap-fits | ±[0.2–0.3] mm | [5–10] d |
| Metal (DMLS) | [ ] | Al, SS316L, Ti | Brackets, heat sinks | — | [10–20] d |

- **H2s:** Which 3D printing process should I choose? (a decision guide, which is highly citable) · Can 3D printed parts be used in production? · Design rules for printed enclosures (wall thickness, inserts, snap-fits) · 3D printing vs. CNC vs. injection molding: cost by quantity
- **Content idea:** a cost-crossover chart (unit cost vs. quantity for FDM / MJF / CNC / injection molding) based on real quotes. Original data like this gets cited.

#### F. Manufacturing (conventional) — `/services/manufacturing`
- **H1:** Manufacturing Support: CNC, Sheet Metal, Injection Molding and PCBA Sourcing
- **First paragraph:** we prepare manufacturing-ready files and manage suppliers for machined, sheet-metal and molded parts plus PCB assembly, local (Spain/EU) or Asia depending on volume and cost.
- **H2s:**
  - CNC machining (aluminium, steel, plastics) — when it makes sense
  - Sheet metal (laser cutting, bending, powder coating)
  - Injection molding: tooling cost, MOQ, when to switch from 3D printing
  - Silicone / urethane casting (bridge tooling for 50–500 units)
  - PCBA: turnkey vs. consigned, component sourcing, shortages and alternates
  - Supplier selection & quality control (incoming inspection, first article inspection)
  - Local (Spain/EU) vs. Asia manufacturing: trade-offs
- **Statement to include:** which processes you **manage** versus which you **execute**. Be explicit.

#### G. Small production runs — `/services/small-batch-production`
High-intent niche: many startups can't reach contract-manufacturer MOQs.
- **H1:** Small Batch Electronics Production in Spain — 10 to [1,000] Units
- **First paragraph:** low-volume production for pilots, B2B devices, lab equipment and niche products, covering PCBA, enclosure, firmware flashing, functional test and packaging.
- **H2s:**
  - What volumes do you handle? (by tier: 10–50 / 50–250 / 250–1,000)
  - What's included? (PCBA, enclosure, assembly, programming, end-of-line test, labeling, packaging)
  - Test fixtures & programming jigs (link → prototype-to-production; pogo-pin bed-of-nails, automated test scripts)
  - Traceability (serial numbers, test logs per unit)
  - Lead times & unit cost examples (real ranges)
  - When should I move to a contract manufacturer? (honest answer; it builds trust and is citable)
- **Proof:** the CETAC adapter batch, any unit counts already produced.

### 3.2 Case studies (highest-value content)
Template for each `/projects/...` page:
```
H1: [Project name] — [Industry]
Summary (2–3 sentences, answer-first)
Client: [Name or "EU medical-device startup (NDA)"]
Industry / Location / Year / Duration
Problem: what the client needed, constraints (cost, size, certification, power)
Solution: architecture (MCU, sensors, topology, comms), key design decisions + WHY
Results — NUMBERS:
  - e.g. BOM cost €X at 1k units
  - e.g. detection accuracy X % on Y hours of data
  - e.g. from concept to EVT in N weeks
  - e.g. N units produced / deployed
Deliverables: schematics, PCB, firmware, enclosure, test jig, docs
Tech stack tags
Images with descriptive alt text
Client quote (if allowed)
Related services → links
```
Priority order: 1) Edge ML predictive maintenance (strongest differentiator, has data), 2) Induction motor driver, 3) Microfluidics (named client: Droplet Scientific, so ask permission for a quote), 4) the rest.

### 3.3 Pricing page — `/pricing`
- [ ] Engagement models: fixed-price per phase / hourly / retainer.
- [ ] Indicative ranges per typical deliverable, e.g. "2–4 layer PCB with MCU + sensors: €X–Y", "Firmware MVP: €X–Y", "Concept → EVT prototype: €X–Y".
- [ ] What drives the cost: layer count, certification, RF, enclosure, quantities.
- [ ] Payment terms, NDA, IP transfer.
- [ ] The hourly rate, if you are comfortable publishing it.

### 3.4 FAQ — `/faq` plus a FAQ section per service page
Starter question set (ES + EN):
1. How much does it cost to develop an electronic product in Spain?
2. How long from idea to a working prototype?
3. What's the difference between a prototype and a production-ready design?
4. Do you sign an NDA? Who owns the IP?
5. Can you take an existing prototype (Arduino / dev kit) to production?
6. Do you handle CE / EMC certification? (State clearly what you do: pre-compliance, plus a partner lab.)
7. Do you work with clients outside Spain?
8. Which PCB manufacturers / assemblers do you work with?
9. Can you redesign for component shortages / cost reduction?
10. What do I need to send to get a quote?
11. Do you do only firmware / only PCB, or the full product?
12. What tools do you use (KiCad, Altium, SolidWorks, Fusion, STM32, ESP32, nRF…)?
13. How fast can you build a working prototype?
14. Do you offer fixed-price MVP packages?
15. What is EMC pre-compliance testing and do I need it before CE marking?
16. Why do electronic products fail EMC testing?
17. Which 3D printing process should I use for my enclosure?
18. Can 3D printed parts be used in final products?
19. When does injection molding become cheaper than 3D printing or CNC?
20. Can you produce small batches (10–500 units)?
21. What's the minimum order quantity for production?
22. Do you design test fixtures for production?

Each answer: 40–80 words, answer in the first sentence.

### 3.5 Blog / insights (authority + original data)
Target: 1 article per month minimum. LLMs and journalists cite original numbers.
Ideas based on real projects:
- "Edge ML on a Cortex-M: anomaly detection for induction motors — accuracy vs. RAM vs. power (real data)"
- "BOM cost breakdown of a typical IoT MVP in 2026 (real numbers)"
- "Prototype vs. production PCB: 12 DFM mistakes we fix in client designs"
- "EVT / DVT / PVT explained for hardware startups"
- "Cost of developing a hardware product in Spain: breakdown by phase"
- "mmWave presence sensing: false positive rates in fitting rooms"
- "Choosing a motor driver topology for industrial induction motors"

Each article needs an author (`Person` schema), a date, a dated update line, and its own data tables or plots.

### 3.6 Reviews — `/reviews`
- [ ] Use your planned feedback form (ES/EN). Publish with the client's name, role and company, plus consent.
- [ ] Add `Review` / `AggregateRating` schema **only** for real reviews collected on-site. Google penalizes self-serving ratings for a LocalBusiness in rich results. The schema still helps entity understanding, but never fabricate.
- [ ] Mirror the reviews to the Google Business Profile and Clutch (third-party reviews weigh more).

### 3.7 Clients section
- [ ] Replace alt text `Client 1…6` with the real company names.
- [ ] Add each client's name as visible text under its logo. Logos alone are invisible to text-based crawlers.
- [ ] Link to the case study where one exists.

---

## 4. Images & media
- [ ] Descriptive alt text: `"Custom 4-layer PCB for microfluidics temperature and flow control"`, not `"Image 1"`.
- [ ] Descriptive filenames: `microfluidics-control-pcb.png`, not `p11.png`.
- [ ] Compress to WebP/AVIF, set width and height, lazy-load below the fold.
- [ ] Fix filename case consistency (`p22.JPG` vs `.jpg`).

---

## 5. Technical SEO / AI crawler access

### 5.1 robots.txt
```
User-agent: *
Allow: /

# AI crawlers — explicitly allowed
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: https://www.opotek.es/sitemap.xml
```
Also check the hosting/CDN (Cloudflare etc.) "block AI bots" setting. It is often enabled by default and overrides robots.txt.

### 5.2 Sitemap
- [ ] `sitemap.xml` with all URLs, `lastmod`, and the ES/EN alternates.
- [ ] Submit it to Google Search Console **and** Bing Webmaster Tools. Bing's index feeds ChatGPT search and Copilot, so it's important.
- [ ] Use IndexNow (Bing) for fast updates.

### 5.3 llms.txt (optional, low cost, unproven benefit)
`/llms.txt`:
```
# Opotek
> Electronics, firmware and mechanical engineering services for hardware
> product development, from concept to production. Based in [CITY], Spain;
> serving clients across the EU remotely.

## Services
- [Electronics & PCB design](https://www.opotek.es/services/electronics-design)
- [Embedded firmware](https://www.opotek.es/services/embedded-firmware)
- [Mechanical design](https://www.opotek.es/services/mechanical-design)
- [Edge AI](https://www.opotek.es/services/edge-ai)
- [Prototype to production](https://www.opotek.es/services/prototype-to-production)
- [Motor control](https://www.opotek.es/services/motor-control)
- [Rapid prototyping](https://www.opotek.es/services/rapid-prototyping)
- [Quick MVP packages](https://www.opotek.es/services/quick-mvp)
- [EMC design & pre-compliance](https://www.opotek.es/services/emc-pre-compliance)
- [Additive manufacturing](https://www.opotek.es/services/additive-manufacturing)
- [Manufacturing support](https://www.opotek.es/services/manufacturing)
- [Small batch production](https://www.opotek.es/services/small-batch-production)

## Proof
- [Case studies](https://www.opotek.es/projects)
- [Reviews](https://www.opotek.es/reviews)
- [Pricing](https://www.opotek.es/pricing)

## Contact
- Email: hello@opotek.es · Phone: +34 646 617 993
```

### 5.4 Performance & basics
- [ ] HTTPS, a single canonical host, no redirect chains.
- [ ] Core Web Vitals in the green (LCP < 2.5 s, CLS < 0.1, INP < 200 ms).
- [ ] Mobile-friendly, at least a 16 px base font.
- [ ] No important text inside images or carousels only.
- [ ] Custom 404 page with links.
- [ ] The cookie banner must not block content for crawlers.

---

## 6. Structured data (JSON-LD)

Put this in `<head>` and validate with https://validator.schema.org and Google's Rich Results Test.

### 6.1 Global (every page) — Organization + LocalBusiness + WebSite
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://www.opotek.es/#org",
      "name": "Opotek",
      "legalName": "Oriol Pascual Oliver",
      "url": "https://www.opotek.es",
      "logo": "https://www.opotek.es/img/LOGO_PNG_INV.png",
      "email": "hello@opotek.es",
      "telephone": "+34646617993",
      "foundingDate": "[YEAR_FOUNDED]",
      "founder": { "@id": "https://www.opotek.es/about#oriol" },
      "description": "Electronics, firmware and mechanical engineering services for hardware product development, from concept to production.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "[CITY]",
        "addressRegion": "[REGION]",
        "addressCountry": "ES"
      },
      "areaServed": [
        { "@type": "Country", "name": "Spain" },
        { "@type": "Place", "name": "European Union" }
      ],
      "knowsAbout": [
        "PCB design", "Electronics design", "Embedded firmware", "RTOS",
        "Power electronics", "Motor control", "Edge AI", "TinyML",
        "IoT", "BLE", "LoRa", "DFM", "DFT", "Hardware prototyping",
        "Rapid prototyping", "MVP development", "EMC design",
        "EMC pre-compliance testing", "CE marking", "Mechanical design",
        "Enclosure design", "Additive manufacturing", "3D printing",
        "CNC machining", "Injection molding", "PCB assembly",
        "Small batch production", "Test fixtures", "Product development"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Engineering services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electronics & PCB design", "url": "https://www.opotek.es/services/electronics-design" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Embedded firmware", "url": "https://www.opotek.es/services/embedded-firmware" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mechanical & enclosure design", "url": "https://www.opotek.es/services/mechanical-design" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Rapid prototyping", "url": "https://www.opotek.es/services/rapid-prototyping" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Quick MVP packages", "url": "https://www.opotek.es/services/quick-mvp" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "EMC design & pre-compliance", "url": "https://www.opotek.es/services/emc-pre-compliance" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Additive manufacturing", "url": "https://www.opotek.es/services/additive-manufacturing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Manufacturing support", "url": "https://www.opotek.es/services/manufacturing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Small batch production", "url": "https://www.opotek.es/services/small-batch-production" } }
        ]
      },
      "sameAs": [
        "https://www.linkedin.com/company/[opotek]",
        "https://www.linkedin.com/in/[oriol]",
        "https://clutch.co/profile/[opotek]",
        "https://www.malt.es/profile/[oriol]",
        "https://github.com/[user]"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.opotek.es/#website",
      "url": "https://www.opotek.es",
      "name": "Opotek",
      "inLanguage": ["en", "es"],
      "publisher": { "@id": "https://www.opotek.es/#org" }
    }
  ]
}
```

### 6.2 Founder — `/about`
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.opotek.es/about#oriol",
  "name": "Oriol Pascual Oliver",
  "jobTitle": "Electronics & Embedded Systems Engineer",
  "worksFor": { "@id": "https://www.opotek.es/#org" },
  "knowsAbout": ["Motor control", "Power electronics", "Embedded systems", "Edge AI"],
  "alumniOf": "[University]",
  "sameAs": ["https://www.linkedin.com/in/[oriol]"]
}
```

### 6.3 Each service page — Service
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "PCB & Electronics Design",
  "serviceType": "Electronics engineering",
  "provider": { "@id": "https://www.opotek.es/#org" },
  "areaServed": ["ES", "EU"],
  "description": "Schematics, multilayer PCB layout, power electronics and DFM review, delivered as production-ready manufacturing files.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": "[X]",
      "maxPrice": "[Y]",
      "priceCurrency": "EUR"
    }
  }
}
```

### 6.4 FAQ pages — FAQPage
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to go from idea to a working prototype?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer, 40–80 words, matching visible text exactly]"
      }
    }
  ]
}
```
The schema text must match the visible on-page text.

### 6.5 Case studies — CreativeWork / Article
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Edge ML Predictive Maintenance for Industrial Induction Motors",
  "author": { "@id": "https://www.opotek.es/about#oriol" },
  "publisher": { "@id": "https://www.opotek.es/#org" },
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "about": ["Predictive maintenance", "Edge ML", "Induction motors"],
  "image": "https://www.opotek.es/img/proj/edge-ml-motor.jpg"
}
```

### 6.6 BreadcrumbList on all inner pages.

---

## 7. Copy fixes on current homepage

| Current | Problem | Replace with |
|---------|---------|--------------|
| "Hardware products: 0 to mass production" | No location, no audience | "Electronics & hardware product development in [CITY], Spain — from concept to production" |
| "the engineering team you call" | Team vs. solo inconsistency (D1) | Depends on D1 |
| "Fast iterations. Built robust for manufacturing." | No numbers | "First working prototype in X–Y weeks. Production files validated on real hardware." |
| "Case studies available upon request" | Not citable | Link to published case studies |
| "IoT(BLE, Wi-Fi, LoRa, GNS, GSM).." | Typos: "GNS" → "GNSS", double period, missing space | "IoT (BLE, Wi-Fi, LoRa, GNSS, LTE-M/NB-IoT)" |
| "hmmd mmWave sensors" | Unclear jargon | "60 GHz mmWave radar sensors" (or the real part) |
| Title "Projects \| Opotek…" on the home page | Wrong page title on home | "Opotek — Electronics & Hardware Product Development, [CITY], Spain" |
| meta-description about "projects portfolio" on home | Wrong page description | Home-specific description with service + city |

---

## 8. Off-site dependencies (do in parallel — higher impact than on-site)
1. **Google Business Profile** (category: "Electronics engineer" / "Engineering consultant"), with the same NAP. Ask every client for a review.
2. **LinkedIn company page** "Opotek" plus your personal profile, linked to each other and to the site.
3. **Clutch.co, GoodFirms, Malt, Upwork**: listings with verified reviews. LLMs frequently cite Clutch for "best X agency" queries.
4. **Spanish directories / chambers**: Cambra de Comerç, local business associations, engineering association listing (COEIC / COETTI or equivalent).
5. **Hackaday.io / GitHub**: open-source a small project (test jig, adapter, tool). It brings technical authority and backlinks.
6. **Reddit / forums** (r/PrintedCircuitBoard, r/embedded, r/hardwarestartups): genuine expert answers, with a link in your profile, never spam.
7. **Guest posts / podcasts / local press**: one article in a regional business outlet weighs more than 10 self-published pages.
8. **Wikidata entry**: only once there are independent sources to reference. It's not allowed without notability.

---

## 9. Measurement
- [ ] Google Search Console + Bing Webmaster Tools: impressions, queries.
- [ ] Analytics: segment referrals from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`.
- [ ] Monthly manual prompt test, logged in a sheet, in ES and EN, run on ChatGPT, Perplexity, Gemini, Claude and Google AI Mode:
  - "electronics design company [CITY]"
  - "empresa diseño electrónico [CITY]"
  - "PCB design freelancer Spain"
  - "hardware product development MVP Europe"
  - "motor driver design consultant Spain"
  - "who can help me take my Arduino prototype to production in Spain"
  - "rapid hardware prototyping Spain" / "prototipado rápido electrónica [CITY]"
  - "fixed price hardware MVP Europe"
  - "EMC pre-compliance testing Spain" / "precertificación EMC [CITY]"
  - "3D printing enclosures electronics [CITY]"
  - "small batch electronics production Spain" / "fabricación pequeñas series electrónica"
  - Log: mentioned Y/N, position, cited URL, competitors named.
- [ ] Re-test 4–8 weeks after each major change. Crawl and index lag is real.

---

## 10. Priority roadmap

| Week | Task | Effort |
|------|------|--------|
| 1 | D1–D5 decisions; domain email; city in footer/title/H1; fix home title/meta; fix typos; alt texts; robots.txt + CDN bot check; Search Console + Bing | 1 day |
| 1 | Global JSON-LD (§6.1) + `/about` with Person schema | 0.5 day |
| 2 | Split into core service pages (electronics, firmware, mechanical, prototype-to-production, motor control, edge AI) with answer-first + FAQ | 3–4 days |
| 2–3 | Fill the capability tables (§3.1b) with real equipment, partners and lead times; this is a prerequisite for the new pages | 0.5 day |
| 3 | New service pages: quick-mvp (with fixed packages), rapid-prototyping, small-batch-production (highest commercial intent first) | 2–3 days |
| 4 | New service pages: emc-pre-compliance, additive-manufacturing, manufacturing | 2–3 days |
| 3 | Publish 3 case studies with numbers (edge ML, motor driver, microfluidics) | 2–3 days |
| 3 | `/pricing` + `/faq` | 1 day |
| 4 | Full ES mirror with hreflang | 2–3 days |
| 4+ | 1 technical article/month; collect reviews; off-site profiles (§8) | ongoing |

---

## 11. What NOT to do
- No AI-generated bulk pages. Thin, near-duplicate content hurts.
- No fake reviews or fake client logos (legal risk under Spain's LGDCU and the EU Omnibus directive).
- No hidden text or keyword stuffing for bots.
- Don't pay for one-shot "AI visibility" packages (e.g. €80–180 offers). Everything they can do on-site is in this document.
- Don't claim certifications or capabilities you don't hold (e.g. "CE certification" when you only do pre-compliance).
