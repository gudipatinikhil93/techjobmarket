import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_Biu5Z-66.mjs';
import { $ as $$Layout, a as $$Navbar, b as $$Footer } from './Footer_GNxZ3h1o.mjs';
import { d as getAllRoles } from './jobService_B0NW5vDw.mjs';

const $$Roles = createComponent(async ($$result, $$props, $$slots) => {
  const fallbackRoles = [
    { name: "AI Engineer", category: "Engineering", salary: "$140k - $220k", demand: "Critical" },
    { name: "Full Stack Developer", category: "Engineering", salary: "$110k - $160k", demand: "High" },
    { name: "Product Manager", category: "Product", salary: "$130k - $180k", demand: "High" },
    { name: "Data Scientist", category: "Data", salary: "$125k - $175k", demand: "Very High" },
    { name: "Cloud Architect", category: "Infrastructure", salary: "$160k - $240k", demand: "Critical" },
    { name: "UI/UX Designer", category: "Design", salary: "$95k - $150k", demand: "Medium" },
    { name: "DevOps Engineer", category: "Infrastructure", salary: "$130k - $190k", demand: "High" },
    { name: "Cybersecurity Analyst", category: "Security", salary: "$115k - $170k", demand: "Very High" }
  ];
  const dbRoles = await getAllRoles();
  const roles = dbRoles.length > 0 ? dbRoles.map((r) => ({
    name: r.role,
    category: "Tech",
    salary: "Market Rate",
    demand: r.job_count > 50 ? "Critical" : "High"
  })) : fallbackRoles;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Trending Tech Job Roles in US 2026 | Current Job Market Analysis", "description": "Explore the most in-demand job roles in the US tech market. Analyze salary benchmarks, hiring demand, and growth trends for 2026." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="mb-16"> <h1 class="text-4xl font-bold text-white mb-4">Trending Job Roles</h1> <p class="text-muted-foreground text-lg">In-depth analysis of the most in-demand roles in the US tech ecosystem.</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${roles.map((role) => renderTemplate`<a${addAttribute(`/role/${encodeURIComponent(role.name)}`, "href")} class="rounded-xl border border-white/10 bg-card p-6 hover:border-brand-cyan/30 transition-all group"> <div class="flex justify-between items-start mb-4"> <span class="text-xs font-mono text-brand-cyan uppercase tracking-widest">${role.category}</span> <span${addAttribute(`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${role.demand === "Critical" ? "bg-brand-magenta/20 text-brand-magenta" : "bg-brand-cyan/20 text-brand-cyan"}`, "class")}> ${role.demand} </span> </div> <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">${role.name}</h3> <p class="text-sm text-muted-foreground mb-6">Average Base Salary: <span class="text-white font-medium">${role.salary}</span></p> <span class="text-sm font-bold text-white/50 group-hover:text-white transition-colors">View detailed breakdown →</span> </a>`)} </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/roles.astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/roles.astro";
const $$url = "/roles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Roles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
