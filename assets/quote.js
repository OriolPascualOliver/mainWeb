// Quote form: builds a readable brief from the selected options and sends it to the
// form backend set in data-endpoint (form_endpoint in _config.yml: the Google Apps Script
// in _form/apps-script.gs). If sending fails, the visitor can copy the brief or open it
// in their own email app instead.
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
    const needs = fd.getAll('need');
    if (needs.length) lines.push(L.need + ': ' + needs.join(', '));
    ['stage', 'qty', 'time'].forEach(k => { if (fd.get(k)) lines.push(L[k] + ': ' + fd.get(k)); });
    if (val(fd, 'desc')) lines.push('', L.desc + ':', val(fd, 'desc'));
    if (lines.length && fd.get('meeting')) lines.push('', L.meeting);
    const who = [val(fd, 'name'), val(fd, 'company'), val(fd, 'email'), val(fd, 'phone')].filter(Boolean).join(' · ');
    if (who && lines.length) lines.push('', who);
    return lines.join('\n');
  }

  function update() {
    const fd = new FormData(form);
    const text = brief(fd);
    out.textContent = text || L.empty;
    out.classList.toggle('filled', !!text);
    mail.href = 'mailto:' + L.email + '?subject=' + encodeURIComponent(subject(fd)) + '&body=' + encodeURIComponent(text);
  }

  function setStatus(msg, kind) {
    status.innerHTML = msg;
    status.className = 'status' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const fd = new FormData(form);
    if (val(fd, '_honey')) return;                       // spam trap
    if (!fd.getAll('need').length && !val(fd, 'desc')) { setStatus(L.needInfo, 'err'); return; }
    if (!form.elements.email.checkValidity()) { setStatus(L.needEmail, 'err'); form.elements.email.focus(); return; }

    submit.disabled = true;
    setStatus(L.sending);
    try {
      // Google Apps Script only accepts "simple" requests (no CORS preflight), so the JSON goes as text/plain there.
      const isAppsScript = form.dataset.endpoint.includes('script.google.com');
      const res = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: isAppsScript ? { 'Content-Type': 'text/plain;charset=utf-8' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: subject(fd), _replyto: val(fd, 'email'), _template: 'table',
          name: val(fd, 'name'), company: val(fd, 'company'), email: val(fd, 'email'), phone: val(fd, 'phone'),
          message: brief(fd)
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false || String(data.success) === 'false') throw new Error(data.error || data.message || res.status);
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
