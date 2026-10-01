const JOBS = [
  { id:"g1", cat:"grocery", title:"Food store manager", employer:"Independent grocer", place:"Brampton, ON", pay:"$37.00 / hour", lmia:"LMIA often on similar ads", noc:"NOC 60020",
    reqs:["Store or department lead time","Hire and schedule staff","Order stock","English"],
    apply:["Open the live Job Bank TFW ad. Copy the Job Bank ID and NOC.","Use Direct Apply if the button is there. Save the confirmation email.","Send this packet. Status line stays honest: not authorized until a permit.","Do not pay anyone for an LMIA."] },
  { id:"g2", cat:"grocery", title:"Retail store supervisor", employer:"Grocery / market", place:"ON / AB / BC towns", pay:"$21–36 / hour", lmia:"Many supervisor LMIA ads", noc:"NOC 62010",
    reqs:["Retail or grocery time","Supervise clerks","Schedules and ordering"],
    apply:["Same trail: Job ID, Direct Apply, confirmation saved.","Prefer ads near the high-wage line when you can."] },
  { id:"w1", cat:"warehouse", title:"Warehouse supervisor", employer:"Food / distribution warehouse", place:"BC / AB / ON", pay:"$36–45 / hour", lmia:"Supervisor LMIA more common", noc:"Supervisor codes",
    reqs:["Lead a floor","Inventory"],
    apply:["Only if you can describe warehouse lead work honestly."] },
  { id:"w2", cat:"warehouse", title:"Material handler", employer:"Regional warehouse", place:"QC / SK / rural", pay:"$20–24 / hour", lmia:"Some LMIA-requested ads", noc:"NOC 75101",
    reqs:["Lift and move goods","Safety rules"],
    apply:["Backup lane. Still log the Job Bank ID."] },
  { id:"f1", cat:"fish", title:"Fish plant labourer", employer:"Atlantic plant", place:"NS / NB / NL / PEI", pay:"$17–22 / hour", lmia:"Frequent seasonal LMIA", noc:"NOC 95107",
    reqs:["Will train on many ads","Cold wet standing work"],
    apply:["Seasonal. Housing only if the live ad says so."] },
  { id:"a1", cat:"farm", title:"Seasonal farm work", employer:"Official SAWP channel", place:"ON and farm regions", pay:"Contract wage", lmia:"Not a private agent", noc:"Primary agriculture",
    reqs:["Official government channel","No placement fee"],
    apply:["Jamaica: MLSS. This desk does not replace that office."] }
];
const CATS = [
  { id:"all", label:"All" },
  { id:"grocery", label:"Grocery lead" },
  { id:"warehouse", label:"Warehouse" },
  { id:"fish", label:"Fish plants" },
  { id:"farm", label:"Farm / SAWP" }
];
let currentCat = "all", selected = null, paid = false;
const papers = [];
const $ = (id) => document.getElementById(id);

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    document.querySelectorAll(".tab").forEach((t) => (t.hidden = true));
    $("tab-" + btn.dataset.tab).hidden = false;
    if (btn.dataset.tab === "packet") renderTarget();
    if (btn.dataset.tab === "trail") renderTrail();
  };
});

function form() { return Object.fromEntries(new FormData($("profile-form")).entries()); }

function renderCats() {
  $("cats").innerHTML = "";
  CATS.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = c.label; b.className = c.id === currentCat ? "on" : "";
    b.onclick = () => { currentCat = c.id; renderCats(); renderJobs(); };
    $("cats").appendChild(b);
  });
}
function renderJobs() {
  const list = JOBS.filter((j) => currentCat === "all" || j.cat === currentCat);
  $("jobs").innerHTML = "";
  list.forEach((j) => {
    const el = document.createElement("article");
    el.className = "card" + (selected && selected.id === j.id ? " on" : "");
    el.innerHTML = `<span class="tag">${j.lmia}</span><h3>${j.title}</h3><p class="meta">${j.employer} · ${j.place} · ${j.pay}</p>`;
    el.onclick = () => { selected = j; renderJobs(); renderDetail(); renderTarget(); };
    $("jobs").appendChild(el);
  });
}
function renderDetail() {
  const d = $("detail");
  if (!selected) { d.innerHTML = `<p class="fine">Select a listing.</p>`; return; }
  const j = selected;
  d.innerHTML = `<h2>${j.title}</h2><p class="meta">${j.employer} · ${j.place}<br>${j.pay} · ${j.noc}</p>
    <h3>Requirements</h3><ul>${j.reqs.map((r)=>`<li>${r}</li>`).join("")}</ul>
    <h3>How to apply</h3><ol>${j.apply.map((r)=>`<li>${r}</li>`).join("")}</ol>
    <p class="fine">Then: Papers → Packet → log the Job Bank ID on the trail tab.</p>`;
}

