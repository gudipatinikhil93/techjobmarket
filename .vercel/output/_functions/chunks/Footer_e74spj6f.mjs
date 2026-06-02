import { c as createComponent } from './astro-component_EHeKi8zR.mjs';
import 'piccolore';
import { k as renderTemplate, v as renderSlot, w as renderHead, h as addAttribute, m as maybeRenderHead } from './entrypoint_BX4b3bmX.mjs';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "JobMarketIndia | India's Job Market Intelligence",
    description = "Modern India-focused job market intelligence platform. Analyze trends, salaries, and hiring patterns in real-time.",
    image = "/og-image.png",
    canonicalURL = new URL(Astro2.url.pathname, "https://jobmarketindia.com").toString(),
    type = "website"
  } = Astro2.props;
  const siteName = "JobMarketIndia";
  const twitterHandle = "@JobMarketIndia";
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="dark"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"', "><!-- Primary Meta Tags --><title>", '</title><meta name="title"', '><meta name="description"', '><meta name="robots" content="index, follow"><!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name"', '><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><meta property="twitter:site"', '><!-- Canonical URL --><link rel="canonical"', '><!-- Structured Data --><script type="application/ld+json">\n			{\n				"@context": "https://schema.org",\n				"@type": "WebSite",\n				"name": "JobMarketIndia",\n				"alternateName": "JMI",\n				"url": "https://jobmarketindia.com",\n				"potentialAction": {\n					"@type": "SearchAction",\n					"target": "https://jobmarketindia.com/search?q={search_term_string}",\n					"query-input": "required name=search_term_string"\n				}\n			}\n		<\/script><script type="application/ld+json">\n			{\n				"@context": "https://schema.org",\n				"@type": "Organization",\n				"name": "JobMarketIndia",\n				"url": "https://jobmarketindia.com",\n				"logo": "https://jobmarketindia.com/favicon.svg",\n				"sameAs": [\n					"https://twitter.com/jobmarketindia",\n					"https://linkedin.com/company/jobmarketindia"\n				]\n			}\n		<\/script>', '</head> <body class="min-h-screen selection:bg-brand-cyan selection:text-black"> ', "</body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(type, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url), "content"), addAttribute(siteName, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url), "content"), addAttribute(twitterHandle, "content"), addAttribute(canonicalURL, "href"), renderHead(), renderSlot($$result, $$slots["default"]));
}, "/home/Nikhil/jobmarketindia/src/layouts/Layout.astro", void 0);

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
        { href: "/trends", label: "Market Trends" },
        { href: "/layoffs", label: "Layoff Tracker" }
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
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-white/10 bg-black py-20"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5"> <div class="col-span-2 lg:col-span-1"> <a href="/" class="flex items-center gap-2 mb-6"> <div class="h-5 w-5 bg-white rounded-sm rotate-45"></div> <span class="text-lg font-bold">JobMarketIndia</span> </a> <p class="text-sm text-muted-foreground max-w-xs mb-8">
The intelligence platform for the <strong>current job market in India</strong>. Providing real-time insights into 2026 hiring trends and salary data.
</p> <div class="flex gap-4"> <!-- Social icons placeholder --> <div class="h-8 w-8 rounded-md bg-white/5 border border-white/10"></div> <div class="h-8 w-8 rounded-md bg-white/5 border border-white/10"></div> <div class="h-8 w-8 rounded-md bg-white/5 border border-white/10"></div> </div> </div> ${footerSections.map((section) => renderTemplate`<div> <h3 class="text-sm font-semibold text-white mb-4 uppercase tracking-wider font-mono">${section.title}</h3> <ul class="space-y-3"> ${section.links.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-sm text-muted-foreground hover:text-white transition-colors"> ${link.label} </a> </li>`)} </ul> </div>`)} </div> <div class="mt-20 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between gap-4"> <p class="text-xs text-muted-foreground">
© 2026 JobMarketIndia. All rights reserved. Not a job board.
</p> <div class="flex gap-6"> <a href="#" class="text-xs text-muted-foreground hover:text-white transition-colors">Privacy Policy</a> <a href="#" class="text-xs text-muted-foreground hover:text-white transition-colors">Terms of Service</a> </div> </div> </div> </footer>`;
}, "/home/Nikhil/jobmarketindia/src/components/Footer.astro", void 0);

export { $$Layout as $, $$Footer as a };
