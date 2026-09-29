import { Link } from 'react-router-dom'
import { BackToHome } from '../components/shared/BackToHome'

export function About() {
  return (
    <div className="relative overflow-hidden">
      {/* Cartographic hero: aurora wash + survey grid, like a chart margin. */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 hero-aurora" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 survey-grid" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-3xl px-4 pb-10 pt-10 sm:px-6">
          <BackToHome className="mb-8" />
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ultramarine">About</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient">Why Vantage exists</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">
            Vantage <span className="italic">(n.)</span>: a position from which you can see the whole
            field.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate">
            <span>8 countries</span>
            <span className="text-hairline" aria-hidden="true">/</span>
            <span>1 degree at a time</span>
            <span className="text-hairline" aria-hidden="true">/</span>
            <span>0 rankings</span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        {/* Founder's note */}
        <section className="mt-6">
          <div className="grid gap-6 sm:grid-cols-[176px_1fr] sm:gap-8">
            <figure className="relative mx-auto w-44 sm:mx-0 sm:w-full">
              {/* Gold sightline corner ticks — the founder as the plotted point. */}
              <span
                className="absolute -left-2 -top-2 h-5 w-5 rounded-tl-[3px] border-l-2 border-t-2 border-gold"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-2 -right-2 h-5 w-5 rounded-br-[3px] border-b-2 border-r-2 border-gold"
                aria-hidden="true"
              />
              <div className="overflow-hidden rounded-card border border-hairline shadow-soft">
                <img
                  src="/founder.jpg"
                  alt="Ranveer Chainani, founder of Vantage"
                  className="aspect-[4/5] w-full object-cover"
                  width={176}
                  height={220}
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-center">
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
                  Ranveer Chainani
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
                  Founder
                </span>
              </figcaption>
            </figure>

            <div className="space-y-4 text-[15px] leading-relaxed text-slate">
              <p>
                I&rsquo;m Ranveer Chainani, a Grade 12 IB student at Cathedral and John Connon School in
                Mumbai. I built Vantage after watching families around me, my own included, try to
                navigate one of the most consequential decisions of their lives without the information
                they actually needed.
              </p>
              <p>
                Vantage is my attempt to fix that. It doesn&rsquo;t rank colleges and it doesn&rsquo;t
                tell anyone where to go. It compares countries for a specific degree on the factors
                families most often miss, and shows its methodology openly so people can decide for
                themselves. Over the past four months, I&rsquo;ve researched and chased every data point
                that went into it, and designed and coded the app from scratch, all with one goal: to
                make this the tool I wish my own family had.
              </p>
              <p>
                If you have feedback, a correction, or want to talk about the project, I&rsquo;d love to
                hear from you at{' '}
                <a
                  href="mailto:ranveerchainani1@gmail.com"
                  className="font-medium text-ultramarine underline underline-offset-2"
                >
                  ranveerchainani1@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Advisor */}
        <section className="mt-10 border-t border-hairline pt-10">
          <div className="grid gap-6 sm:grid-cols-[176px_1fr] sm:gap-8">
            <figure className="relative mx-auto w-44 sm:mx-0 sm:w-full">
              {/* Gold sightline corner ticks, matching the founder's plotted point. */}
              <span
                className="absolute -left-2 -top-2 h-5 w-5 rounded-tl-[3px] border-l-2 border-t-2 border-gold"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-2 -right-2 h-5 w-5 rounded-br-[3px] border-b-2 border-r-2 border-gold"
                aria-hidden="true"
              />
              <div className="overflow-hidden rounded-card border border-hairline shadow-soft">
                <img
                  src="/sonal.jpg"
                  alt="Sonal Chinchwadkar, advisor to Vantage"
                  className="aspect-[4/5] w-full object-cover"
                  width={176}
                  height={220}
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-center">
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
                  Sonal Chinchwadkar
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
                  Advisor
                </span>
              </figcaption>
            </figure>

            <div className="space-y-4 text-[15px] leading-relaxed text-slate">
              <p>
                Sonal is an accomplished leader with over 15 years of experience driving knowledge
                management, executive education, and digital learning transformations at premier
                organizations including the World Bank, IFC, KPMG, Accenture Consulting, and Tata group
                companies.
              </p>
              <p>
                She excels at building high-impact programs, managing global partner ecosystems, and
                accelerating technology-led training adoption across markets in Europe, MENA, and Asia.
              </p>
              <p>
                Notably, she led one of Asia&rsquo;s largest university digital transitions and has
                delivered exceptional results across multilateral as well as corporate sectors. Her
                comprehensive expertise spans leading learning strategies, curriculum development,
                capacity building, and creating scalable L&amp;D service portfolios that align with
                organizational vision towards change management and productivity enhancement.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology pointer */}
        <div className="mt-12 rounded-card border border-hairline bg-white/70 p-5">
          <p className="text-sm leading-relaxed text-slate">
            Every formula, weight, normalisation, and source behind these screens is public, with no
            black boxes.{' '}
            <Link to="/methodology" className="font-medium text-ultramarine underline underline-offset-2">
              Read the methodology
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
