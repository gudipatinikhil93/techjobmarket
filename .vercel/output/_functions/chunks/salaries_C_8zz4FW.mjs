import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { p as createRenderInstruction, o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_Biu5Z-66.mjs';
import { $ as $$Layout, a as $$Navbar, b as $$Footer } from './Footer_GNxZ3h1o.mjs';
import { e as getSalaryBenchmarks } from './jobService_B0NW5vDw.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Salaries = createComponent(async ($$result, $$props, $$slots) => {
  const dbSalaries = await getSalaryBenchmarks();
  const salaryData = dbSalaries.length > 0 ? dbSalaries.map((s) => ({
    role: s.role,
    avgMin: (s.avg_min / 1e3).toFixed(0),
    avgMax: (s.avg_max / 1e3).toFixed(0),
    avgMedian: ((s.avg_min + s.avg_max) / 2 / 1e3).toFixed(0)
  })) : [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Software Engineer Salaries in US 2026 | Tech Pay Scales", "description": "How much do software engineers make in the current US tech job market? Explore average salaries, compensation ranges, and trends for 2026." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="mb-16"> <h1 class="text-4xl font-bold text-white mb-4">Salary Benchmarks</h1> <p class="text-muted-foreground text-lg max-w-2xl">Average annual base salary ranges (USD) by role across major US tech hubs.</p> </div> <!-- Search Section --> <div class="mb-12"> <div class="relative max-w-md"> <input type="text" id="roleSearch" placeholder="Search roles (e.g. Frontend Developer)..." class="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand-cyan/50 transition-colors pl-10"> <svg class="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> </div> <div class="overflow-x-auto rounded-xl border border-white/10 bg-card"> <table class="w-full border-collapse" id="salaryTable"> <thead> <tr class="border-b border-white/10 text-left bg-white/[0.02]"> <th class="py-6 px-6 text-sm font-mono text-muted-foreground uppercase tracking-widest">Job Role</th> <th class="py-6 px-6 text-sm font-mono text-muted-foreground uppercase tracking-widest">Avg. Min</th> <th class="py-6 px-6 text-sm font-mono text-muted-foreground uppercase tracking-widest">Avg. Max</th> <th class="py-6 px-6 text-sm font-mono text-muted-foreground uppercase tracking-widest text-brand-cyan">Estimated Median</th> </tr> </thead> <tbody class="divide-y divide-white/5"> ${salaryData.length > 0 ? salaryData.map((item) => renderTemplate`<tr class="group hover:bg-white/[0.02] transition-colors salary-row"${addAttribute(item.role.toLowerCase(), "data-role")}> <td class="py-6 px-6"> <span class="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">${item.role}</span> </td> <td class="py-6 px-6 text-white/70">$${item.avgMin}k</td> <td class="py-6 px-6 text-white/70">$${item.avgMax}k</td> <td class="py-6 px-6"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-cyan/10 text-brand-cyan">
$${item.avgMedian}k
</span> </td> </tr>`) : renderTemplate`<tr> <td colspan="4" class="py-12 text-center text-muted-foreground italic">
No salary data available yet. Pipeline is scraping current US tech job salaries.
</td> </tr>`} </tbody> </table> </div> ${salaryData.length < 5 && salaryData.length > 0 && renderTemplate`<p class="mt-4 text-xs text-brand-magenta font-mono">
⚠️ Low confidence indicator: Limited data points for certain roles.
</p>`} ${renderScript($$result2, "/home/Nikhil/jobmarketindia/src/pages/salaries.astro?astro&type=script&index=0&lang.ts")} <div class="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8"> <div class="p-8 rounded-2xl border border-white/10 bg-card"> <h3 class="text-xl font-bold text-white mb-4">Stock Options & RSUs</h3> <p class="text-muted-foreground text-sm leading-relaxed">
In 2026, many US tech companies are re-evaluating compensation. While FAANG and public companies continue to offer generous RSUs with 4-year vesting, early-stage startups are increasingly relying on higher base salaries or quarterly performance-linked bonuses to remain competitive.
</p> </div> <div class="p-8 rounded-2xl border border-white/10 bg-card"> <h3 class="text-xl font-bold text-white mb-4">The "GenAI Premium"</h3> <p class="text-muted-foreground text-sm leading-relaxed">
Engineers with proven experience in custom model training or RAG-at-scale are commanding a 25-40% premium over traditional full-stack roles. We've seen "Talent Wars" in San Francisco resulting in base salaries exceeding $200k for senior AI architects.
</p> </div> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/salaries.astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/salaries.astro";
const $$url = "/salaries";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Salaries,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
