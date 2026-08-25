import { Link } from 'react-router-dom'

export function About() {
  return (
    <div className="relative overflow-hidden">
      {/* Cartographic hero: aurora wash + survey grid, like a chart margin. */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 hero-aurora" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 survey-grid" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-3xl px-4 pb-10 pt-14 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ultramarine">About</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient">Why Vantage exists</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">
            Vantage <span className="italic">(n.)</span>: a position from which you can see the whole
            field. This is the tool I wish my family had when the decision was ours to make.
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
        {/* The project */}
        <section className="mt-6">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full accent-rule" aria-hidden="true" />
            <h2 className="font-display text-2xl font-semibold tracking-tight">The project</h2>
          </div>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate">
            <p>
              Every year, thousands of students and their families make one of the biggest decisions
              of their lives, where in the world to go and study, using some of the thinnest
              information available to them. A league table that measures research output they will
              never touch. A glossy brochure. An agent who earns a commission on the{' '}
              <span className="italic">yes</span>. Somewhere in that noise, the questions that actually
              decide how the next ten years go quietly get lost.
            </p>
            <p>
              Can I legally work after I graduate? How long can I stay? What does this really cost once
              you count the rent, the insurance, the flights home, the deposit nobody warned you about?
              Is this a place I can build a life, or just earn a degree and leave?
            </p>
            <p>
              I built Vantage because I could not find a single place that answered those questions
              honestly, side by side, for the one degree a person actually cares about. It does not
              rank countries. It does not tell you where to go. It lays out the map: the career and
              visa landscape, the true cost, the years to permanent residency, how daily life scores on
              the things <span className="italic">you</span> personally weight. And it shows its work.
              Every number links back to an official source. Every formula is public. You decide. That
              is the whole point.
            </p>
          </div>
        </section>

        {/* The builder */}
        <section className="mt-12">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full accent-rule" aria-hidden="true" />
            <h2 className="font-display text-2xl font-semibold tracking-tight">The builder</h2>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[176px_1fr] sm:gap-8">
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
                Hi, I am Ranveer, and I designed and built Vantage.
              </p>
              <p>
                I am at exactly the age where this decision lands: on me, on my friends, on families I
                know. And I watched too many of them navigate it half-blind, trusting whoever spoke
                with the most confidence in the room. That bothered me enough to do something about it.
              </p>
              <p>
                So I obsessed over this thing: every data point chased until it linked to a real,
                official source, every screen rebuilt until it was clear enough to hand to a parent.
                I refused to let it turn into one more ranking site telling people what to think. I care
                about this because it is personal, and because getting it right for even one family
                makes every late night worth it.
              </p>
              <p>
                If you spot something wrong, know a better source, or just want to talk about where you
                are headed,{' '}
                <a
                  href="mailto:ranveerchainani1@gmail.com"
                  className="font-medium text-ultramarine underline underline-offset-2"
                >
                  reach out
                </a>
                . I read everything.
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
