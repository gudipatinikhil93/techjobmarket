import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, h as addAttribute, m as maybeRenderHead, u as unescapeHTML } from './entrypoint_Biu5Z-66.mjs';
import { $ as $$Layout, b as $$Footer, a as $$Navbar } from './Footer_GNxZ3h1o.mjs';
import { g as getRoleIntelligence } from './outlookService_D4bR2U41.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$role = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$role;
  const { role } = Astro2.params;
  const decodedRole = decodeURIComponent(role || "");
  const intelligence = await getRoleIntelligence(decodedRole);
  if (!intelligence) {
    return Astro2.redirect("/roles");
  }
  const statusColors = {
    Growing: "bg-green-500/20 text-green-400",
    Stable: "bg-brand-cyan/20 text-brand-cyan",
    Declining: "bg-orange-500/20 text-orange-400",
    Oversaturated: "bg-brand-magenta/20 text-brand-magenta"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${intelligence.role} Market Outlook & Salary in US 2026 | TechJobMarket`, "description": `What is the current job market like for ${intelligence.role}? Discover 2026 salary trends, top hiring cities, and key skills for ${intelligence.role} positions in the US.` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", " ", '<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <nav class="mb-8" aria-label="Breadcrumb"> <ol class="flex items-center space-x-2 text-sm text-muted-foreground"> <li><a href="/" class="hover:text-white transition-colors">Home</a></li> <li><span>/</span></li> <li><a href="/roles" class="hover:text-white transition-colors">Roles</a></li> <li><span>/</span></li> <li class="text-white font-medium">', '</li> </ol> </nav> <div class="grid grid-cols-1 lg:grid-cols-3 gap-12"> <!-- Main Stats --> <div class="lg:col-span-2 space-y-12"> <div> <div class="flex items-center gap-4 mb-4"> <h1 class="text-4xl font-bold text-white tracking-tight">', " Job Market US</h1> <span", "> ", ' </span> </div> <p class="text-xl text-muted-foreground leading-relaxed">\nAnalysis of the <strong>current job market for ', "</strong> in the US. ", ' </p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div class="rounded-xl border border-white/10 bg-card p-6"> <span class="text-xs font-mono text-muted-foreground uppercase tracking-widest">Active Openings</span> <p class="text-3xl font-bold text-white mt-2">', '</p> </div> <div class="rounded-xl border border-white/10 bg-card p-6"> <span class="text-xs font-mono text-muted-foreground uppercase tracking-widest">Growth (7d)</span> <p', "> ", '%\n</p> </div> <div class="rounded-xl border border-white/10 bg-card p-6"> <span class="text-xs font-mono text-muted-foreground uppercase tracking-widest">Avg Base 2026</span> <p class="text-3xl font-bold text-white mt-2">\n$', "k - $", 'k\n</p> </div> </div> <div> <h2 class="text-2xl font-bold text-white mb-6">Deep Market Analysis: ', '</h2> <div class="prose prose-invert max-w-none"> <p>\nBased on current market data, the role of <strong>', "</strong> is currently seeing a\n", " trend in the US tech ecosystem. The average base salary range in the US for this position currently spans from \n                $", " to $", " per annum, reflecting the <strong>current job market trends</strong> for 2026.\n</p> <p>\nThe highest demand for <strong>", "</strong> is currently concentrated in major hubs like <strong>", "</strong>. \n                Employers are prioritizing candidates with proficiency in <strong>", "</strong>, which are essential for staying competitive in the <strong>current job market for software engineers</strong> and related fields.\n</p> <p>\nCompared to last year, the hiring velocity for this role has changed by ", "%, indicating a ", " demand. For professionals looking to enter or advance in this field, focusing on ", " and ", ' is highly recommended.\n</p> </div> </div> </div> <!-- Sidebar --> <div class="space-y-8"> <div class="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-8"> <h3 class="text-lg font-bold text-white mb-4">Top Hiring Cities</h3> <ul class="space-y-4"> ', ' </ul> </div> <div class="rounded-xl border border-white/10 bg-card p-8"> <h3 class="text-lg font-bold text-white mb-4">In-Demand Skills</h3> <div class="flex flex-wrap gap-2"> ', ' </div> </div> <div class="p-6 rounded-xl bg-brand-magenta/10 border border-brand-magenta/20"> <h4 class="font-bold text-white mb-2">Data Transparency</h4> <p class="text-xs text-muted-foreground">\nThis intelligence is generated based on ', " real-time job listings from Indeed US, Wellfound, and direct career pages. Analytics are updated weekly.\n</p> </div> </div> </div> </div> </main> ", " "])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://techjobmarket.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Roles",
        "item": "https://techjobmarket.com/roles"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": intelligence.role,
        "item": `https://techjobmarket.com/role/${role}`
      }
    ]
  })), renderComponent($$result2, "Navbar", $$Navbar, {}), maybeRenderHead(), intelligence.role, intelligence.role, addAttribute(`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[intelligence.status]}`, "class"), intelligence.status, intelligence.role, intelligence.insight, intelligence.jobCount, addAttribute(`text-3xl font-bold mt-2 ${intelligence.growthPercentage >= 0 ? "text-green-400" : "text-red-400"}`, "class"), intelligence.growthPercentage, Math.round(intelligence.avgSalaryMin / 1e3), Math.round(intelligence.avgSalaryMax / 1e3), intelligence.role, intelligence.role, intelligence.status.toLowerCase(), intelligence.avgSalaryMin.toLocaleString("en-US"), intelligence.avgSalaryMax.toLocaleString("en-US"), intelligence.role, intelligence.topCities.join(", "), intelligence.keySkills.join(", "), intelligence.growthPercentage, intelligence.growthPercentage >= 0 ? "strengthening" : "shifting", intelligence.keySkills[0], intelligence.keySkills[1], intelligence.topCities.map((city) => renderTemplate`<li class="flex items-center justify-between"> <span class="text-muted-foreground">${city}</span> <span class="h-1.5 w-1.5 rounded-full bg-brand-cyan"></span> </li>`), intelligence.keySkills.map((skill) => renderTemplate`<span class="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-sm text-white"> ${skill} </span>`), intelligence.jobCount, renderComponent($$result2, "Footer", $$Footer, {})) })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/role/[role].astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/role/[role].astro";
const $$url = "/role/[role]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$role,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
