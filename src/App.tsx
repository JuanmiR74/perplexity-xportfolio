import { useEffect, useMemo, useState } from "react"
import { BarChart3, Briefcase, LineChart, LogOut, PieChart as PieChartIcon, Plus, RefreshCw, Settings, Wallet } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { supabase } from "./lib/supabase"

type TabKey = "resumen" | "fondos" | "roboadvisors" | "xray" | "config"
type PricingStatus = "fresh" | "recent" | "stale" | "unavailable"
type ContractMode = "individual" | "roboadvisor"
type DistMap = Record<string, number>
type Classification = { fundType: DistMap; sector: DistMap; geography: DistMap; sourceDate: string; editedByUser: boolean }
type Pricing = { nav: number | null; currency: string; navDate: string | null; fetchedAt: string | null; source: string; status: PricingStatus; confidence: "high" | "medium" | "low" }
type Holding = { id: string; isin: string; fundName: string; manager: string; entityName: string; contractMode: ContractMode; shares: number; amountInvested: number; classification: Classification; pricing: Pricing }
type Roboadvisor = { id: string; name: string; entityName: string; amountInvestedTotal: number; composition: { isin: string; percent?: number }[] }

type SessionUser = { email: string }

const COLORS = ["#20c997", "#42d6ff", "#7c9cf5", "#f5b942", "#ef6b6b", "#b38cff"]

const sampleHoldings: Holding[] = [
  {
    id: crypto.randomUUID(),
    isin: "IE00BYX5NX33",
    fundName: "Fidelity MSCI World Index Fund",
    manager: "Fidelity",
    entityName: "Openbank",
    contractMode: "individual",
    shares: 125.45,
    amountInvested: 1520,
    classification: {
      fundType: { "RV - Blend": 100 },
      sector: { Tecnología: 24, Financiero: 18, Industria: 14, Salud: 12, Consumo: 12, Otro: 20 },
      geography: { EEUU: 68, Europa: 16, Japón: 6, "Asia-Pacífico": 4, Emergentes: 3, Global: 3 },
      sourceDate: "2026-04-17",
      editedByUser: false,
    },
    pricing: { nav: 12.88, currency: "EUR", navDate: "2026-04-16", fetchedAt: new Date().toISOString(), source: "ft_markets", status: "recent", confidence: "high" },
  },
  {
    id: crypto.randomUUID(),
    isin: "IE0031786696",
    fundName: "Vanguard Emerging Markets Stock Index",
    manager: "Vanguard",
    entityName: "MyInvestor",
    contractMode: "roboadvisor",
    shares: 5.72,
    amountInvested: 1460,
    classification: {
      fundType: { "RV - Large Cap": 70, "RV - Blend": 30 },
      sector: { Tecnología: 21, Financiero: 24, Consumo: 12, Industria: 15, Energía: 8, Otro: 20 },
      geography: { Emergentes: 86, "Asia-Pacífico": 8, Global: 6 },
      sourceDate: "2026-04-17",
      editedByUser: false,
    },
    pricing: { nav: 283.62, currency: "EUR", navDate: "2026-04-16", fetchedAt: new Date().toISOString(), source: "ft_markets", status: "recent", confidence: "high" },
  },
]

const sampleRoboadvisors: Roboadvisor[] = [
  { id: "robo-1", name: "Cartera Indexada 70/30", entityName: "MyInvestor", amountInvestedTotal: 3200, composition: [{ isin: "IE0031786696", percent: 45 }, { isin: "IE00BYX5NX33", percent: 55 }] },
]

const statusLabel: Record<PricingStatus, string> = { fresh: "Hoy", recent: "Ayer", stale: "Desactualizado", unavailable: "Sin precio" }

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(value || 0)
}

function currentValue(h: Holding) { return (h.pricing.nav || 0) * h.shares }
function pnl(h: Holding) { return currentValue(h) - h.amountInvested }
function pnlPct(h: Holding) { return h.amountInvested ? (pnl(h) / h.amountInvested) * 100 : 0 }

