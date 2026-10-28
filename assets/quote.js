// Quote form: builds a readable brief from the selected options and sends it to the
// form backend set in data-endpoint (form_endpoint in _config.yml: the Google Apps Script
// in _form/apps-script.gs). If sending fails, the visitor can copy the brief or open it
// in their own email app instead. The backend needs a solved bot-check puzzle and the
// client type (B2B/B2C), which it puts in the email subject as [LEAD][B2B] / [LEAD][B2C],
// plus the patent choice ([PATENT-CHECK] when ordered) and acceptance of the terms (/terms/).
(() => {
  const form = document.getElementById('quote');
  if (!form) return;
  const L = JSON.parse(form.dataset.labels);
  const out = document.getElementById('briefText');
  const copy = document.getElementById('copyBrief');
  const submit = document.getElementById('sendBrief');
  const status = document.getElementById('formStatus');
  const mail = document.getElementById('mailFallback');

  const val = (fd, k) => (fd.get(k) || '').trim();
  const subject = fd => L.subject + (val(fd, 'company') ? ' · ' + val(fd, 'company') : '');

  function brief(fd) {
    const lines = [];
    if (fd.get('client_type')) lines.push(L.client + ': ' + L.types[fd.get('client_type')]);
    const needs = fd.getAll('need');
    if (needs.length) lines.push(L.need + ': ' + needs.join(', '));
    ['stage', 'qty', 'time'].forEach(k => { if (fd.get(k)) lines.push(L[k] + ': ' + fd.get(k)); });
    if (val(fd, 'desc')) lines.push('', L.desc + ':', val(fd, 'desc'));
    if (lines.length && fd.get('meeting')) lines.push('', L.meeting);
    if (lines.length && fd.get('patent')) lines.push(L.patent + ': ' + L.patents[fd.get('patent')]);
    if (lines.length && fd.get('terms')) lines.push(L.terms);
    const who = [val(fd, 'name'), val(fd, 'company'), val(fd, 'email'), val(fd, 'phone')].filter(Boolean).join(' · ');
    if (who && lines.length) lines.push('', who);
    return lines.join('\n');
  }

  function update() {
    const fd = new FormData(form);
    const text = brief(fd);
    out.textContent = text || L.empty;
    out.classList.toggle('filled', !!text);
    const tag = '[LEAD]' + (fd.get('client_type') ? '[' + fd.get('client_type') + ']' : '')
      + (fd.get('patent') === 'check' ? '[PATENT-CHECK]' : '') + ' ';  // the backend adds the same tags
    mail.href = 'mailto:' + L.email + '?subject=' + encodeURIComponent(tag + subject(fd)) + '&body=' + encodeURIComponent(text);
  }

  function setStatus(msg, kind) {
    status.innerHTML = msg;
    status.className = 'status' + (kind ? ' ' + kind : '');
  }

  const sha256 = async s => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // Bot check: fetch a signed puzzle from the backend and find the number that hashes to it
  // (see _form/apps-script.gs). Hashes run in batches so it takes about a second.
  async function solvePuzzle() {
    const res = await fetch(form.dataset.endpoint + '?challenge=1');
    const p = await res.json();
    for (let start = 0; start <= p.maxnumber; start += 1000) {
      const nums = Array.from({ length: 1000 }, (_, i) => start + i);
      const hashes = await Promise.all(nums.map(n => sha256(p.salt + n)));
      const i = hashes.indexOf(p.challenge);
      if (i >= 0) return { salt: p.salt, challenge: p.challenge, signature: p.signature, number: nums[i] };
    }
    throw new Error('puzzle');
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const fd = new FormData(form);
    if (val(fd, '_honey')) return;                       // spam trap
    if (!fd.getAll('need').length && !val(fd, 'desc')) { setStatus(L.needInfo, 'err'); return; }
    if (!fd.get('client_type')) { setStatus(L.needType, 'err'); form.elements.client_type[0].focus(); return; }
    if (!form.elements.email.checkValidity()) { setStatus(L.needEmail, 'err'); form.elements.email.focus(); return; }
    if (!fd.get('patent')) { setStatus(L.needPatent, 'err'); form.elements.patent[0].focus(); return; }
    if (!fd.get('terms')) { setStatus(L.needTerms, 'err'); form.elements.terms.focus(); return; }

    submit.disabled = true;
    setStatus(L.sending);
    try {
      const pow = await solvePuzzle();
      // Google Apps Script only accepts "simple" requests (no CORS preflight), so the JSON goes as text/plain.
      const res = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          _subject: subject(fd), client_type: fd.get('client_type'), patent: fd.get('patent'), terms: !!fd.get('terms'), pow,
          name: val(fd, 'name'), company: val(fd, 'company'), email: val(fd, 'email'), phone: val(fd, 'phone'),
          message: brief(fd)
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || res.status);
      form.classList.add('sent');
      setStatus(L.sent, 'ok');
    } catch (err) {
      setStatus(L.failed, 'err');
    } finally {
      submit.disabled = false;
    }
  });

  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(out.textContent);
      copy.textContent = L.copied;
      setTimeout(() => { copy.textContent = L.copy; }, 1500);
    } catch (err) { /* clipboard blocked: the brief stays visible to copy by hand */ }
  });

  update();
})();
