"use client";

import { useState, useEffect } from "react";
import { services } from "@/data/services";
import { skills } from "@/data/skills";
import { projects as staticProjects } from "@/data/projects";
import { siteConfig, hasWhatsApp, whatsappLink } from "@/config/site";
import Reveal from "@/components/Reveal";
import FrancineTechLogo from "@/components/FrancineTechLogo";

type Project = { id?: number; category: string; title: string; description: string; tech: string };

const experiences = [
  { period: "24 nov. 2025 \u2013 27 f\u00e9vr. 2026", title: "D\u00e9veloppeuse Web Full Stack", company: "Innovtech", bullets: ["Conception et int\u00e9gration d'un assistant conversationnel intelligent destin\u00e9 \u00e0 la gestion d'\u00e9v\u00e9nements.", "D\u00e9veloppement d'une plateforme de r\u00e9servation en ligne pour les salons de coiffure et les instituts de beaut\u00e9."] },
  { period: "Mars 2025", title: "D\u00e9veloppeuse Web Front-end", company: "ESM B\u00e9nin", bullets: ["D\u00e9veloppement d'un chatbot intelligent en PHP, connect\u00e9 \u00e0 Telegram, pour automatiser la prise de commandes d'un restaurant gr\u00e2ce \u00e0 l'intelligence artificielle.", "Mise en place de la gestion des menus, des commandes et des interactions avec les clients \u00e0 l'aide du traitement automatique du langage naturel (NLP)."] },
  { period: "Ao\u00fbt 2024", title: "D\u00e9veloppeuse Web Front-end", company: "ESM B\u00e9nin", bullets: ["Conception et d\u00e9veloppement d'une application s\u00e9curis\u00e9e de gestion de stock.", "Cr\u00e9ation d'une interface d'administration permettant les op\u00e9rations CRUD sur les produits.", "D\u00e9veloppement en PHP avec une base de donn\u00e9es MySQL."] },
  { period: "Juillet 2023", title: "D\u00e9veloppeuse Web Front-end", company: "ESM B\u00e9nin", bullets: ["Cr\u00e9ation d'un site e-commerce moderne et responsive avec HTML, CSS et JavaScript.", "Optimisation de l'exp\u00e9rience utilisateur et de l'affichage sur diff\u00e9rents appareils."] },
];

const education = [
  { year: "2025", title: "Licence professionnelle en Gestion et Administration des Entreprises, option Syst\u00e8mes Informatiques et Logiciels", school: "ESM B\u00e9nin" },
  { year: "2023 \u2013 2025", title: "Initiation \u00e0 la programmation web (HTML, CSS, PHP, JavaScript)", school: "Megatech SARL" },
  { year: "2022", title: "Licence en didactique du fran\u00e7ais", school: "Universit\u00e9 d'Abomey-Calavi (FLASH)" },
  { year: "2020", title: "Baccalaur\u00e9at s\u00e9rie D", school: "" },
];