function renderThumbs() {
  $("thumbs").innerHTML = papers.map((p,i)=>`<figure><img src="${p.src}" alt="" /><figcaption>${p.caption} <button type="button" data-i="${i}">remove</button></figcaption></figure>`).join("");
  $("thumbs").querySelectorAll("button").forEach((b)=>{ b.onclick=()=>{ papers.splice(+b.dataset.i,1); renderThumbs(); }; });
}
$("file").onchange = (e) => {
  const cap = $("caption").value.trim();
  [...e.target.files].forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => { papers.push({ src: reader.result, caption: cap || file.name }); renderThumbs(); };
    reader.readAsDataURL(file);
  });
  e.target.value = "";
};

function renderTarget() {
  $("packet-target").textContent = selected
    ? `Packet for: ${selected.title} — ${selected.place} (${selected.noc}).`
    : "No listing selected.";
}

function bullets(text) {
  const raw = (text || "").split(/[\n.;]+/).map((s) => s.trim()).filter((s) => s.length > 8);
  const verbs = ["Led", "Managed", "Ordered", "Trained", "Served", "Kept"];
  return raw.slice(0, 6).map((s, i) => {
    const cap = s.charAt(0).toUpperCase() + s.slice(1);
    return cap.match(/^(Led|Managed|Hired|Ordered|Trained|Served|Kept|Ran|Operated)/i) ? cap : `${verbs[i % verbs.length]} ${cap.charAt(0).toLowerCase()}${cap.slice(1)}`;
  });
}

function packetText() {
  const p = form();
  const j = selected;
  const shots = papers.length ? papers.map((x) => "- " + x.caption).join("\n") : "- None this session";
  const auth = p.auth === "yes"
    ? "Authorized to work in Canada: yes (valid permit)."
    : "Authorized to work in Canada: no. Available after a work permit if an employer offers work. This file is not a permit application.";
  const loc = [p.street, p.city, p.country].filter(Boolean).join(", ") || "Address abroad — not a Canadian mailing address";
  const head = [p.lastTitle, p.lastEmp].filter(Boolean).join(" — ") || "Work history";
  const dutyList = bullets(p.lastDuties);
  if (p.staff) dutyList.unshift(`Supervised ${p.staff} staff on the floor and till.`);
  if (p.result) dutyList.push(p.result.replace(/^\w/, (c) => c.toUpperCase()));
  const dutyBlock = dutyList.length ? dutyList.map((d) => "• " + d).join("\n") : "• Duties not entered yet.";
  const jobLine = j ? `${j.title} (${j.noc}), ${j.employer}, ${j.place}` : "a role on your board (pick a listing)";
  const why = p.why || "I am applying because the work matches what I already do: staff, stock and customers.";
  return `CANADIAN-STYLE EMPLOYER PACKET
Assembled from your answers. 1–2 pages. No photo, age, or marital status.
Not IRCC. Not immigration advice.

${(p.name || "YOUR NAME").toUpperCase()}
${loc}
${p.email || ""}   ${p.phone || ""}
Languages: ${p.languages || "English"}

PROFILE
${head}. ${why}

${auth}

EXPERIENCE
${p.lastTitle || "Role"}  |  ${p.lastEmp || "Employer"}
${[p.lastCity, p.lastCountry].filter(Boolean).join(", ")}
${p.lastStart || ""} – ${p.lastEnd || "Present"}${p.hours ? "  ·  " + p.hours + " hrs/week" : ""}
${dutyBlock}

${p.prevWork ? "EARLIER\n" + p.prevWork + "\n" : ""}EDUCATION / TICKETS
${p.school || "Not listed"}
${p.tickets || "No tickets listed"}

PROOF ON FILE
${shots}

————————————————
COVER LETTER
${j ? j.employer + "\n" + j.place : "Hiring manager"}
Re: ${j ? j.title + " — " + j.noc : "Application"}

${p.name || "Applicant"}
${loc}

I am applying for ${jobLine}.

Most recently I worked as ${p.lastTitle || "a store lead"} at ${p.lastEmp || "my last employer"} (${p.lastStart || ""}–${p.lastEnd || "present"}). ${p.lastDuties || "I handled staff, stock and customers."}${p.result ? " " + p.result + "." : ""}

${why}

${auth}

I can send this file through Job Bank Direct Apply and keep the confirmation.

Thank you for your time.
${p.name || ""}`;
}

