const LEAF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.4 1.6.3 3.2-.4 4.6 1.2-.6 2.5-1 3.9-1.1-.2 1.6-.9 3-2 4.1 1.6-.2 3.1.1 4.5.8-.9 1.3-2.2 2.3-3.7 2.8 1.3.7 2.4 1.8 3.1 3.2-1.6.2-3.2 0-4.6-.6.4 1.4.4 2.9 0 4.3L12 22l-.8-1.9c-.4-1.4-.4-2.9 0-4.3-1.4.6-3 .8-4.6.6.7-1.4 1.8-2.5 3.1-3.2-1.5-.5-2.8-1.5-3.7-2.8 1.4-.7 2.9-1 4.5-.8-1.1-1.1-1.8-2.5-2-4.1 1.4.1 2.7.5 3.9 1.1C11.7 5.2 11.6 3.6 12 2z"/></svg>';
function mapleReply(q) {
  const t = (q || '').toLowerCase();
  if (/visa|permit|pr\b|permanent|ircc form|sponsorship guarantee/.test(t)) return 'I help with jobs and the application packet — not with visa decisions. After an employer offers work, you apply for a permit on IRCC\u2019s own site. I will not tell you that you will get in.';
  if (/lmia|pay.*agent|recruiter fee/.test(t)) return 'An LMIA is the employer\u2019s filing with ESDC. You should not pay a private agent for an LMIA. Confirm the live ad on Job Bank.';
  if (/grocery|supermarket|store manager|60020|62010/.test(t)) return 'Grocery leads usually sit on NOC 60020 (manager) or 62010 (supervisor). Lead the resume with staff, ordering, inventory and customers.';
  if (/fish|plant|atlantic|95107/.test(t)) return 'Fish plant labour (NOC 95107) is common in Atlantic Canada and often seasonal. Apply to the employer on Job Bank.';
  if (/farm|sawp|mlss/.test(t)) return 'Seasonal farm work for Jamaica is the official SAWP channel through MLSS. This desk does not replace that office.';
  if (/resume|letter|packet|pdf|pay|price/.test(t)) return 'Board is free. One packet is $14.99. You send the file to the employer — we do not email IRCC.';
  if (/how|apply|start|help/.test(t)) return 'Three steps: pick a listing, add papers, pay for that job\u2019s PDF and send it via Job Bank.';
  return 'I\u2019m Maple — desk assistant for Open Lane. I explain listings, how to apply, and the PDF packet. I do not file permits.';
}
function mountMaple() {
  if (document.getElementById('maple-fab')) return;
  const fab = document.createElement('button');
  fab.id = 'maple-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Ask Maple'); fab.innerHTML = LEAF;
  const panel = document.createElement('div');
  panel.id = 'maple-panel';
  panel.innerHTML = '<div class="maple-head">'+LEAF+'<div><strong>Maple</strong><p>Desk assistant \u00b7 not IRCC</p></div></div><div class="maple-msgs" id="maple-msgs"></div><div class="maple-chips"><button type="button" data-q="How do I apply?">How do I apply?</button><button type="button" data-q="Grocery manager jobs">Grocery jobs</button><button type="button" data-q="What is an LMIA?">LMIA</button><button type="button" data-q="How much is the packet?">Packet price</button></div><form class="maple-form" id="maple-form"><input id="maple-q" placeholder="Ask Maple\u2026" autocomplete="off" /><button type="submit">Send</button></form>';
  document.body.appendChild(panel); document.body.appendChild(fab);
  const msgs = panel.querySelector('#maple-msgs');
  function add(role, text) { const d = document.createElement('div'); d.className = 'm '+role; d.textContent = text; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  add('bot', 'Hello \u2014 I\u2019m Maple. I help you read Canada job listings and build the packet you send the employer. Not immigration advice.');
  function ask(q) { if (!q.trim()) return; add('you', q); add('bot', mapleReply(q)); }
  fab.onclick = function(){ panel.classList.toggle('open'); };
  panel.querySelectorAll('[data-q]').forEach(function(b){ b.onclick = function(){ ask(b.dataset.q); }; });
  panel.querySelector('#maple-form').onsubmit = function(e){ e.preventDefault(); var input = panel.querySelector('#maple-q'); ask(input.value); input.value=''; };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountMaple); else mountMaple();
