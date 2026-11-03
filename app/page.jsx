import Image from "next/image";
import Nav from "@/components/Nav";
import Terminal from "@/components/Terminal";
import ParticleField from "@/components/ParticleField";
import HeroObject from "@/components/HeroObject";
import { Reveal, Tilt, Magnetic, Spotlight, HeroScroll, ScrollProgress } from "@/components/Effects";
import { profile, services, stack, projects, process, offClock } from "./data";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Spotlight />
      <Nav />
      <main id="top" className="overflow-x-hidden">
        <Hero />
        <Services />
        <Work />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function SectionLabel({ index, children }) {
  return (
    <Reveal>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blood">
        {index} <span className="text-muted">//</span> {children}
      </p>
    </Reveal>
  );
}

function Heading({ children, className = "" }) {
  return (
    <Reveal variant="mask">
      <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${className}`}>{children}</h2>
    </Reveal>
  );
}

function Hero() {
  return (
    <section className="letterbox relative min-h-svh px-4 pt-32 pb-24 sm:px-6 md:pt-40 md:pb-32">
      <ParticleField />
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-maroon/50 blur-[120px]" />

      <HeroScroll className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Reveal delay={600}>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3 py-1 font-mono text-xs text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blood" />
              Available for freelance work
            </p>
          </Reveal>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <Reveal as="span" variant="mask" delay={800} className="block">
              I build websites
            </Reveal>
            <Reveal as="span" variant="mask" delay={950} className="block">
              that work <span className="glow text-blood">as good</span>
            </Reveal>
            <Reveal as="span" variant="mask" delay={1100} className="block">
              as they look.
            </Reveal>
          </h1>
          <Reveal delay={1300}>
            <p className="mt-6 max-w-xl text-lg text-muted">
              I&apos;m <span className="text-bone">{profile.name}</span>, a {profile.role.toLowerCase()} helping
              businesses establish a strong, professional presence online.
            </p>
          </Reveal>
          <Reveal delay={1450}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <a
                  href="#contact"
                  className="inline-block rounded bg-blood px-6 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-white shadow-[0_0_30px_-5px_rgb(225_29_46/0.7)] transition hover:bg-maroon"
                >
                  Start a project
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#work"
                  className="inline-block rounded border border-line bg-ink/60 px-6 py-3 font-mono text-sm uppercase tracking-widest text-bone transition hover:border-blood"
                >
                  View work →
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
        <Reveal delay={1000} className="relative">
          <HeroObject />
          <Tilt className="rounded-lg">
            <Terminal />
          </Tilt>
        </Reveal>
      </HeroScroll>

      <a
        href="#services"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:flex"
      >
        scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-blood to-transparent" />
      </a>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 border-t border-line bg-ink px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="01">Services</SectionLabel>
        <Heading className="max-w-2xl">Design and development, handled by one person from start to finish.</Heading>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 150}>
              <Tilt className="h-full rounded-lg">
                <article className="h-full rounded-lg border border-line bg-panel p-8 transition hover:border-blood/60">
                  <span className="font-mono text-sm text-blood">[{s.tag}]</span>
                  <h3 className="mt-4 text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                  <ul className="mt-6 space-y-2 font-mono text-sm">
                    {s.points.map((p) => (
                      <li key={p} className="text-bone/90">
                        <span className="text-blood">→</span> {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
          {stack.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} className="bg-ink">
              <div className="group h-full p-6 transition-colors hover:bg-panel">
                <p className="font-mono text-sm font-semibold text-bone transition-colors group-hover:text-blood">
                  {t.name}
                </p>
                <p className="mt-1 text-sm text-muted">{t.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="relative scroll-mt-20 border-t border-line bg-ink px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="02">Selected work</SectionLabel>
        <Heading>Recent projects</Heading>

        <div className="mt-14 space-y-8">
          {projects.map((p) => (
            <Reveal key={p.title}>
              <article className="grid overflow-hidden rounded-lg border border-line bg-panel lg:grid-cols-[1.2fr_1fr]">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block border-b border-line bg-ink p-6 lg:border-r lg:border-b-0"
                  aria-label={`Visit ${p.title}`}
                >
                  <Tilt max={8} className="rounded-md">
                    <BrowserMock domain={p.domain} title={p.title} image={p.image} />
                  </Tilt>
                </a>
                <div className="flex flex-col justify-center p-8">
                  <p className="font-mono text-xs uppercase tracking-widest text-blood">{p.type}</p>
                  <h3 className="mt-3 text-2xl font-semibold">{p.title}</h3>
                  <p className="mt-3 text-muted">{p.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded border border-line px-2.5 py-1 font-mono text-xs text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex w-fit items-center gap-2 font-mono text-sm text-bone underline decoration-blood underline-offset-4 hover:text-blood"
                  >
                    Visit live site ↗
                  </a>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <a
              href="#contact"
              className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line p-12 text-center transition hover:border-blood/60"
            >
              <span className="font-mono text-sm text-blood">$ ./new-project</span>
              <p className="mt-3 text-xl font-semibold">Your project could be next.</p>
              <p className="mt-2 text-muted">Let&apos;s talk about what you need.</p>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BrowserMock({ domain, title, image }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-panel transition duration-300 group-hover:border-blood/60">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-blood" />
        <span className="h-2.5 w-2.5 rounded-full bg-maroon" />
        <span className="h-2.5 w-2.5 rounded-full bg-wine" />
        <span className="ml-2 truncate rounded bg-ink px-3 py-0.5 font-mono text-[11px] text-muted">{domain}</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-panel">
        <Image
          src={image}
          alt={`Screenshot of the ${title} website`}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover object-top transition duration-700 ease-out group-hover:scale-105"
        />
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="relative scroll-mt-20 border-t border-line bg-ink px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[320px_1fr]">
        <div>
          <SectionLabel index="03">About</SectionLabel>
          {/* Placeholder avatar — swap for a photo in /public when ready */}
          <Reveal>
            <Tilt max={10} className="aspect-square w-full max-w-[320px] rounded-lg">
              <div className="relative h-full w-full overflow-hidden rounded-lg border border-line bg-panel">
                <div className="grid-bg absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/40 to-transparent" />
                <span className="glow absolute inset-0 flex items-center justify-center font-mono text-7xl font-bold text-blood">
                  {profile.initials}
                </span>
              </div>
            </Tilt>
          </Reveal>
        </div>

        <div className="lg:pt-10">
          <Heading>Calm under deadlines. Curious about every detail.</Heading>
          <Reveal delay={150}>
            <div className="mt-6 space-y-4 text-lg text-muted">
              <p>
                I&apos;m a freelance web developer and UI/UX designer who works with React, Next.js and Tailwind
                CSS. I approach every project with focus and a commitment to quality, from the first sketch to the
                final deployment.
              </p>
              <p>
                I believe a good website should be clear, fast and easy to use. I communicate openly, keep clients
                updated throughout the process, and take ownership of the result.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-muted">Off the clock</p>
          </Reveal>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {offClock.map((o, i) => (
              <Reveal key={o.label} delay={250 + i * 120}>
                <Tilt className="h-full rounded-lg">
                  <div className="h-full rounded-lg border border-line bg-panel p-5">
                    <p className="font-mono text-sm font-semibold text-blood">{o.label}</p>
                    <p className="mt-2 text-sm text-muted">{o.detail}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="relative border-t border-line bg-ink px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="04">Process</SectionLabel>
        <Heading>How we&apos;ll work together</Heading>
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal as="li" key={p.step} delay={i * 150}>
              <div className="border-t-2 border-line pt-6 transition hover:border-blood">
                <span className="font-mono text-xs text-blood">
                  0{i + 1} / {p.step}()
                </span>
                <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-line bg-ink px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 translate-y-1/2 rounded-full bg-maroon/50 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <SectionLabel index="05">Contact</SectionLabel>
        <Reveal variant="mask">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Have a project in mind<span className="text-blood">?</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Tell me about your business and what you need. I&apos;ll get back to you with next steps.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-10">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${profile.email}`}
                className="inline-block break-all rounded bg-blood px-6 py-4 font-mono text-sm font-semibold text-white shadow-[0_0_40px_-5px_rgb(225_29_46/0.7)] transition hover:bg-maroon sm:text-base"
              >
                {profile.email}
              </a>
            </Magnetic>
          </div>
          <div className="mt-8">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-muted transition hover:text-bone"
            >
              github.com/{profile.githubHandle} ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-ink px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 font-mono text-xs text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          <span className="text-blood">$</span> built with next.js + tailwind
        </p>
      </div>
    </footer>
  );
}
