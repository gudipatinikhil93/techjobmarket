import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_Biu5Z-66.mjs';
import { $ as $$Layout, a as $$Navbar, b as $$Footer } from './Footer_GNxZ3h1o.mjs';
import { s as searchRoles } from './outlookService_D4bR2U41.mjs';

const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Search;
  const q = Astro2.url.searchParams.get("q") || "";
  const results = q ? await searchRoles(q) : [];
  const statusColors = {
    Growing: "text-green-400",
    Stable: "text-brand-cyan",
    Declining: "text-orange-400",
    Oversaturated: "text-brand-magenta"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Search Results for "${q}" | TechJobMarket` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <h1 class="text-3xl font-bold text-white mb-8">Search Results for "${q}"</h1> ${results.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${results.map((role) => renderTemplate`<a${addAttribute(`/role/${encodeURIComponent(role.role)}`, "href")} class="rounded-xl border border-white/10 bg-card p-6 hover:border-brand-cyan/30 transition-all group"> <div class="flex justify-between items-start mb-4"> <span${addAttribute(`text-xs font-bold uppercase ${statusColors[role.status]}`, "class")}> ${role.status} </span> <span class="text-xs text-muted-foreground">${role.job_count} jobs</span> </div> <h3 class="text-xl font-bold text-white mb-4 group-hover:text-brand-cyan transition-colors">${role.role}</h3> <p class="text-sm text-muted-foreground mb-4">
Market Avg: $${Math.round(role.market_avg_min / 1e3)}k - $${Math.round(role.market_avg_max / 1e3)}k
</p> <span class="text-sm font-bold text-brand-cyan">View Intelligence →</span> </a>`)} </div>` : renderTemplate`<div class="text-center py-20 rounded-2xl border border-dashed border-white/10"> <p class="text-muted-foreground text-lg mb-4">No specific intelligence found for "${q}".</p> <a href="/roles" class="text-brand-cyan font-bold hover:underline">Explore all roles →</a> </div>`} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/search.astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
