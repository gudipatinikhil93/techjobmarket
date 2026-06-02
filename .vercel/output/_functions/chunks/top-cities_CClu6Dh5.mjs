import { g as getTopCities } from './jobService_BYpfT7r6.mjs';

const GET = async () => {
  try {
    const cities = await getTopCities();
    const enrichedCities = cities.map((c) => ({
      city: c.city,
      hiringIndex: Math.min(10, c.job_count / 50 + 5).toFixed(1),
      // Normalized index
      avgSalary: c.avg_salary
    }));
    return new Response(JSON.stringify(enrichedCities), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
