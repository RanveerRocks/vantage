# Where the numbers come from

The methodology page makes a promise: every figure in Vantage traces back to
something real. This is the long version of that promise, the actual list of
what I leaned on and what each source was for. I wrote it as I was curating the
data, so it reads more like a research log than a formal bibliography. That is
on purpose.

A few ground rules I held myself to:

- Everything here is a snapshot, dated **18 August 2026**. Visa rules, salaries
  and exchange rates all move, so read this as "true when I checked," not a live
  feed. The app says the same thing in its footer.
- I cited primary and official sources wherever one existed: government
  immigration departments, national statistics offices, and established
  international indices. Agent websites and consultant blogs were fine for
  figuring out *where* to look, but none of them ever became the citation.
- Vantage is built for **undergraduate** study. So study lengths, tuition
  averages and the rest are the undergraduate figures, not postgraduate.
- Money is stored in US dollars and shown in rupees at the rate in
  `config.json` (95.68 to the dollar on 18 August 2026). Foreign figures were
  converted to dollars first, at the market rate on the same day.

The rest is grouped by the five things the app actually shows you. Under each,
what I was trying to pin down and who I trusted to tell me.

## The career and visa landscape

Behind every dot sits five things: how wanted that degree is, how open the visa
system is, how long the post-study work visa runs, how many years to permanent
residency, and the salary-against-cost return.

Each of the 64 country-and-degree records carries four sources, and they do
different jobs.

The anchor is the country's own occupation or shortage list, the official read
on whether that field is genuinely in demand:

- United States, the Bureau of Labor Statistics occupational data
- Canada, the federal Job Bank
- Australia, Jobs and Skills Australia
- United Kingdom, the Immigration Salary List on GOV.UK
- Germany, Make it in Germany (the federal skilled-worker portal)
- Ireland, the Critical Skills and shortage lists from the Department of
  Enterprise
- Netherlands, UWV (the national employee-insurance and labour agency)
- Singapore, the Ministry of Manpower

Pay comes from two places I could hold up against each other, LinkedIn's salary
data and Glassdoor, each queried for that exact field in that exact country. The
figure you see is nominal total compensation, base plus the usual bonus and
equity uplift for the field, converted to dollars. I went with nominal rather
than purchasing-power-adjusted on purpose: nominal is the hard currency a
student actually banks or sends home.

The fourth source is a live Reuters search on that country's immigration and
work-rights news, so the chip always points at the latest coverage instead of a
story that ages badly.

Two things I want to be upfront about. The visa length, the PR timeline and the
post-study work window are the same for a given country across all eight
degrees, because those rules do not care what you studied; only demand and
salary shift by degree. And the ROI axis is deliberately narrow. It measures
early-career cost efficiency, nothing more, not prestige, not research strength,
not the long-run earning ceiling, which is exactly where somewhere like the
United States pulls ahead. I repeat that caveat inside the app so a low ROI
number never gets misread as "not worth it."

## Student life

Nine factors, each scored 0 to 100 on an absolute scale rather than ranked
against the other seven countries. That choice matters: if I had ranked them,
one factor could quietly dominate the weighted total. Where a respected index
already publishes a 0-to-100 number I used it as-is; where it did not, I
transformed a published figure with one fixed formula and wrote that formula
down.

Factor by factor, the anchor:

- **Affordability**, the Numbeo Cost of Living Index, flipped (100 minus the
  index) so that cheaper places score higher.
- **Safety**, Numbeo's Safety Index, as published.
- **Openness**, MIPEX, the Migrant Integration Policy Index (2025 where it
  exists, 2020 otherwise), which grades how welcoming a country's policies
  actually are on paper.
- **Work rights**, a rubric I built from each country's official rules on how
  many hours a student may work during term and after graduating. The anchor
  source here is the immigration authority itself (USCIS, GOV.UK, IRCC, Home
  Affairs, and so on), not a global index, because this is judgement applied to
  primary rules.
- **Healthcare**, Numbeo's Health Care Index.
- **Language**, native-English countries sit near the top; everyone else is
  placed by their band in the EF English Proficiency Index, with Ethnologue for
  the underlying language mix.
- **Community**, how large the international-student population is relative to
  the size of the country, built from IIE Open Doors, HESA, Nuffic, ICEF
  Monitor and the national education departments.
- **Political climate**, the Gallup Migrant Acceptance Index rescaled to 0-100.
  Most values are the 2016-17 wave published in the World Happiness Report's
  2018 annex; the United Kingdom and Germany use Gallup's 2023 update.