function aggregateDimension(holdings: Holding[], key: keyof Classification) {
  const totals: Record<string, number> = {}
  const totalValue = holdings.reduce((s, h) => s + currentValue(h), 0) || 1
  holdings.forEach((h) => {
    const weight = currentValue(h) / totalValue
    const dist = h.classification[key] as DistMap
    Object.entries(dist).forEach(([label, pct]) => {
      totals[label] = (totals[label] || 0) + weight * pct
    })
  })
  return Object.entries(totals).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) })).sort((a, b) => b.value - a.value)
}

function demoPrice(isin: string): Pricing {
  const seed = Array.from(isin).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const nav = Number((((seed % 250) + 10) * 0.87).toFixed(2))
  return { nav, currency: "EUR", navDate: "2026-04-17", fetchedAt: new Date().toISOString(), source: "ft_markets", status: "recent", confidence: "medium" }
}

function KpiCard({ icon, label, value, sub, negative = false }: { icon: React.ReactNode; label: string; value: string; sub: string; negative?: boolean }) {
  return <div className="card kpi"><span>{label}</span><strong className={negative ? "neg" : ""}>{value}</strong><div className="summary-line" style={{ margin: 0 }}><span>{sub}</span><span>{icon}</span></div></div>
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button className={`tab ${active ? "active" : ""}`} onClick={onClick}>{icon} {label}</button>
}

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>("resumen")
  const [holdings, setHoldings] = useState<Holding[]>(sampleHoldings)
  const [roboadvisors] = useState<Roboadvisor[]>(sampleRoboadvisors)
  const [showAdd, setShowAdd] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [authForm, setAuthForm] = useState({ email: "", password: "" })
  const [authError, setAuthError] = useState("")
  const [portfolioName, setPortfolioName] = useState("Cartera Global")

  useEffect(() => {
    async function boot() {
      if (!supabase) {
        setUser({ email: "demo@xportfolio.local" })
        setLoading(false)
        return
      }
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (session?.user?.email) setUser({ email: session.user.email })
      setLoading(false)
    }
    boot()
  }, [])

  const summary = useMemo(() => {
    const invested = holdings.reduce((s, h) => s + h.amountInvested, 0)
    const marketValue = holdings.reduce((s, h) => s + currentValue(h), 0)
    const totalPnl = marketValue - invested
    const profitability = invested ? (totalPnl / invested) * 100 : 0
    return { invested, marketValue, totalPnl, profitability }
  }, [holdings])

  const typeData = useMemo(() => aggregateDimension(holdings, "fundType"), [holdings])
  const sectorData = useMemo(() => aggregateDimension(holdings, "sector"), [holdings])
  const geographyData = useMemo(() => aggregateDimension(holdings, "geography"), [holdings])
  const returnsData = holdings.map((h) => ({ name: h.fundName.split(" ").slice(0, 2).join(" "), rentabilidad: Number(pnlPct(h).toFixed(2)) }))

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthError("")
    if (!supabase) {
      setUser({ email: authForm.email || "demo@xportfolio.local" })
      return
    }
    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword(authForm)
      if (error) setAuthError(error.message)
    } else {
      const { error } = await supabase.auth.signUp(authForm)
      if (error) setAuthError(error.message)
    }
  }

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }

  function addDemoHolding() {
    const isin = `ES${Math.floor(Math.random() * 9999999999).toString().padStart(10, "0")}`
    const holding: Holding = {
      id: crypto.randomUUID(),
      isin,
      fundName: `Fondo ${isin}`,
      manager: "Pendiente",
      entityName: "MyInvestor",
      contractMode: "individual",
      shares: 10,
      amountInvested: 1000,
      classification: { fundType: { "Sin clasificar": 100 }, sector: { "Sin clasificar": 100 }, geography: { "Sin clasificar": 100 }, sourceDate: "2026-04-18", editedByUser: false },
      pricing: demoPrice(isin),
    }
    setHoldings((prev) => [holding, ...prev])
    setShowAdd(false)
  }

  function refreshPrice(id: string) {
    setHoldings((prev) => prev.map((h) => h.id === id ? { ...h, pricing: { ...h.pricing, nav: Number(((h.pricing.nav || 10) * (1 + ((Math.random() - 0.5) * 0.02))).toFixed(2)), fetchedAt: new Date().toISOString(), navDate: "2026-04-18", status: "fresh" } } : h))
  }

  if (loading) return <div className="login"><div className="login-card card">Cargando…</div></div>

  if (!user) {
    return <div className="login"><form className="login-card card" onSubmit={handleAuth}><div className="brand" style={{ marginBottom: 20 }}><div className="logo"><LineChart size={20} /></div><div><div style={{ fontSize: 34, fontWeight: 800 }}>XPortfolio</div><div className="muted">Gestión inteligente de fondos y roboadvisors</div></div></div><h1 style={{ margin: "0 0 6px" }}>{authMode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1><div className="field"><label>Email</label><input value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} /></div><div className="field"><label>Contraseña</label><input type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} /></div>{authError && <div className="note">{authError}</div>}<button className="btn primary" style={{ width: "100%", marginTop: 8 }}>{authMode === "login" ? "Iniciar sesión" : "Crear cuenta"}</button><div className="divider" /><button type="button" className="btn" style={{ width: "100%" }} onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>{authMode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}</button></form></div>
  }

  return <div className="app"><header className="topbar"><div className="brand"><div className="logo"><LineChart size={20} /></div><div><div>XPortfolio</div><div className="mini">Seguimiento personal de fondos y roboadvisors</div></div></div><div className="top-actions"><div><div>{user.email}</div><div className="mini">Sesión activa</div></div><button className="btn ghost" onClick={handleLogout}><LogOut size={16} /> Salir</button></div></header><main className="content"><section className="hero"><KpiCard icon={<Wallet size={16} />} label="Total invertido" value={formatCurrency(summary.invested)} sub={`${holdings.length} fondos`} /><KpiCard icon={<Briefcase size={16} />} label="Valor actual" value={formatCurrency(summary.marketValue)} sub={portfolioName} /><KpiCard icon={<BarChart3 size={16} />} label="Ganancia/Pérdida" value={formatCurrency(summary.totalPnl)} sub={`${summary.profitability.toFixed(2)}%`} negative={summary.totalPnl < 0} /><KpiCard icon={<PieChartIcon size={16} />} label="Roboadvisors" value={String(roboadvisors.length)} sub="Seguimiento agregado" /></section><div className="tabs"><TabButton active={tab === "resumen"} onClick={() => setTab("resumen")} icon={<BarChart3 size={16} />} label="Resumen" /><TabButton active={tab === "fondos"} onClick={() => setTab("fondos")} icon={<Briefcase size={16} />} label="Fondos" /><TabButton active={tab === "roboadvisors"} onClick={() => setTab("roboadvisors")} icon={<Wallet size={16} />} label="Robo-Advisors" /><TabButton active={tab === "xray"} onClick={() => setTab("xray")} icon={<PieChartIcon size={16} />} label="X-Ray" /><TabButton active={tab === "config"} onClick={() => setTab("config")} icon={<Settings size={16} />} label="Configuración" /></div>{tab === "resumen" && <div className="grid-2"><section className="card section"><div className="section-head"><h2 className="panel-title">Resumen de cartera</h2><div className="chip">{portfolioName}</div></div><div className="summary-line"><span>Total aportado</span><strong>{formatCurrency(summary.invested)}</strong></div><div className="summary-line"><span>Valor actual</span><strong>{formatCurrency(summary.marketValue)}</strong></div><div className="summary-line"><span>Rentabilidad total</span><strong className={summary.profitability >= 0 ? "pos" : "neg"}>{summary.profitability.toFixed(2)}%</strong></div><div className="summary-line"><span>Fondos individuales</span><strong>{holdings.filter((h) => h.contractMode === "individual").length}</strong></div><div className="summary-line"><span>Fondos vía roboadvisor</span><strong>{holdings.filter((h) => h.contractMode === "roboadvisor").length}</strong></div></section><section className="card section"><h2 className="panel-title">Rentabilidad por fondo</h2><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={returnsData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" /><XAxis dataKey="name" stroke="#9aa4b2" /><YAxis stroke="#9aa4b2" /><Tooltip /><Bar dataKey="rentabilidad">{returnsData.map((entry, index) => <Cell key={index} fill={entry.rentabilidad >= 0 ? "#20c997" : "#ef6b6b"} />)}</Bar></BarChart></ResponsiveContainer></div></section></div>}{tab === "fondos" && <section className="card section"><div className="section-head"><div><h2 className="panel-title">Fondos</h2><div className="mini">Control básico con precios demo y rentabilidad.</div></div><div className="actions"><button className="btn" onClick={() => holdings.forEach((h) => refreshPrice(h.id))}><RefreshCw size={16} /> Refrescar todo</button><button className="btn primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Añadir fondo</button></div></div><div className="table-wrap"><table><thead><tr><th>Fondo / ISIN</th><th>Gestora</th><th>Entidad</th><th>Modalidad</th><th>Aportado</th><th>Participaciones</th><th>Precio act.</th><th>Valor act.</th><th>Rentabilidad</th><th>Estado</th><th></th></tr></thead><tbody>{holdings.map((holding) => <tr key={holding.id}><td><div style={{ fontWeight: 700 }}>{holding.fundName}</div><div className="mini">{holding.isin}</div></td><td>{holding.manager}</td><td>{holding.entityName}</td><td><span className="chip">{holding.contractMode}</span></td><td>{formatCurrency(holding.amountInvested)}</td><td>{holding.shares.toFixed(4)}</td><td>{holding.pricing.nav ? formatCurrency(holding.pricing.nav) : "—"}</td><td>{formatCurrency(currentValue(holding))}</td><td><div className={pnl(holding) >= 0 ? "pos" : "neg"}>{formatCurrency(pnl(holding))}</div><div className={pnlPct(holding) >= 0 ? "mini pos" : "mini neg"}>{pnlPct(holding).toFixed(2)}%</div></td><td><span className="status">{statusLabel[holding.pricing.status]}</span></td><td><button className="icon-btn" onClick={() => refreshPrice(holding.id)}><RefreshCw size={16} /></button></td></tr>)}</tbody></table></div></section>}{tab === "roboadvisors" && <section className="card section"><div className="section-head"><h2 className="panel-title">Roboadvisors</h2></div><div className="table-wrap"><table style={{ minWidth: 900 }}><thead><tr><th>Nombre</th><th>Entidad</th><th>Aportado</th><th>Composición</th></tr></thead><tbody>{roboadvisors.map((robo) => <tr key={robo.id}><td>{robo.name}</td><td>{robo.entityName}</td><td>{formatCurrency(robo.amountInvestedTotal)}</td><td>{robo.composition.map((item) => <span key={item.isin} className="chip" style={{ marginRight: 8 }}>{item.isin} · {item.percent ?? 0}%</span>)}</td></tr>)}</tbody></table></div></section>}{tab === "xray" && <div className="xray-grid"><section className="card section"><h2 className="panel-title">Tipo de fondo</h2><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={typeData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={54}>{typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></section><section className="card section"><h2 className="panel-title">Sector</h2><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sectorData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={54}>{sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></section><section className="card section"><h2 className="panel-title">Geografía</h2><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={geographyData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={54}>{geographyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></section><section className="card section" style={{ gridColumn: "span 3" }}><h2 className="panel-title">Rentabilidad relativa</h2><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={returnsData}><defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20c997" stopOpacity={0.6} /><stop offset="100%" stopColor="#20c997" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" /><XAxis dataKey="name" stroke="#9aa4b2" /><YAxis stroke="#9aa4b2" /><Tooltip /><Area type="monotone" dataKey="rentabilidad" stroke="#20c997" fill="url(#grad)" /></AreaChart></ResponsiveContainer></div></section></div>}{tab === "config" && <section className="card section"><h2 className="panel-title">Configuración</h2><div className="field"><label>Nombre visible de la cartera</label><input value={portfolioName} onChange={(e) => setPortfolioName(e.target.value)} /></div><div className="note">Configura las variables de entorno en Vercel para usar Supabase en producción.</div></section>}</main>{showAdd && <div className="modal-backdrop"><div className="modal"><div className="section-head"><h2 className="panel-title">Añadir fondo demo</h2><button className="btn" onClick={() => setShowAdd(false)}>Cerrar</button></div><div className="note">Esta acción inserta un fondo de ejemplo para validar la interfaz.</div><div className="actions-row"><button className="btn" onClick={() => setShowAdd(false)}>Cancelar</button><button className="btn primary" onClick={addDemoHolding}>Crear fondo</button></div></div></div>}</div>
}