const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${(i * 61) % 100}%`,
  delay: `${(i * 0.3) % 4}s`,
  size: i % 3 === 0 ? 3 : 2,
}));

function iconsForSkill(skill: string): string[] {
  const map: Record<string, string[]> = {
    "HTML & CSS": ["html", "css"],
    JavaScript: ["js"],
    TypeScript: ["ts"],
    React: ["react"],
    "Next.js": ["nextjs"],
    "Tailwind CSS": ["tailwind"],
    PHP: ["php"],
    MySQL: ["mysql"],
    PostgreSQL: ["postgres"],
    "Git & GitHub": ["git", "github"],
    "Cr\u00e9ation de chatbots": ["python"],
  };
  return map[skill] ?? [];
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("");
  const [dbServices, setDbServices] = useState<Array<{ number: string; title: string; description: string }>>([]);
  const [dbSkills, setDbSkills] = useState<string[]>([]);
  const [quoteStatus, setQuoteStatus] = useState("");
  const [quoteForm, setQuoteForm] = useState({ fullName: "", company: "", email: "", phone: "", projectType: "", budget: "", deadline: "", description: "", website: "" });

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {});
    fetch("/api/services").then((r) => r.json()).then((data) => { if (Array.isArray(data) && data.length > 0) setDbServices(data as Array<{ number: string; title: string; description: string }>); }).catch(() => {});
    fetch("/api/skills").then((r) => r.json()).then((data) => { if (Array.isArray(data) && data.length > 0) setDbSkills((data as Array<{ name: string }>).map((s) => s.name)); }).catch(() => {});
    fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "page_view", path: "/" }) }).catch(() => {});
  }, []);


  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactStatus("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactForm({ name: "", email: "", message: "" });
        setContactStatus("Message envoy\u00e9. Merci !");
      } else {
        const data = await res.json().catch(() => ({}));
        setContactStatus(data.error || "Erreur lors de l'envoi.");
      }
    } catch {
      setContactStatus("Erreur r\u00e9seau.");
    }
  }

  async function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuoteStatus("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm),
      });
      if (res.ok) {
        setQuoteForm({ fullName: "", company: "", email: "", phone: "", projectType: "", budget: "", deadline: "", description: "", website: "" });
        setQuoteStatus("Demande envoy\u00e9e. Merci !");
      } else {
        const data = await res.json().catch(() => ({}));
        setQuoteStatus(data.error || "Erreur lors de l'envoi.");
      }
    } catch {
      setQuoteStatus("Erreur r\u00e9seau.");
    }
  }
  const codeLinesArr = [
    '  name: "Fran\u00e7ine",',
    '  brand: "Fran\u00e7ine Tech",',
    '  passion: "Cr\u00e9er",',
    '  focus: "Web & Mobile",',
    '  mindset: "Learn & Build"',
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <a href="#accueil" className="flex items-center" aria-label="Fran\u00e7ine Tech accueil">
            <FrancineTechLogo className="h-12 w-auto md:h-16 transition-all hover:drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
          </a>

          <div className="hidden items-center gap-7 text-sm text-gray-300 md:flex">
            <a href="#apropos" className="hover:text-accent">&Agrave; propos</a>
            <a href="#competences" className="hover:text-accent">Comp&eacute;tences</a>
            <a href="#services" className="hover:text-accent">Services</a>
            <a href="#projets" className="hover:text-accent">Projets</a>
            <a href="#parcours" className="hover:text-accent">Parcours</a>
            <a href="#contact" className="hover:text-accent">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={hasWhatsApp() ? whatsappLink() : "#contact"}
              target={hasWhatsApp() ? "_blank" : undefined}
              rel={hasWhatsApp() ? "noreferrer" : undefined}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:bg-accent-bright hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
            >
              Me contacter &rarr;
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#080808]/95 md:hidden">
            <ul className="flex flex-col gap-1 px-5 py-4">
              {[
                { href: "#apropos", label: "\u00c0 propos" },
                { href: "#competences", label: "Comp\u00e9tences" },
                { href: "#services", label: "Services" },
                { href: "#projets", label: "Projets" },
                { href: "#parcours", label: "Parcours" },
                { href: "#contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-accent">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <section id="accueil" className="relative mx-auto grid max-w-7xl items-center gap-12 overflow-hidden px-5 py-24 md:grid-cols-2 md:py-32 lg:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full bg-accent/40"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animation: `float ${4 + (p.id % 4)}s ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            />
          ))}
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent-bright/10 blur-3xl" />
        </div>

        <div>
          <p className="mb-6 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent-bright">
            &#10022; D&Eacute;VELOPPEUSE WEB &amp; MOBILE
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            <span className="block">FRAN&Ccedil;INE</span>
            <span className="block text-accent">TECH.</span>
          </h1>

          <p className="mt-4 text-2xl font-semibold text-accent-bright md:text-3xl">
            Des id&eacute;es. Du code. Des solutions.
          </p>

          <p className="mt-7 max-w-lg text-lg leading-8 text-gray-400">
            Bonjour, je suis Fran&ccedil;ine HOUMENOU. Je con&ccedil;ois des exp&eacute;riences
            num&eacute;riques modernes et des applications web adapt&eacute;es aux besoins
            de mes clients.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#projets" className="rounded-full bg-accent px-7 py-4 font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">
              D&eacute;couvrir mes projets &rarr;
            </a>
            <a href="#contact" className="rounded-full border border-white/20 px-7 py-4 font-semibold transition hover:border-accent hover:text-accent">
              Parlons de votre projet
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500">Cr&eacute;ativit&eacute; &middot; Technologie &middot; R&eacute;sultats</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-accent/20 blur-3xl" />
          <div className="relative rounded-3xl border border-accent/20 bg-[#121116] p-8 md:p-12">
            <div className="mb-8 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="ml-auto text-xs text-gray-500">developer.tsx</span>
            </div>

            <pre className="overflow-x-auto text-sm leading-8 md:text-base">
              <code>
                <span className="text-accent">const</span>{" "}
                <span className="text-white">developer</span> = {"{"}{"\n"}
                {codeLinesArr.map((line, i) => (
                  <span key={i}>{line}{"\n"}</span>
                ))}
                {"};"}
              </code>
            </pre>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-sm text-gray-400">MON OBJECTIF</p>
              <p className="mt-2 text-xl font-semibold">Transformer vos id&eacute;es en projets concrets.</p>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section id="apropos" className="border-y border-white/10 bg-white/2">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-2 lg:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">&Agrave; propos</p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">La technologie au service des id&eacute;es.</h2>
            </div>
            <p className="leading-8 text-gray-400">
              Je suis d&eacute;veloppeuse web et mobile, fondatrice de Fran&ccedil;ine Tech.
              J&apos;aime concevoir des solutions num&eacute;riques utiles, soigner les
              d&eacute;tails et transformer les besoins d&apos;un projet en interfaces
              accessibles et agr&eacute;ables &agrave; utiliser.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="competences" className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Mon savoir-faire</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Comp&eacute;tences techniques<span className="text-accent">.</span>
          </h2>
          <p className="mt-4 max-w-xl text-gray-400">
            Les technologies que j&apos;utilise selon les besoins de mes projets.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {(dbSkills.length ? dbSkills : skills).map((skill) => (
              <div key={skill} className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/10 hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)]">
                <div className="flex items-center gap-2">
                  {iconsForSkill(skill).map((code) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={code}
                      src={`https://skillicons.dev/icons?i=${code}`}
                      alt={code}
                      width={48}
                      height={48}
                      className="h-12 w-12"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-200">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="services" className="border-y border-white/10 bg-white/2">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Ce que je propose</p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Mes services<span className="text-accent">.</span>
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(dbServices.length ? dbServices : services).map((service) => (
                <article key={service.number} className="group rounded-2xl border border-white/10 bg-[#101014] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_10px_40px_rgba(249,115,22,0.12)]">
                  <p className="text-sm font-semibold text-accent">{service.number}</p>
                  <h3 className="mt-7 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-400">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="projets" className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Portfolio</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Une s&eacute;lection de projets<span className="text-accent">.</span>
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <article key={project.id ?? idx} className="group rounded-2xl border border-white/10 bg-[#101014] p-7 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_15px_50px_rgba(249,115,22,0.15)]">
                <p className="text-xs font-semibold tracking-widest text-accent">{project.category}</p>
                <h3 className="mt-5 text-2xl font-bold">{project.title}</h3>
                <p className="mt-4 min-h-20 leading-7 text-gray-400">{project.description}</p>
                <p className="mt-5 text-sm text-gray-500">{project.tech}</p>
                <a href="#contact" className="mt-7 inline-block font-semibold text-accent transition group-hover:translate-x-1">
                  En savoir plus &rarr;
                </a>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="parcours" className="border-y border-white/10 bg-white/2">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Mon parcours</p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              &Eacute;tapes cl&eacute;s<span className="text-accent">.</span>
            </h2>

            <div className="mt-10 space-y-10">
              <div>
                <h3 className="text-xl font-semibold text-accent">Exp&eacute;riences professionnelles</h3>
                <div className="mt-6 space-y-6">
                  {experiences.map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <span className="h-3 w-3 rounded-full bg-accent animate-pulse-glow" />
                        {idx < experiences.length - 1 && <span className="mt-2 h-full w-px bg-white/10" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-xs font-semibold tracking-widest text-accent">{item.period}</p>
                        <h4 className="mt-1 text-lg font-semibold">{item.title}</h4>
                        <p className="text-sm text-accent-bright">{item.company}</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-400">
                          {item.bullets.map((b, i) => (
                            <li key={i} className="leading-7">&bull; {b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-accent">Parcours acad&eacute;mique</h3>
                <div className="mt-6 space-y-6">
                  {education.map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <span className="h-3 w-3 rounded-full bg-accent animate-pulse-glow" />
                        {idx < education.length - 1 && <span className="mt-2 h-full w-px bg-white/10" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-xs font-semibold tracking-widest text-accent">{item.year}</p>
                        <h4 className="mt-1 text-lg font-semibold">{item.title}</h4>
                        {item.school && <p className="text-sm text-gray-400">{item.school}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="contact" className="px-5 pb-20">
          <div className="mx-auto max-w-5xl rounded-3xl border border-accent/30 bg-linear-to-br from-accent/15 to-[#101014] p-8 text-center md:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Donnons vie &agrave; votre id&eacute;e</p>
            <h2 className="mt-5 text-3xl font-bold md:text-5xl">Vous avez un projet ?</h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
              Parlons de votre besoin et imaginons ensemble une solution num&eacute;rique adapt&eacute;e &agrave; votre activit&eacute;.
            </p>

            {hasWhatsApp() && (
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded-full bg-accent px-8 py-4 font-semibold text-black transition hover:bg-accent-bright hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
              >
                Me contacter sur WhatsApp &rarr;
              </a>
            )}

            <form onSubmit={handleContactSubmit} className="mx-auto mt-8 max-w-xl space-y-3 text-left">
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Votre nom"
                className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent"
              />
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="Votre email"
                className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent"
              />
              <textarea
                required
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Votre message"
                className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent"
              />
              <button type="submit" className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-black transition hover:bg-accent-bright">
                Envoyer le message
              </button>
              {contactStatus && <p className="text-center text-sm text-accent-bright">{contactStatus}</p>}
            </form>

            <form onSubmit={handleQuoteSubmit} className="mx-auto mt-10 max-w-xl space-y-3 text-left">
              <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-accent">Demande de devis</p>
              <input type="text" required value={quoteForm.fullName} onChange={(e) => setQuoteForm({ ...quoteForm, fullName: e.target.value })} placeholder="Nom complet" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <input type="text" value={quoteForm.company} onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })} placeholder="Entreprise (optionnel)" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <input type="email" required value={quoteForm.email} onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })} placeholder="Email" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <input type="text" value={quoteForm.phone} onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })} placeholder="Telephone (optionnel)" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <input type="text" required value={quoteForm.projectType} onChange={(e) => setQuoteForm({ ...quoteForm, projectType: e.target.value })} placeholder="Type de projet" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <input type="text" value={quoteForm.budget} onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })} placeholder="Budget estime (optionnel)" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <input type="text" value={quoteForm.deadline} onChange={(e) => setQuoteForm({ ...quoteForm, deadline: e.target.value })} placeholder="Delai souhaite (optionnel)" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <textarea required rows={4} value={quoteForm.description} onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })} placeholder="Description du besoin" className="w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-3 text-white outline-none focus:border-accent" />
              <input type="text" value={quoteForm.website} onChange={(e) => setQuoteForm({ ...quoteForm, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />
              <button type="submit" className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-black transition hover:bg-accent-bright">
                Envoyer la demande
              </button>
              {quoteStatus && <p className="text-center text-sm text-accent-bright">{quoteStatus}</p>}
            </form>
            {siteConfig.location && (
              <p className="mt-6 text-sm text-gray-500">{siteConfig.location}</p>
            )}
          </div>
        </section>
      </Reveal>

      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Fran&ccedil;ine Tech. Tous droits r&eacute;serv&eacute;s.</p>
          <a href="#accueil" className="transition hover:text-accent">Retour en haut &uarr;</a>
        </div>
      </footer>
    </main>
  );
}
