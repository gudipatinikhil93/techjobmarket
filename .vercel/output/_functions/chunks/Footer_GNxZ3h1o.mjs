import { c as createComponent } from './astro-component__qT9p1E_.mjs';
import 'piccolore';
import { k as renderTemplate, v as renderSlot, w as renderHead, h as addAttribute, m as maybeRenderHead } from './entrypoint_Biu5Z-66.mjs';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "TechJobMarket | US Tech Career Intelligence",
    description = "Modern US-focused tech job market intelligence platform. Analyze trends, salaries, and hiring patterns in real-time.",
    image = "/og-image.png",
    canonicalURL = new URL(Astro2.url.pathname, "https://techjobmarket.com").toString(),
    type = "website"
  } = Astro2.props;
  const siteName = "TechJobMarket";
  const twitterHandle = "@TechJobMarket";
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="dark"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"', "><!-- Primary Meta Tags --><title>", '</title><meta name="title"', '><meta name="description"', '><meta name="robots" content="index, follow"><!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name"', '><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><meta property="twitter:site"', '><!-- Canonical URL --><link rel="canonical"', '><!-- Structured Data --><script type="application/ld+json">\n			{\n				"@context": "https://schema.org",\n				"@type": "WebSite",\n				"name": "TechJobMarket",\n				"alternateName": "TJM",\n				"url": "https://techjobmarket.com",\n				"potentialAction": {\n					"@type": "SearchAction",\n					"target": "https://techjobmarket.com/search?q={search_term_string}",\n					"query-input": "required name=search_term_string"\n				}\n			}\n		<\/script><script type="application/ld+json">\n			{\n				"@context": "https://schema.org",\n				"@type": "Organization",\n				"name": "TechJobMarket",\n				"url": "https://techjobmarket.com",\n				"logo": "https://techjobmarket.com/favicon.svg",\n				"sameAs": [\n					"https://twitter.com/techjobmarket",\n					"https://linkedin.com/company/techjobmarket"\n				]\n			}\n		<\/script>', '</head> <body class="min-h-screen selection:bg-brand-cyan selection:text-black"> ', "</body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(type, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url), "content"), addAttribute(siteName, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url), "content"), addAttribute(twitterHandle, "content"), addAttribute(canonicalURL, "href"), renderHead(), renderSlot($$result, $$slots["default"]));
}, "/home/Nikhil/jobmarketindia/src/layouts/Layout.astro", void 0);

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const navLinks = [
    { href: "/roles", label: "Roles" },
    { href: "/cities", label: "Cities" },
    { href: "/skills", label: "Skills" },
    { href: "/salaries", label: "Salaries" },
    { href: "/trends", label: "Trends" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl"> <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"> <div class="flex items-center gap-8"> <a href="/" class="flex items-center gap-2 group"> <div class="h-6 w-6 bg-white rounded-sm rotate-45 group-hover:bg-brand-cyan transition-colors"></div> <span class="text-xl font-bold tracking-tight">TechJob<span class="text-brand-cyan">Market</span></span> </a> <div class="hidden md:flex items-center gap-6"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="text-sm font-medium text-muted-foreground hover:text-white transition-colors"> ${link.label} </a>`)} </div> </div> <div class="flex items-center gap-4"> <form action="/search" method="GET" class="hidden lg:block relative"> <input type="text" name="q" placeholder="Search roles..." class="w-48 xl:w-64 h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-cyan/50 transition-all"> <kbd class="absolute right-2 top-2 h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 flex pointer-events-none"> <span class="text-xs">/</span> </kbd> </form> <a href="/about" class="hidden sm:block text-sm font-medium text-muted-foreground hover:text-white transition-colors">
About
</a> <button class="rounded-pill bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-white/90 transition-all active:scale-95">
Market Pulse
</button> </div> </div> </nav>`;
}, "/home/Nikhil/jobmarketindia/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const footerSections = [
    {
      title: "Market",
      links: [
        { href: "/roles", label: "Trending Roles" },
        { href: "/skills", label: "Skill Demand" },
        { href: "/salaries", label: "Salary Benchmarks" },
        { href: "/cities", label: "Hiring Hubs" }
      ]
    },
    {
      title: "Insights",
      links: [
        { href: "/trends", label: "Market Trends" }
      ]
    },
    {
      title: "Platform",
      links: [
        { href: "/about", label: "Our Mission" },
        { href: "#", label: "Methodology" },
        { href: "#", label: "API Access" },
        { href: "#", label: "Contact" }
      ]
    },
    {
      title: "Popular Roles",
      links: [
        { href: "/role/Software%20Engineer", label: "Software Engineer" },
        { href: "/role/Frontend%20Developer", label: "Frontend Developer" },
        { href: "/role/Data%20Analyst", label: "Data Analyst" },
        { href: "/role/Product%20Manager", label: "Product Manager" }
      ]
    }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-white/10 bg-black py-20"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5"> <div class="col-span-2 lg:col-span-1"> <a href="/" class="flex items-center gap-2 mb-6"> <div class="h-5 w-5 bg-white rounded-sm rotate-45"></div> <span class="text-lg font-bold">TechJobMarket</span> </a> <p class="text-sm text-muted-foreground max-w-xs mb-8">
The intelligence platform for the <strong>current US tech job market</strong>. Providing real-time insights into hiring trends and salary data.
</p> <div class="flex gap-4"> <!-- Social icons placeholder --> <div class="h-8 w-8 rounded-md bg-white/5 border border-white/10"></div> <div class="h-8 w-8 rounded-md bg-white/5 border border-white/10"></div> <div class="h-8 w-8 rounded-md bg-white/5 border border-white/10"></div> </div> </div> ${footerSections.map((section) => renderTemplate`<div> <h3 class="text-sm font-semibold text-white mb-4 uppercase tracking-wider font-mono">${section.title}</h3> <ul class="space-y-3"> ${section.links.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-sm text-muted-foreground hover:text-white transition-colors"> ${link.label} </a> </li>`)} </ul> </div>`)} </div> <div class="mt-20 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between gap-4"> <p class="text-xs text-muted-foreground">
© 2026 TechJobMarket. All rights reserved. Not a job board.
</p> <div class="flex gap-6"> <a href="#" class="text-xs text-muted-foreground hover:text-white transition-colors">Privacy Policy</a> <a href="#" class="text-xs text-muted-foreground hover:text-white transition-colors">Terms of Service</a> </div> </div> </div> </footer>`;
}, "/home/Nikhil/jobmarketindia/src/components/Footer.astro", void 0);

export { $$Layout as $, $$Navbar as a, $$Footer as b };
