import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const digest = text => createHash('sha256').update(text).digest('hex').slice(0,16);
const scriptVersion = digest(read('app.js'));
const styleVersion = digest(read('fonts.css')+'\n'+read('style.css').replace(/^@import[^;]+;\s*/,'')+'\n'+read('readability.css'));

export function hardenHtml(html) {
  // Force updated assets when a browser still has the previous enquiry handler cached.
  html = html.replace('src="/app.js"', `src="/app.js?v=${scriptVersion}"`).replace('href="/style.css"', `href="/style.css?v=${styleVersion}"`);
  // JSON-LD is the only inline script. Authorise its exact bytes without unsafe-inline.
  const jsonLd = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  const hash = createHash('sha256').update(jsonLd || '').digest('base64');
  const policy = `default-src 'none'; script-src 'self' 'sha256-${hash}'; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; worker-src 'none'; upgrade-insecure-requests`;
  html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="no-referrer">`);
  html = html.replaceAll('rel="noopener"', 'rel="noopener noreferrer"');
  html = html.replace('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1100&q=85', '/assets/students-collaborating.jpg');
  html = html.replace('<form id="enquiry-form">', '<form id="enquiry-form" method="post"><noscript><p>To enquire, call 054 139 6869 or use the WhatsApp link above. The message builder needs JavaScript.</p></noscript><fieldset id="enquiry-fields" disabled>');
  // Controls are not successful form fields: they never enter a native submission body or URL.
  html = html.replaceAll(' name="name"', '').replaceAll(' name="service"', '').replaceAll(' name="message"', '');
  html = html.replace('This prepares a message in WhatsApp. You can review it and choose whether to send. This form does not save your details.', 'Prepare and review your message here, copy it, then open WhatsApp and paste it. Your details are not put into links or saved by this website. Avoid sensitive information.');
  html = html.replace('Continue to WhatsApp <span aria-hidden="true">↗</span>', 'Prepare my enquiry <span aria-hidden="true">↗</span>');
  html = html.replace('<p id="form-status" role="status"></p></form>', '</fieldset><div id="enquiry-preview" hidden><label for="prepared-message">Review your message</label><textarea id="prepared-message" rows="7" readonly></textarea><div class="enquiry-actions"><button class="button" id="copy-enquiry" type="button">Copy message</button><a class="text-link" href="https://wa.me/233541396869" target="_blank" rel="noopener noreferrer">Open WhatsApp and paste ↗</a></div><p class="fine">Copying places this text on your device clipboard. Paste it into WhatsApp, review it and choose whether to send.</p></div><p id="form-status" role="status" aria-live="polite"></p></form>');
  html = html.replace('The contact form builds a WhatsApp message in your browser. Details are not submitted to a Makers website server. When you continue to WhatsApp, its privacy policy and terms apply. You decide whether to send the message.', 'The contact form prepares a message in your browser. It does not submit your details to a Makers website server, put them into a link, or save them in browser storage. You can review and copy the message, then open WhatsApp and paste it. Copying places the text on your device clipboard. WhatsApp’s privacy policy and terms apply when you use that service, and you choose whether to send.');
  html = html.replace('The website uses a photograph hosted by Unsplash. Loading it shares standard connection information, such as your IP address, with that service. The hosting provider may also process basic technical access logs to deliver and secure the site.', 'Images, fonts, styles and scripts are hosted with this website; loading a page does not request assets from Google Fonts or Unsplash. GitHub Pages may process technical access information to deliver and secure the site. Opening WhatsApp takes you to an external service.');
  return html;
}
