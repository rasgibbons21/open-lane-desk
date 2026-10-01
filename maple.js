const LEAF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.4 1.6.3 3.2-.4 4.6 1.2-.6 2.5-1 3.9-1.1-.2 1.6-.9 3-2 4.1 1.6-.2 3.1.1 4.5.8-.9 1.3-2.2 2.3-3.7 2.8 1.3.7 2.4 1.8 3.1 3.2-1.6.2-3.2 0-4.6-.6.4 1.4.4 2.9 0 4.3L12 22l-.8-1.9c-.4-1.4-.4-2.9 0-4.3-1.4.6-3 .8-4.6.6.7-1.4 1.8-2.5 3.1-3.2-1.5-.5-2.8-1.5-3.7-2.8 1.4-.7 2.9-1 4.5-.8-1.1-1.1-1.8-2.5-2-4.1 1.4.1 2.7.5 3.9 1.1C11.7 5.2 11.6 3.6 12 2z"/></svg>';

function mapleReply(q) {
  const t = (q || "").toLowerCase();
  if (/visa|permit|pr\b|permanent|ircc form|sponsorship guarantee/.test(t))
    return "Pile B. After an employer offers work, you apply on IRCC’s site. I do not file permits and I will not say you will get in.";
  if (/lmia|agent|naira|whatsapp|buy a job/.test(t))
    return "You do not buy an LMIA. The employer files it with ESDC. WhatsApp “pay now, jobs waiting, only passport and CV” is not a job.";
  if (/resume|résumé|cv|photo|address|toronto|ats/.test(t))
    return "Canadian employer résumé: 1–2 pages, no photo or date of birth, real city you live in now — not a fake Toronto line. Bullets with staff, stock, customers. Do not invent duties; IRCC can ask for the same story later.";
  if (/authorized|status|overseas|abroad|location/.test(t))
    return "If the form asks whether you are authorized to work in Canada, answer no unless you already have a permit. Put your real city. “Available after a permit” is honest; a fake local address is not.";
  if (/job bank|direct apply|confirmation|screenshot|job id/.test(t))
    return "On a TFW ad: screenshot Job Bank ID and NOC. Use Direct Apply when it exists. Save the confirmation email. Log it on the Job Bank trail tab so you are not applying into the void.";
  if (/mass|spam|200|spray|indeed only/.test(t))
    return "One tailored packet per real ad beats 200 identical CVs. Recruiters already complain about résumé dumps. Log each send. Volume without a Job Bank ID is noise.";
  if (/grocery|supermarket|60020|62010/.test(t))
    return "Store leads: NOC 60020 manager or 62010 supervisor. Lead with staff, ordering, inventory — not “labourer” if you ran the shop.";
  if (/farm|sawp|mlss/.test(t))
    return "SAWP for Jamaica is MLSS, not this packet and not a private agent.";
  if (/how|apply|start|help|packet|price/.test(t))
    return "Listings → papers (honest status) → one packet for that job → log Job Bank ID. Board free. Packet $14.99 on the live desk.";
  return "I’m Maple. I help with Canadian résumés, honest status, Job Bank trail, and LMIA-scam checks. I am not IRCC. Try: résumé, authorized to work, Job Bank, LMIA.";
}

function mountMaple() {
  if (document.getElementById("maple-fab")) return;
  const fab = document.createElement("button");
  fab.id = "maple-fab"; fab.type = "button"; fab.setAttribute("aria-label", "Ask Maple"); fab.innerHTML = LEAF;
  const panel = document.createElement("div");
  panel.id = "maple-panel";
  panel.innerHTML = `<div class="maple-head">${LEAF}<div><strong>Maple</strong><p>Desk assistant · not IRCC</p></div></div>
    <div class="maple-msgs" id="maple-msgs"></div>
    <div class="maple-chips">
      <button type="button" data-q="How do I write a Canadian resume?">Canadian résumé</button>
      <button type="button" data-q="Should I say I am overseas?">Status</button>
      <button type="button" data-q="How does Job Bank Direct Apply work?">Job Bank</button>
      <button type="button" data-q="Can I buy an LMIA?">LMIA scam</button>
    </div>
    <form class="maple-form" id="maple-form"><input id="maple-q" placeholder="Ask Maple…" autocomplete="off" /><button type="submit">Send</button></form>`;
  document.body.appendChild(panel); document.body.appendChild(fab);
  const msgs = panel.querySelector("#maple-msgs");
  function add(role, text) {
    const d = document.createElement("div"); d.className = "m " + role; d.textContent = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  add("bot", "Hello — I’m Maple. I fix the painful bits: Canadian résumé rules, honest work-status, Job Bank paper trail, and fake LMIA ads. Not immigration advice.");
  function ask(q) { if (!q.trim()) return; add("you", q); add("bot", mapleReply(q)); }
  fab.onclick = () => panel.classList.toggle("open");
  panel.querySelectorAll("[data-q]").forEach((b) => { b.onclick = () => ask(b.dataset.q); });
  panel.querySelector("#maple-form").onsubmit = (e) => {
    e.preventDefault();
    const input = panel.querySelector("#maple-q");
    ask(input.value); input.value = "";
  };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountMaple);
else mountMaple();
