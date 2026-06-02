import { c as createComponent } from './astro-component_EHeKi8zR.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute, q as Fragment } from './entrypoint_BX4b3bmX.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_e74spj6f.mjs';
import { a as getMarketOutlook } from './outlookService_D4bR2U41.mjs';

const $$Trends = createComponent(async ($$result, $$props, $$slots) => {
  const monthlyTrends = [
    { month: "Jan", jobs: 4500 },
    { month: "Feb", jobs: 5200 },
    { month: "Mar", jobs: 4800 },
    { month: "Apr", jobs: 6100 },
    { month: "May", jobs: 5900 },
    { month: "Jun", jobs: 7200 }
  ];
  const sectorComparison = [
    { sector: "FinTech", growth: 12 },
    { sector: "HealthTech", growth: 8 },
    { sector: "E-commerce", growth: -2 },
    { sector: "SaaS", growth: 15 },
    { sector: "AI/ML", growth: 42 }
  ];
  const marketOutlook = await getMarketOutlook();
  const decliningRoles = marketOutlook.filter((r) => r.status === "Declining" || r.status === "Oversaturated").slice(0, 5);
  const growingRoles = marketOutlook.filter((r) => r.status === "Growing").slice(0, 5);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Current Job Market Trends India 2026 | Hiring Forecast & Analysis", "description": "Stay ahead with the latest job market trends in India for 2026. Analyze hiring velocity, sector growth, and high-demand roles in real-time." }, { "default": async ($$result2) => renderTemplate`
...
 ${maybeRenderHead()}<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"> <div class="p-8 rounded-2xl border border-green-500/10 bg-green-500/[0.02]"> <h3 class="text-xl font-bold text-green-400 mb-6 flex items-center gap-2"> <span class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
High Growth Roles
</h3> <div class="space-y-4"> ${growingRoles.length > 0 ? growingRoles.map((role) => renderTemplate`<a${addAttribute(`/role/${encodeURIComponent(role.role)}`, "href")} class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-green-500/30 transition-all group"> <div> <h4 class="font-bold text-white group-hover:text-green-400 transition-colors">${role.role}</h4> <p class="text-xs text-muted-foreground">${role.job_count} active openings</p> </div> <div class="text-right"> <span class="text-green-400 font-bold">+${role.growth_percentage}%</span> </div> </a>`) : renderTemplate`<p class="text-muted-foreground text-sm italic">Insufficient historical data to calculate growth trajectories.</p>`} </div> </div> <div class="p-8 rounded-2xl border border-orange-500/10 bg-orange-500/[0.02]"> <h3 class="text-xl font-bold text-orange-400 mb-6 flex items-center gap-2"> <span class="h-2 w-2 rounded-full bg-orange-400"></span>
Slowing / Oversaturated
</h3> <div class="space-y-4"> ${decliningRoles.length > 0 ? decliningRoles.map((role) => renderTemplate`<a${addAttribute(`/role/${encodeURIComponent(role.role)}`, "href")} class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all group"> <div> <h4 class="font-bold text-white group-hover:text-orange-400 transition-colors">${role.role}</h4> <p class="text-xs text-muted-foreground">${role.status}</p> </div> <div class="text-right"> <span${addAttribute(`${role.growth_percentage < 0 ? "text-red-400" : "text-orange-400"} font-bold`, "class")}> ${role.growth_percentage}%
</span> </div> </a>`) : renderTemplate`<p class="text-muted-foreground text-sm italic">Insufficient historical data to identify declining trends.</p>`} </div> </div> </div>  <div class="mb-20 p-8 rounded-2xl border border-white/10 bg-card"> <div class="flex items-center justify-between mb-12"> <div> <h2 class="text-xl font-bold text-white mb-1 font-mono uppercase tracking-tight">Hiring Velocity Index</h2> <p class="text-sm text-muted-foreground">Aggregated demand across top 500 tech companies.</p> </div> <div class="text-right"> <span class="text-3xl font-bold text-brand-cyan">+24%</span> <p class="text-[10px] font-mono text-muted-foreground uppercase">Trailing 6 Months</p> </div> </div> <div class="relative h-64 flex items-end gap-2 md:gap-4"> ${monthlyTrends.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`  <div class="absolute inset-0 flex flex-col justify-between pointer-events-none"> ${[1, 2, 3, 4].map((_) => renderTemplate`<div class="w-full h-px bg-white/5"></div>`)} </div> ${monthlyTrends.map((item) => renderTemplate`<div class="flex-1 flex flex-col items-center gap-4 group h-full justify-end"> <div class="relative w-full h-full flex items-end"> <!-- Bar --> <div class="w-full bg-gradient-to-t from-brand-cyan/20 to-brand-cyan rounded-t-sm transition-all duration-700 group-hover:to-white group-hover:shadow-[0_0_20px_rgba(80,227,194,0.3)]"${addAttribute(`height: ${item.value}%`, "style")}></div> <!-- Tooltip --> <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
Index: ${item.value.toFixed(1)} </div> </div> <span class="text-[10px] font-mono text-muted-foreground rotate-45 md:rotate-0 whitespace-nowrap">${item.month}</span> </div>`)}` })}` : renderTemplate`<div class="w-full h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]"> <p class="text-white font-mono text-sm mb-2">Insufficient historical data</p> <p class="text-muted-foreground text-xs text-center px-4">Velocity Index requires at least 2 months of market snapshots to calculate trajectories.</p> </div>`} </div> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12"> <!-- Sector Growth --> <div class="p-8 rounded-2xl border border-white/10 bg-card/50"> <h3 class="text-xl font-bold text-white mb-8">YoY Sector Growth (2026 Forecast)</h3> <div class="space-y-8"> ${sectorComparison.map((sector) => renderTemplate`<div> <div class="flex justify-between items-end mb-2"> <span class="text-sm font-medium text-white">${sector.name}</span> <span${addAttribute(`text-sm font-bold ${sector.growth > 0 ? "text-brand-cyan" : "text-brand-magenta"}`, "class")}> ${sector.growth > 0 ? "+" : ""}${sector.growth}%
</span> </div> <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"> <div${addAttribute(`h-full ${sector.color} transition-all duration-1000`, "class")}${addAttribute(`width: ${Math.abs(sector.growth)}%`, "style")}></div> </div> </div>`)} </div> </div> <!-- Insights Grid --> <div class="grid grid-cols-1 sm:grid-cols-2 gap-6"> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-cyan text-sm font-bold mb-2">The "Agentic" Shift</h4> <p class="text-xs text-muted-foreground leading-relaxed">By Q2 2026, 40% of software roles now require proficiency in AI-agent orchestration rather than just code completion.</p> </div> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-blue text-sm font-bold mb-2">GCC Dominance</h4> <p class="text-xs text-muted-foreground leading-relaxed">Global Capability Centers in Hyderabad and Bengaluru now account for 65% of all new "DeepTech" hires in India.</p> </div> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-amber text-sm font-bold mb-2">Hybrid Norms</h4> <p class="text-xs text-muted-foreground leading-relaxed">The 3-day office week has become the industry standard, with only 12% of tech companies offering full-remote for juniors.</p> </div> <div class="p-6 rounded-xl border border-white/10 bg-white/[0.02]"> <h4 class="text-brand-magenta text-sm font-bold mb-2">Retention Trends</h4> <p class="text-xs text-muted-foreground leading-relaxed">Average tenure in startups has increased from 14 months (2022) to 26 months (2026) due to market stability.</p> </div> </div> </div> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
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