function goPacket(unlock) {
  if (!form().name) { alert("Add your name on Papers first."); return; }
  if (!selected) { alert("Pick a listing on the board so the letter has a job title."); return; }
  paid = !!unlock;
  $("sheet").textContent = packetText();
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === "packet"));
  document.querySelectorAll(".tab").forEach((t) => (t.hidden = t.id !== "tab-packet"));
  renderTarget();
}

$("assemble").onclick = () => goPacket(true);
$("pay").onclick = async () => {
  if (!form().name) { alert("Add your name on Papers first."); return; }
  if (!selected) { alert("Pick a listing first."); return; }
  $("pay").disabled = true;
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: selected.id, title: selected.title })
    });
    const data = await res.json();
    if (data.url) { location.href = data.url; return; }
    alert(data.error || "Stripe is not ready. Add STRIPE_SECRET_KEY on Vercel.");
  } catch (err) {
    alert("Checkout failed. You can still print a demo packet.");
  } finally {
    $("pay").disabled = false;
  }
};
if (new URLSearchParams(location.search).get("paid") === "1") goPacket(true);
renderCats(); renderJobs(); renderDetail(); renderTrail();
loadLiveJobs();
$("print").onclick = () => {
  if (!$("sheet").textContent.includes("CANADIAN-STYLE")) { alert("Assemble the packet first."); return; }
  window.print();
};

function loadTrail() {
  try { return JSON.parse(localStorage.getItem("ol-trail") || "[]"); } catch { return []; }
}
function saveTrail(rows) { localStorage.setItem("ol-trail", JSON.stringify(rows)); }
function renderTrail() {
  const rows = loadTrail();
  $("trail-list").innerHTML = rows.length
    ? rows.map((r,i)=>`<div class="card"><strong>${r.jtitle || "Untitled"}</strong><p class="fine">ID ${r.jbid || "—"} · ${r.jdate || ""} · ${r.jhow || ""}<br>${r.jnote || ""}</p><button type="button" data-del="${i}">Remove</button></div>`).join("")
    : `<p class="fine">No applications logged yet.</p>`;
  $("trail-list").querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = () => { const rows = loadTrail(); rows.splice(+b.dataset.del,1); saveTrail(rows); renderTrail(); };
  });
}
$("trail-add").onclick = () => {
  const fd = Object.fromEntries(new FormData($("trail-form")).entries());
  if (!fd.jbid && !fd.jtitle) { alert("Add a Job Bank ID or a title."); return; }
  const rows = loadTrail(); rows.unshift(fd); saveTrail(rows); renderTrail();
  $("trail-form").reset();
};

async function loadLiveJobs() {
  try {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    if (data.jobs && data.jobs.length) {
      JOBS.length = 0;
      data.jobs.forEach((j) => JOBS.push(j));
      const note = document.querySelector("#tab-desk .lede");
      if (note) note.textContent = "Updated " + (data.updatedAt || "today") + ". " + (data.source || "");
      renderJobs();
    }
  } catch (err) {
    console.warn("job feed", err);
  }
}
