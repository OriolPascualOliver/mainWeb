/**
 * Opotek quote form backend (Google Apps Script). Free, runs on your Google account.
 * Receives the website's quote form and emails it to TO, with the visitor as reply-to.
 *
 * Setup (once):
 *  1. Go to https://script.google.com -> New project. Paste this whole file, replacing what is there.
 *  2. Deploy -> New deployment -> gear icon -> "Web app".
 *       Execute as: Me      Who has access: Anyone      -> Deploy.
 *  3. Authorize when asked. Google shows "Google hasn't verified this app": it is your own script,
 *     click Advanced -> Go to project (unsafe) -> Allow.
 *  4. Copy the Web app URL (https://script.google.com/macros/s/.../exec)
 *     and put it in _config.yml as form_endpoint.
 *
 * After editing this script later: Deploy -> Manage deployments -> edit (pencil) -> Version: New version,
 * so the same URL keeps working.
 * Quota: about 100 emails/day on a normal Google account.
 */
const TO = 'oriol@opotek.es';
const MAX_PER_HOUR = 20;          // protects the daily email quota from floods
const LIMITS = { name: 200, company: 200, email: 254, phone: 50, subject: 200, message: 5000 };

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d._honey) return reply({ ok: true });                       // spam trap filled: pretend success

    const field = (key, max) => String(d[key] || '').trim().slice(0, max);
    const email = field('email', LIMITS.email);
    const message = field('message', LIMITS.message);
    if (!message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return reply({ ok: false, error: 'invalid' });

    if (!withinRateLimit()) return reply({ ok: false, error: 'busy' });

    const body = [
      'Name: ' + field('name', LIMITS.name),
      'Company: ' + field('company', LIMITS.company),
      'Email: ' + email,
      'Phone: ' + field('phone', LIMITS.phone),
      '',
      message,
      '',
      '— Sent from the quote form on opotek.es'
    ].join('\n');

    MailApp.sendEmail({
      to: TO,
      replyTo: email,
      subject: field('_subject', LIMITS.subject) || 'Quote request',
      body: body,
      name: 'Opotek website'
    });
    return reply({ ok: true });
  } catch (err) {
    console.error(err);                                          // details stay in Executions log (Apps Script)
    return reply({ ok: false, error: 'error' });
  }
}

// Counts emails sent in the current hour; refuses once MAX_PER_HOUR is reached.
function withinRateLimit() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const cache = CacheService.getScriptCache();
    const key = 'sent-' + new Date().toISOString().slice(0, 13);  // e.g. sent-2026-10-25T14
    const count = Number(cache.get(key) || 0);
    if (count >= MAX_PER_HOUR) return false;
    cache.put(key, String(count + 1), 3600);
    return true;
  } finally {
    lock.releaseLock();
  }
}

// Opening the URL in a browser just confirms the script is deployed.
function doGet() {
  return reply({ ok: true, service: 'opotek-quote-form' });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