- **Climate**, Numbeo's Climate Index, with each country's national weather
  service (Met Office, Environment Canada, the Bureau of Meteorology, DWD, Met
  Eireann, KNMI, and the rest) for reference.

Every factor row also carries two news links, so you can read current context
instead of just taking my number on faith. They are fixed per factor and reused
across countries: affordability pairs Reuters with Bloomberg; safety and
healthcare pair Reuters with the BBC; openness pairs Reuters with the Guardian;
work rights and community pair The PIE News with ICEF Monitor; political climate
pairs Reuters with AP. Language and climate use stable reference pages (the
relevant Wikipedia article and the national met service) rather than a search.
The live search links are a deliberate trade: they surface the newest coverage,
but a search URL cannot be machine-verified the way a fixed page can, so I test
those by hand.

For the record, the political-climate scores landed at Canada 90, Australia 89,
United States 87, Ireland 86, Netherlands 83 (all Gallup 2016-17), United
Kingdom 80 and Germany 71 (Gallup 2023). Singapore came out at 61, and that one
is my own estimate, because Singapore sits outside every published Gallup table.
It is the single number in this whole app I am least sure of, and I would rather
say that plainly than dress it up. Anything resting on Numbeo (affordability,
safety, healthcare, climate) is crowd-sourced, so I treat it as solid-but-soft
rather than gospel.

## True cost

The real first-year bill, split into tuition, living, insurance, one-time visa
fees, and flights. Mostly government and official-institution pages, per
country:

- **United States**, international undergraduate tuition ranges via US News,
  with the SEVIS and visa fees from ICE and the Department of State.
- **United Kingdom**, British Council study-cost guidance, plus the visa fee and
  the Immigration Health Surcharge on GOV.UK.
- **Canada**, Statistics Canada for tuition and living, IRCC for the study-permit
  fee, and UHIP Ontario for the health-insurance line.
- **Australia**, Study Australia and the Department of Home Affairs for the
  student-visa fee and the financial-capacity figures.
- **Germany**, DAAD for living costs and the near-zero public tuition, and the
  German Missions for the blocked-account and visa detail.
- **Ireland**, Education in Ireland for fees and living, and the Irish
  immigration service for the registration and IRP costs.
- **Netherlands**, Study in NL for tuition and living, with Study.eu as a
  cross-check.
- **Singapore**, the Ministry of Education's Tuition Grant terms and ICA for the
  pass fees.

The "what families miss" notes under each country (the German blocked account,
the Canadian GIC, the rental bonds, Singapore's tuition-grant bond, the UK
health surcharge) come out of those same official pages. Nothing there is
invented for effect.

## The pathway timelines

Study, then post-study visa, then permanent residency, then citizenship, drawn
to scale. Every stage length is taken straight from the immigration authority:

- United States, USCIS (and the OPT rules for the post-study window)
- United Kingdom, the Graduate Route and settlement rules on GOV.UK
- Canada, IRCC
- Australia, the Department of Home Affairs
- Germany, Make it in Germany and the settlement rules
- Ireland, the immigration service and gov.ie
- Netherlands, the IND and Business.gov.nl for the orientation year and
  residence rules
- Singapore, ICA

## Beyond the usual eight

The emerging destinations are meant to be lighter, a two-line pitch and a place
to start reading rather than a full comparison. So each card links to that
country's own official "study in" portal, and to The PIE News where there was
useful context. Those portals include Study in Estonia, Study in Taiwan, Study
in Korea, Go Poland, the UAE government portal, Study in Japan (JASSO), Study in
Sweden, Study in Finland, Study in Hong Kong, Campus France, Study in Spain,
swissuniversities, Study in Italy, Study in Denmark, Study in Flanders and Study
in the Czech Republic.

## Keeping myself honest

A handful of things worth saying out loud:

- This is curated, not live. The whole set is dated 18 August 2026 and needs a
  refresh now and then, exchange rates and salaries and visa fees most of all.
- Where I used a crowd-sourced index (Numbeo) or an older survey vintage (the
  2016-17 Gallup wave), I know it is softer than an official statistic, and I
  have not pretended otherwise.
- One figure, Singapore's political climate, is an open estimate, because no
  published table covers it.
- The news chips are live searches, so they move as coverage moves. That is a
  feature, but it also means I cannot freeze them to one verified page.

If you find something off, or you know a better primary source than the one I
reached for, tell me. I would much rather fix it than defend it.
