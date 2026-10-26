/**
 * Opotek quote form backend (Google Apps Script). Free, runs on your Google account.
 * Receives the website's quote form and emails it to TO, with the visitor as reply-to.
 * Subjects start with [LEAD][B2B] or [LEAD][B2C] so they can be filtered in the inbox.
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
 *
 * Bot check: instead of a third-party captcha, the browser must solve a small proof-of-work puzzle
 * (GET ?challenge=1) before posting. It takes a real visitor about a second and needs no cookies.
 */
const TO = 'oriol@opotek.es';
const MAX_PER_HOUR = 20;          // protects the daily email quota from floods
const LIMITS = { name: 200, company: 200, email: 254, phone: 50, subject: 200, message: 5000 };
const CLIENT_TYPES = ['B2B', 'B2C'];
const POW_MAX_NUMBER = 50000;     // puzzle difficulty: the browser tries up to this many hashes
const POW_TTL_MS = 15 * 60 * 1000;

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d._honey) return reply({ ok: true });                       // spam trap filled: pretend success

    const field = (key, max) => String(d[key] || '').trim().slice(0, max);
    const email = field('email', LIMITS.email);
    const message = field('message', LIMITS.message);
    const type = String(d.client_type || '');
    if (!message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || CLIENT_TYPES.indexOf(type) < 0) {
      return reply({ ok: false, error: 'invalid' });
    }

    if (!validPow(d.pow)) return reply({ ok: false, error: 'captcha' });
    if (!withinRateLimit()) return reply({ ok: false, error: 'busy' });

    const body = [
      'Type: ' + type,
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
      subject: '[LEAD][' + type + '] ' + (field('_subject', LIMITS.subject) || 'Quote request'),
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

// ?challenge=1 hands out a signed puzzle; opening the plain URL just confirms the script is deployed.
function doGet(e) {
  if (e && e.parameter && e.parameter.challenge) return reply(newChallenge());
  return reply({ ok: true, service: 'opotek-quote-form' });
}

// Puzzle: find number such that sha256(salt + number) == challenge. Signed so it can't be forged.
function newChallenge() {
  const salt = Utilities.getUuid() + '.' + (Date.now() + POW_TTL_MS);
  const number = Math.floor(Math.random() * POW_MAX_NUMBER);
  const challenge = sha256(salt + number);
  return { salt: salt, challenge: challenge, maxnumber: POW_MAX_NUMBER, signature: hmac(challenge) };
}

function validPow(p) {
  if (!p || typeof p !== 'object') return false;
  const salt = String(p.salt || ''), challenge = String(p.challenge || '');
  if (!(Number(salt.split('.').pop()) > Date.now())) return false;           // expired
  if (hmac(challenge) !== String(p.signature || '')) return false;          // not issued by us
  if (sha256(salt + Number(p.number)) !== challenge) return false;           // not solved
  const cache = CacheService.getScriptCache();
  if (cache.get('pow-' + challenge)) return false;                          // already used
  cache.put('pow-' + challenge, '1', POW_TTL_MS / 1000);
  return true;
}

function sha256(s) {
  return hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8));
}

function hmac(s) {
  return hex(Utilities.computeHmacSha256Signature(s, secret()));
}

// Random signing key, created on first use and kept in Script Properties. Nothing to configure.
function secret() {
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('POW_SECRET');
  if (!key) {
    key = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('POW_SECRET', key);
  }
  return key;
}

function hex(bytes) {
  return bytes.map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
