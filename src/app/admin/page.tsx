"use client";

import { useEffect, useState } from "react";

type Project = { id: number; category: string; title: string; description: string; tech: string; published: boolean };
type Service = { id: number; number: string; title: string; description: string; active: boolean };
type Skill = { id: number; name: string; level: number };
type Message = { id: number; name: string; email: string; message: string; read: boolean; createdAt: string };
type Quote = { id: number; fullName: string; email: string; projectType: string; status: string; createdAt: string; description: string };
type Stats = { projects: number; publishedProjects: number; messages: number; unreadMessages: number; quotes: number; newQuotes: number; visits: number };

const TABS = ["dashboard", "projects", "services", "skills", "messages", "quotes", "settings"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [projForm, setProjForm] = useState({ category: "", title: "", description: "", tech: "", published: true });
  const [svcForm, setSvcForm] = useState({ number: "", title: "", description: "", active: true });
  const [skillForm, setSkillForm] = useState({ name: "", level: 80 });
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  async function loadAll() {
    const [p, s, sk, m, q, st, set] = await Promise.all([
      fetch("/api/admin/projects").then((r) => r.json()).catch(() => []),
      fetch("/api/services").then((r) => r.json()).catch(() => []),
      fetch("/api/skills").then((r) => r.json()).catch(() => []),
      fetch("/api/admin/messages").then((r) => r.json()).catch(() => []),
      fetch("/api/quotes").then((r) => r.json()).catch(() => []),
      fetch("/api/admin/dashboard").then((r) => r.json()).catch(() => null),
      fetch("/api/settings").then((r) => r.json()).catch(() => null),
    ]);
    setProjects(Array.isArray(p) ? p : []);
    setServices(Array.isArray(s) ? s : []);
    setSkills(Array.isArray(sk) ? sk : []);
    setMessages(Array.isArray(m) ? m : []);
    setQuotes(Array.isArray(q) ? q : []);
    setStats(st);
    // settings loaded into form
    setSettingsForm(set || {});
  }

  useEffect(() => {
    let active = true;
    (async () => {
      if (active) await loadAll();
    })();
    return () => { active = false; };
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/login";
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(projForm) });
    if (res.ok) { setProjForm({ category: "", title: "", description: "", tech: "", published: true }); setStatus("Projet ajouté."); loadAll(); }
    else { const d = await res.json().catch(() => ({})); setStatus(d.error || "Erreur."); }
  }

  async function deleteProject(id: number) {
    if (!confirm("Supprimer ce projet ?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(svcForm) });
    if (res.ok) { setSvcForm({ number: "", title: "", description: "", active: true }); setStatus("Service ajouté."); loadAll(); }
    else { const d = await res.json().catch(() => ({})); setStatus(d.error || "Erreur."); }
  }

  async function deleteService(id: number) {
    if (!confirm("Supprimer ce service ?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function createSkill(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(skillForm) });
    if (res.ok) { setSkillForm({ name: "", level: 80 }); setStatus("Compétence ajoutée."); loadAll(); }
    else { const d = await res.json().catch(() => ({})); setStatus(d.error || "Erreur."); }
  }

  async function deleteSkill(id: number) {
    if (!confirm("Supprimer cette compétence ?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function updateQuote(id: number, patch: Record<string, unknown>) {
    await fetch(`/api/quotes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    loadAll();
  }

  async function deleteQuote(id: number) {
    if (!confirm("Supprimer cette demande ?")) return;
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function deleteMessage(id: number) {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function markMessageRead(id: number, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read }) });
    loadAll();
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settingsForm) });
    if (res.ok) { setStatus("Paramètres enregistrés."); loadAll(); }
    else { const d = await res.json().catch(() => ({})); setStatus(d.error || "Erreur."); }
  }

  const inputCls = "w-full rounded-lg border border-white/10 bg-[#09090c] px-4 py-2 text-white outline-none focus:border-accent";

  return (
    <main className="min-h-screen bg-[#080808] px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Administration</h1>
          <button onClick={handleLogout} className="rounded-full border border-white/15 px-5 py-2 text-sm hover:border-accent hover:text-accent">
            Déconnexion
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm ${tab === t ? "bg-accent text-black" : "border border-white/10"}`}>
              {t}
            </button>
          ))}
        </div>

        {status && <p className="mt-4 text-sm text-accent-bright">{status}</p>}

        {tab === "dashboard" && stats && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Projets", value: stats.projects },
              { label: "Projets publiés", value: stats.publishedProjects },
              { label: "Messages", value: stats.messages },
              { label: "Messages non lus", value: stats.unreadMessages },
              { label: "Demandes de devis", value: stats.quotes },
              { label: "Devis nouveaux", value: stats.newQuotes },
              { label: "Visites", value: stats.visits },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-[#101014] p-5">
                <p className="text-3xl font-bold text-accent">{s.value}</p>
                <p className="mt-1 text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "projects" && (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <form onSubmit={createProject} className="rounded-2xl border border-white/10 bg-[#101014] p-6 space-y-3">
              <h2 className="text-xl font-semibold">Nouveau projet</h2>
              <input className={inputCls} placeholder="Catégorie" value={projForm.category} onChange={(e) => setProjForm({ ...projForm, category: e.target.value })} required />
              <input className={inputCls} placeholder="Titre" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} required />
              <textarea className={inputCls} placeholder="Description" value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} required />
              <input className={inputCls} placeholder="Tech" value={projForm.tech} onChange={(e) => setProjForm({ ...projForm, tech: e.target.value })} required />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={projForm.published} onChange={(e) => setProjForm({ ...projForm, published: e.target.checked })} /> Publié</label>
              <button type="submit" className="rounded-full bg-accent px-6 py-2 font-semibold text-black hover:bg-accent-bright">Ajouter</button>
            </form>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-[#101014] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-accent">{p.category}</p>
                      <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{p.description}</p>
                      <p className="mt-2 text-xs text-gray-500">{p.tech} {p.published ? "• publié" : "• brouillon"}</p>
                    </div>
                    <button onClick={() => deleteProject(p.id)} className="text-sm text-red-400 hover:underline">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "services" && (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <form onSubmit={createService} className="rounded-2xl border border-white/10 bg-[#101014] p-6 space-y-3">
              <h2 className="text-xl font-semibold">Nouveau service</h2>
              <input className={inputCls} placeholder="Numéro (01)" value={svcForm.number} onChange={(e) => setSvcForm({ ...svcForm, number: e.target.value })} required />
              <input className={inputCls} placeholder="Titre" value={svcForm.title} onChange={(e) => setSvcForm({ ...svcForm, title: e.target.value })} required />
              <textarea className={inputCls} placeholder="Description" value={svcForm.description} onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })} required />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={svcForm.active} onChange={(e) => setSvcForm({ ...svcForm, active: e.target.checked })} /> Actif</label>
              <button type="submit" className="rounded-full bg-accent px-6 py-2 font-semibold text-black hover:bg-accent-bright">Ajouter</button>
            </form>
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/10 bg-[#101014] p-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-accent">{s.number}</p>
                    <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{s.description}</p>
                    <p className="mt-1 text-xs text-gray-500">{s.active ? "actif" : "inactif"}</p>
                  </div>
                  <button onClick={() => deleteService(s.id)} className="text-sm text-red-400 hover:underline">Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <form onSubmit={createSkill} className="rounded-2xl border border-white/10 bg-[#101014] p-6 space-y-3">
              <h2 className="text-xl font-semibold">Nouvelle compétence</h2>
              <input className={inputCls} placeholder="Nom" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
              <input type="number" className={inputCls} placeholder="Niveau (0-100)" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })} />
              <button type="submit" className="rounded-full bg-accent px-6 py-2 font-semibold text-black hover:bg-accent-bright">Ajouter</button>
            </form>
            <div className="space-y-3">
              {skills.map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/10 bg-[#101014] p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{s.name}</h3>
                    <p className="text-sm text-gray-400">{s.level}%</p>
                  </div>
                  <button onClick={() => deleteSkill(s.id)} className="text-sm text-red-400 hover:underline">Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div className="mt-8 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="rounded-2xl border border-white/10 bg-[#101014] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{m.name} <span className="text-sm text-gray-400">({m.email})</span></p>
                  <p className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <p className="mt-2 text-sm text-gray-300">{m.message}</p>
                <div className="mt-3 flex gap-4 text-sm">
                  <button onClick={() => markMessageRead(m.id, !m.read)} className="text-accent hover:underline">{m.read ? "Marquer non lu" : "Marquer lu"}</button>
                  <button onClick={() => deleteMessage(m.id)} className="text-red-400 hover:underline">Supprimer</button>
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-gray-500">Aucun message.</p>}
          </div>
        )}

        {tab === "quotes" && (
          <div className="mt-8 space-y-3">
            {quotes.map((q) => (
              <div key={q.id} className="rounded-2xl border border-white/10 bg-[#101014] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{q.fullName} <span className="text-sm text-gray-400">({q.email})</span></p>
                  <p className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <p className="mt-1 text-sm text-accent">{q.projectType}</p>
                <p className="mt-2 text-sm text-gray-300">{q.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <select value={q.status} onChange={(e) => updateQuote(q.id, { status: e.target.value })} className="rounded-lg border border-white/10 bg-[#09090c] px-3 py-1 text-white">
                    {["Nouveau", "En cours", "Devis envoyé", "Accepté", "Refusé"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteQuote(q.id)} className="text-red-400 hover:underline">Supprimer</button>
                </div>
              </div>
            ))}
            {quotes.length === 0 && <p className="text-sm text-gray-500">Aucune demande.</p>}
          </div>
        )}

        {tab === "settings" && (
          <form onSubmit={saveSettings} className="mt-8 rounded-2xl border border-white/10 bg-[#101014] p-6 space-y-3 max-w-2xl">
            <h2 className="text-xl font-semibold">Paramètres du site</h2>
            {["name", "person", "title", "tagline", "bio", "email", "whatsapp", "phone", "location", "photoUrl", "cvUrl", "github", "linkedin", "twitter"].map((field) => (
              <input key={field} className={inputCls} placeholder={field} value={settingsForm[field] ?? ""} onChange={(e) => setSettingsForm({ ...settingsForm, [field]: e.target.value })} />
            ))}
            <button type="submit" className="rounded-full bg-accent px-6 py-2 font-semibold text-black hover:bg-accent-bright">Enregistrer</button>
          </form>
        )}
      </div>
    </main>
  );
}
