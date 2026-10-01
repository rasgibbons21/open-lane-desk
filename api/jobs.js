const SOURCES = [
  { cat: "grocery", q: "store manager" },
  { cat: "grocery", q: "food store supervisor" },
  { cat: "warehouse", q: "warehouse supervisor" },
  { cat: "fish", q: "fish plant" },
  { cat: "farm", q: "farm worker" }
];

function strip(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&/g, "&").replace(/\s+/g, " ").trim();
}

function parse(html, cat) {
  const jobs = [];
  const blocks = html.split(/jobpostingtfw\//i).slice(1, 12);
  for (const block of blocks) {
    const id = (block.match(/^(\d+)/) || [])[1];
    if (!id) continue;
    const title = strip((block.match(/<span class="noctitle"[^>]*>([\s\S]*?)<\/span>/i) || block.match(/<a[^>]*>([\s\S]*?)<\/a>/i) || [])[1] || "");
    const employer = strip((block.match(/businesses[^>]*>([\s\S]*?)<\//i) || [])[1] || "");
    const place = strip((block.match(/location[^>]*>([\s\S]*?)<\//i) || [])[1] || "");
    const pay = strip((block.match(/salary[^>]*>([\s\S]*?)<\//i) || [])[1] || "");
    if (!title) continue;
    jobs.push({
      id: "jb-" + id,
      cat,
      title,
      employer: employer || "See Job Bank",
      place: place || "Canada",
      pay: pay || "See ad",
      lmia: /approved/i.test(block) ? "Approved LMIA" : "LMIA requested",
      noc: "Confirm on Job Bank",
      source: "Job Bank TFW",
      url: "https://www.jobbank.gc.ca/jobsearch/jobpostingtfw/" + id,
      reqs: ["Open the Job Bank page and read who can apply.", "Match only work you have done."],
      apply: ["Open the Job Bank link.", "Use Direct Apply if it is there.", "Save the confirmation.", "Do not pay an agent for an LMIA."]
    });
  }
  return jobs;
}

async function pull() {
  const all = [];
  for (const src of SOURCES) {
    const url = "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=" + encodeURIComponent(src.q) + "&fsrc=32&sort=D";
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "OpenLaneDesk/1.0" } });
      const html = await res.text();
      all.push(...parse(html, src.cat));
    } catch (err) {
      all.push({ id: "err-" + src.cat, cat: src.cat, title: src.q, employer: "Job Bank", place: "Canada", pay: "", lmia: "Feed delayed", noc: "", source: "Job Bank TFW", url, reqs: ["Live pull failed this hour. Open Job Bank directly."], apply: ["Search Temporary Foreign Workers on Job Bank."] });
    } finally {
      clearTimeout(timer);
    }
  }
  const seen = new Set();
  return all.filter((j) => (seen.has(j.id) ? false : seen.add(j.id)));
}

module.exports = async function handler(req, res) {
  const jobs = await pull();
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json({
    updatedAt: new Date().toISOString(),
    source: "Job Bank Temporary Foreign Workers (fsrc=32). Confirm every card on the linked page.",
    jobs
  });
};
