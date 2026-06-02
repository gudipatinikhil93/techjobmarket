import { c as createComponent } from './astro-component_EHeKi8zR.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_BX4b3bmX.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_e74spj6f.mjs';
import { $ as $$Navbar } from './Navbar_-QOcbVIw.mjs';

const $$Layoffs = createComponent(($$result, $$props, $$slots) => {
  const layoffs = [];
  const totalImpacted = 0;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "India Tech Layoff Tracker 2026 | Workforce Changes", "description": "How bad is the current job market in terms of layoffs? Track workforce changes, company impacts, and market stability in India's tech sector for 2026." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"> <div> <h1 class="text-4xl font-bold text-white mb-4 text-balance">Layoff Tracker</h1> <p class="text-muted-foreground text-lg max-w-xl">Monitoring workforce changes across the Indian tech ecosystem. Data is verified through internal reporting and public filings.</p> </div> <div class="bg-card border border-white/10 p-6 rounded-xl flex gap-8"> <div> <p class="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Total Impacted (2026)</p> <p class="text-3xl font-bold text-white">${totalImpacted.toLocaleString()}</p> </div> <div class="w-px bg-white/10"></div> <div> <p class="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Market State</p> <p class="text-3xl font-bold text-brand-cyan">STABLE</p> </div> </div> </div> ${layoffs.length > 0 ? renderTemplate`<div class="space-y-4"> ${layoffs.map((item) => renderTemplate`<div class="group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-6 rounded-xl border border-white/10 bg-card/50 hover:bg-card hover:border-white/20 transition-all"> <div class="flex-1"> <div class="flex items-center gap-3 mb-1"> <h3 class="text-xl font-bold text-white">${item.company}</h3> <span class="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded font-mono uppercase">${item.sector}</span> </div> <p class="text-sm text-muted-foreground">Primary Reason: <span class="text-white/70">${item.reason}</span></p> </div> <div class="grid grid-cols-3 gap-8 md:gap-16 w-full md:w-auto"> <div> <p class="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Impact</p> <p class="text-lg font-bold text-brand-magenta">${item.impact}</p> </div> <div> <p class="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Employees</p> <p class="text-lg font-bold text-white">${item.count}</p> </div> <div> <p class="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Date</p> <p class="text-lg font-bold text-white/60">${item.date}</p> </div> </div> </div>`)} </div>` : renderTemplate`<div class="p-16 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-center"> <div class="h-20 w-20 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-8"> <svg class="h-10 w-10 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h2 class="text-2xl font-bold text-white mb-4">No major layoffs detected</h2> <p class="text-muted-foreground max-w-lg mx-auto leading-relaxed">
The Indian tech ecosystem currently shows high workforce stability. No significant mass-layoffs have been reported or verified in the last 30 days.
</p> </div>`} <div class="mt-20 p-8 rounded-2xl border border-white/5 bg-white/[0.01] text-center"> <h3 class="text-xl font-bold text-white mb-2">Notice anything missing?</h3> <p class="text-muted-foreground text-sm mb-6 max-w-md mx-auto">Our tracker relies on anonymous reports and public data. Help us keep the community informed.</p> <button class="px-6 py-2 rounded-pill border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">
Submit Anonymous Tip
</button> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/layoffs.astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/layoffs.astro";
const $$url = "/layoffs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Layoffs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
