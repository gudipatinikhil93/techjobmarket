import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute, q as Fragment } from './entrypoint_Biu5Z-66.mjs';
import { $ as $$Layout, a as $$Navbar, b as $$Footer } from './Footer_GNxZ3h1o.mjs';
import { i as getHiringTrends } from './jobService_B0NW5vDw.mjs';
import { a as getMarketOutlook } from './outlookService_D4bR2U41.mjs';

const $$Trends = createComponent(async ($$result, $$props, $$slots) => {
  const realMonthlyTrends = await getHiringTrends();
  const monthlyTrendsData = realMonthlyTrends.length > 0 ? realMonthlyTrends : [
    { month: "Jan", value: 4500 },
    { month: "Feb", value: 5200 },
    { month: "Mar", value: 4800 },
    { month: "Apr", value: 6100 },
    { month: "May", value: 5900 },
    { month: "Jun", value: 7200 }
  ];
  const maxJobs = Math.max(...monthlyTrendsData.map((d) => "value" in d ? d.value : d.jobs));
  const monthlyTrends = monthlyTrendsData.map((d) => {
    const val = "value" in d ? d.value : d.jobs;
    return {
      ...d,
      height: val / maxJobs * 100
    };
  });
  const sectorComparison = [
    { sector: "Generative AI", growth: 42, name: "Generative AI", color: "bg-brand-cyan" },
    { sector: "Cybersecurity", growth: 15, name: "Cybersecurity", color: "bg-brand-blue" },
    { sector: "Cloud Infra", growth: 12, name: "Cloud Infra", color: "bg-brand-cyan" },
    { sector: "E-commerce", growth: -2, name: "E-commerce", color: "bg-brand-magenta" },
    { sector: "Web3 / Crypto", growth: 8, name: "Web3 / Crypto", color: "bg-brand-blue" }
  ];
  const marketOutlook = await getMarketOutlook();
  const decliningRoles = marketOutlook.filter((r) => r.status === "Declining" || r.status === "Oversaturated").slice(0, 5);
  const growingRoles = marketOutlook.filter((r) => r.status === "Growing").slice(0, 5);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Current US Tech Job Market Trends 2026 | Hiring Forecast & Analysis", "description": "Stay ahead with the latest job market trends in the US for 2026. Analyze hiring velocity, sector growth, and high-demand roles in real-time." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="mb-16"> <h1 class="text-4xl font-bold text-white mb-4">Market Trends & Trajectories</h1> <p class="text-muted-foreground text-lg max-w-2xl">Predictive intelligence on sector growth, declining roles, and macro-economic shifts in the US tech market.</p> </div> <!-- Role Outlook Summary --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"> <div class="p-8 rounded-2xl border border-green-500/10 bg-green-500/[0.02]"> <h3 class="text-xl font-bold text-green-400 mb-6 flex items-center gap-2"> <span class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
High Growth Roles
</h3> <div class="space-y-4"> ${growingRoles.length > 0 ? growingRoles.map((role) => renderTemplate`<a${addAttribute(`/role/${encodeURIComponent(role.role)}`, "href")} class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-green-500/30 transition-all group"> <div> <h4 class="font-bold text-white group-hover:text-green-400 transition-colors">${role.role}</h4> <p class="text-xs text-muted-foreground">${role.job_count} active openings</p> </div> <div class="text-right"> <span class="text-green-400 font-bold">+${role.growth_percentage}%</span> </div> </a>`) : renderTemplate`<p class="text-muted-foreground text-sm italic">Insufficient historical data to calculate growth trajectories. Collecting data...</p>`} </div> </div> <div class="p-8 rounded-2xl border border-orange-500/10 bg-orange-500/[0.02]"> <h3 class="text-xl font-bold text-orange-400 mb-6 flex items-center gap-2"> <span class="h-2 w-2 rounded-full bg-orange-400"></span>
Slowing / Oversaturated
</h3> <div class="space-y-4"> ${decliningRoles.length > 0 ? decliningRoles.map((role) => renderTemplate`<a${addAttribute(`/role/${encodeURIComponent(role.role)}`, "href")} class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all group"> <div> <h4 class="font-bold text-white group-hover:text-orange-400 transition-colors">${role.role}</h4> <p class="text-xs text-muted-foreground">${role.status}</p> </div> <div class="text-right"> <span${addAttribute(`${role.growth_percentage < 0 ? "text-red-400" : "text-orange-400"} font-bold`, "class")}> ${role.growth_percentage}%
</span> </div> </a>`) : renderTemplate`<p class="text-muted-foreground text-sm italic">Insufficient historical data to identify declining trends. Collecting data...</p>`} </div> </div> </div> <!-- Hiring Velocity Chart --> <div class="mb-20 p-8 rounded-2xl border border-white/10 bg-card"> <div class="flex items-center justify-between mb-12"> <div> <h2 class="text-xl font-bold text-white mb-1 font-mono uppercase tracking-tight">Hiring Velocity Index</h2> <p class="text-sm text-muted-foreground">Aggregated demand across top 500 US tech companies.</p> </div> <div class="text-right"> <span class="text-3xl font-bold text-brand-cyan">+24%</span> <p class="text-[10px] font-mono text-muted-foreground uppercase">Trailing 6 Months</p> </div> </div> <div class="relative h-64 flex items-end gap-2 md:gap-4"> ${monthlyTrends.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`  <div class="absolute inset-0 flex flex-col justify-between pointer-events-none"> ${[1, 2, 3, 4].map((_) => renderTemplate`<div class="w-full h-px bg-white/5"></div>`)} </div> ${monthlyTrends.map((item) => renderTemplate`<div class="flex-1 flex flex-col items-center gap-4 group h-full justify-end"> <div class="relative w-full h-full flex items-end"> <!-- Bar --> <div class="w-full bg-gradient-to-t from-brand-cyan/20 to-brand-cyan rounded-t-sm transition-all duration-700 group-hover:to-white group-hover:shadow-[0_0_20px_rgba(80,227,194,0.3)]"${addAttribute(`height: ${item.height}%`, "style")}></div> <!-- Tooltip --> <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
Jobs: ${"value" in item ? item.value : item.jobs} </div> </div> <span class="text-[10px] font-mono text-muted-foreground rotate-45 md:rotate-0 whitespace-nowrap">${item.month}</span> </div>`)}` })}` : renderTemplate`<div class="w-full h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]"> <p class="text-white font-mono text-sm mb-2">Insufficient historical data</p> <p class="text-muted-foreground text-xs text-center px-4">Velocity Index requires at least 2 months of market snapshots to calculate trajectories.</p> </div>`} </div> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12"> <!-- Sector Growth --> <div class="p-8 rounded-2xl border border-white/10 bg-card/50"> <h3 class="text-xl font-bold text-white mb-8">YoY Sector Growth (2026 Forecast)</h3> <div class="space-y-8"> ${sectorComparison.map((sector) => renderTemplate`<div> <div class="flex justify-between items-end mb-2"> <span class="text-sm font-medium text-white">${sector.name}</span> <span${addAttribute(`text-sm font-bold ${sector.growth > 0 ? "text-brand-cyan" : "text-brand-magenta"}`, "class")}> ${sector.growth > 0 ? "+" : ""}${sector.growth}%
</span> </div> <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"> <div${addAttribute(`h-full ${sector.color} transition-all duration-1000`, "class")}${addAttribute(`width: ${Math.abs(sector.growth)}%`, "style")}></div> </div> </div>`)} </div> </div> <!-- Insights Grid --> <div class="grid grid-cols-1 sm:grid-cols-2 gap-6"> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-cyan text-sm font-bold mb-2">The "Agentic" Shift</h4> <p class="text-xs text-muted-foreground leading-relaxed">By Q2 2026, 40% of US software roles require proficiency in AI-agent orchestration rather than just code completion.</p> </div> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-blue text-sm font-bold mb-2">Emerging Tech Hubs</h4> <p class="text-xs text-muted-foreground leading-relaxed">Austin and Denver now account for a significant portion of new "DeepTech" hardware and AI infrastructure hires.</p> </div> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-amber text-sm font-bold mb-2">Hybrid Norms</h4> <p class="text-xs text-muted-foreground leading-relaxed">The 3-day office week has become the industry standard for traditional Fortune 500 tech companies.</p> </div> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-magenta text-sm font-bold mb-2">Retention Trends</h4> <p class="text-xs text-muted-foreground leading-relaxed">Average tenure in startups has increased as professionals seek stability amid market recalibrations.</p> </div> </div> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/trends.astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/trends.astro";
const $$url = "/trends";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Trends,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
