import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_Biu5Z-66.mjs';
import { $ as $$Layout, a as $$Navbar, b as $$Footer } from './Footer_GNxZ3h1o.mjs';
import { f as getTopSkills, h as getSkillGrowth } from './jobService_B0NW5vDw.mjs';

const $$Skills = createComponent(async ($$result, $$props, $$slots) => {
  const dbSkills = await getTopSkills();
  const skillGrowthData = await getSkillGrowth();
  const skills = dbSkills.length > 0 ? dbSkills.map((s) => {
    const growthInfo = skillGrowthData?.find((g) => g.skill === s.skill);
    return {
      name: s.skill,
      growth: growthInfo ? `+${growthInfo.growth_percentage}%` : "Insufficient Data",
      difficulty: s.job_count > 100 ? "Critical" : "High",
      categories: ["Tech"],
      trend: growthInfo && growthInfo.growth_percentage > 0 ? "up" : "stable"
    };
  }) : [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Top Tech Skills in Demand US 2026 | Job Market Trends", "description": "What skills are in demand for the current US tech job market? Explore trending technical skills, growth percentages, and upskilling paths." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="py-24"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="mb-16"> <h1 class="text-4xl font-bold text-white mb-4">Trending Skills</h1> <p class="text-muted-foreground text-lg max-w-2xl">The technical landscape is shifting rapidly. Here are the skills dominating the 2026 US talent market.</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> ${skills.map((skill) => renderTemplate`<div class="rounded-xl border border-white/10 bg-card p-6 hover:border-brand-blue/30 transition-all group relative overflow-hidden"> <div class="flex justify-between items-start mb-6"> <span${addAttribute(`text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded ${skill.difficulty === "Critical" ? "bg-brand-magenta/20 text-brand-magenta" : skill.difficulty === "Very High" ? "bg-brand-amber/20 text-brand-amber" : "bg-brand-cyan/20 text-brand-cyan"}`, "class")}> ${skill.difficulty} </span> <div class="text-right"> <span class="text-xl font-bold text-white block">${skill.growth}</span> <span class="text-[10px] text-muted-foreground uppercase font-mono">YoY Growth</span> </div> </div> <h3 class="text-xl font-bold text-white mb-4 group-hover:text-brand-blue transition-colors">${skill.name}</h3> <div class="space-y-3"> <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Sub-specializations</p> <div class="flex flex-wrap gap-2"> ${skill.categories.map((cat) => renderTemplate`<span class="text-[10px] bg-white/5 text-white/70 px-2 py-1 rounded border border-white/5"> ${cat} </span>`)} </div> </div> <!-- Mini trend visual --> <div class="mt-6 flex items-end gap-1 h-8"> ${[40, 60, 45, 70, 85, 90, 100].map((h, i) => renderTemplate`<div${addAttribute(`flex-1 rounded-t-sm transition-all duration-500 ${i === 6 ? "bg-brand-blue" : "bg-white/10"}`, "class")}${addAttribute(`height: ${h}%`, "style")}></div>`)} </div> </div>`)} ${skills.length === 0 && renderTemplate`<div class="col-span-full py-12 text-center text-muted-foreground italic">
No skill data available yet. Scraper pipeline is running to analyze current US tech job descriptions.
</div>`} </div> ${skills.length > 0 && renderTemplate`<div class="mt-24 p-8 rounded-2xl border border-brand-cyan/20 bg-brand-cyan/5"> <h2 class="text-2xl font-bold text-white mb-6">Market Insight: Skill Evolution</h2> <p class="text-muted-foreground leading-relaxed max-w-3xl">
The 2026 US tech market is favoring "T-shaped" professionals who combine deep technical expertise in one area (like AI Orchestration or Cloud Architecture) with a broad understanding of the business value chain. Skills like <strong>${skills[0].name}</strong> and <strong>${skills[1].name}</strong> are currently seeing the highest velocity in job listings across San Francisco and New York.
</p> </div>`} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/home/Nikhil/jobmarketindia/src/pages/skills.astro", void 0);

const $$file = "/home/Nikhil/jobmarketindia/src/pages/skills.astro";
const $$url = "/skills";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Skills,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
