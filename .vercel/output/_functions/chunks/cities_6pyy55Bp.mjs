import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_Biu5Z-66.mjs';
import { $ as $$Layout, a as $$Navbar, b as $$Footer } from './Footer_GNxZ3h1o.mjs';
import { b as getAllCities } from './jobService_B0NW5vDw.mjs';

const $$Cities = createComponent(async ($$result, $$props, $$slots) => {
  const fallbackCities = [
    { name: "San Francisco", index: 9.8, industries: ["Generative AI", "SaaS", "Fintech"], status: "Peak", description: "The epicenter of AI development and tech startups." },
    { name: "New York", index: 9.4, industries: ["Fintech", "Media Tech", "Enterprise Software"], status: "High Growth", description: "Massive expansion in financial technology and media." },
    { name: "Austin", index: 8.7, industries: ["Automotive Tech", "Hardware", "Cybersecurity"], status: "Stable", description: "Solid demand in hardware engineering and emerging tech." },
    { name: "Seattle", index: 8.9, industries: ["Cloud Computing", "E-commerce", "Aerospace"], status: "High", description: "Dominance in enterprise cloud and high-scale systems." },
    { name: "Chicago", index: 8.3, industries: ["Logistics Tech", "Fintech", "Healthtech"], status: "Steady", description: "Consistent growth in health technology and trading." },
    { name: "Boston", index: 8.5, industries: ["Biotech", "Robotics", "EdTech"], status: "Stable", description: "Biotech innovation remains the core driver." },
    { name: "Denver", index: 8.1, industries: ["SaaS", "Aerospace", "GreenTech"], status: "Growing", description: "Emerging hub for lifestyle-focused tech companies." },
    { name: "Miami", index: 7.8, industries: ["Crypto", "Fintech", "Real Estate Tech"], status: "Emerging", description: "Rapid growth in blockchain and financial applications." }
  ];
  const dbCities = await getAllCities();
  const cities = dbCities.length > 0 ? dbCities.map((c) => ({
    name: c.city,
    index: Math.min(10, c.job_count / 100 + 5).toFixed(1),
    industries: ["Tech", "IT Services", "Engineering"],
    status: c.job_count > 50 ? "Peak" : "High Growth",
    description: `Major hub with ${c.job_count} active job listings.`
  })) : fallbackCities;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Best Cities for Tech Jobs in US 2026 | Top Hiring Hubs", "description": "Discover the top hiring cities in the US current tech job market. Compare San Francisco, New York, Austin, and others based on hiring demand." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="mb-16"> <h1 class="text-4xl font-bold text-white mb-4">Hiring Hubs</h1> <p class="text-muted-foreground text-lg max-w-2xl">Geographic distribution of tech demand across the United States. Data reflects 2026 hiring indices.</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> ${cities.map((city) => renderTemplate`<div class="rounded-xl border border-white/10 bg-card p-6 hover:border-brand-cyan/30 transition-all group flex flex-col h-full"> <div class="flex justify-between items-start mb-4"> <span class="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-bold px-2 py-0.5 bg-brand-cyan/10 rounded">${city.status}</span> <div class="flex flex-col items-end"> <span class="text-2xl font-bold text-white">${city.index}</span> <span class="text-[10px] text-muted-foreground uppercase font-mono">Hiring Index</span> </div> </div> <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">${city.name}</h3> <p class="text-sm text-muted-foreground mb-4 flex-grow">${city.description}</p> <div class="space-y-3 pt-4 border-t border-white/5"> <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Key Industries</p> <div class="flex flex-wrap gap-2"> ${city.industries.map((industry) => renderTemplate`<span class="text-[10px] bg-white/5 text-white/70 px-2 py-1 rounded-pill border border-white/5"> ${industry} </span>`)} </div> </div> </div>`)} </div> <div class="mt-20 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-card to-black relative overflow-hidden"> <div class="relative z-10 md:flex items-center justify-between gap-12"> <div class="mb-8 md:mb-0"> <h2 class="text-2xl font-bold text-white mb-4">Regional Shift Analysis</h2> <p class="text-muted-foreground max-w-xl">In 2026, we've observed continued migration of tech talent from Tier-1 coastal hubs to emerging clusters in Austin and Denver, driven by remote-first policies for senior architects.</p> </div> <button class="bg-white text-black px-6 py-3 rounded-pill font-bold hover:bg-brand-cyan transition-colors whitespace-nowrap">
Download Regional Report
</button> </div> <div class="absolute -right-24 -bottom-24 h-64 w-64 bg-brand-cyan/10 blur-[100px] rounded-full"></div> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/cities.astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/cities.astro";
const $$url = "/cities";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cities,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
