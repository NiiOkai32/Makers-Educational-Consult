# Makers Education Consult

Standalone static website. No ChatGPT sign-in, runtime, API or framework dependency is required.

## Build and preview

Use Node.js 22 or newer. There are no packages to install.

```sh
npm run build:pages
npm run check
npm run dev
```

The local server is at http://127.0.0.1:4173. Builds target https://niiokai32.github.io/Makers-Educational-Consult/ by default. To preview this project URL locally, the server also accepts the `/Makers-Educational-Consult/` prefix.

## GitHub Pages

Publish this project's source and generated `docs/` folder to the `main` branch of `NiiOkai32/Makers-Educational-Consult`. Do not upload the parent workspace, `.git/`, `.tools/`, `.openai/`, or deployment archives.

In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/docs**, then save. GitHub will report the live URL when deployment finishes. The expected URL above is not confirmation that hosting is enabled.

When editing, change source files, run `npm run build:pages` and `npm run check`, then commit the updated source and `docs/` together. `dist/` is a generated local preview; `docs/` is the generated GitHub Pages publishing folder.

Official setup reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Replace the founder photo

1. Put your portrait at `assets/founder-photo.jpg` (a 4:5 portrait works best).
2. In `founder.mjs`, change `/assets/founder-photo.svg` to `/assets/founder-photo.jpg` and change the image alt text to `Emmanuel Larbi Kwesi, founder of Makers Educational Consult`.
3. Run `npm run build:pages` and `npm run check`, then commit the source and rebuilt `docs/`.

The supplied logo is preserved unchanged in `assets/makers-logo.png` and used in the header, footer and favicon.

## Security and privacy

Every page has a Content Security Policy that allows local assets, blocks native form submission and network API requests, and authorises the exact JSON-LD with a hash. Links use a no-referrer policy. Enquiry details stay in the browser until the visitor chooses to copy and paste into WhatsApp; they never enter URLs. The form stays disabled if JavaScript cannot initialise. Images and fonts are served locally.

Embedded pages are replaced with a direct-site link as a best-effort safeguard. Full anti-framing protection needs the HTTP `Content-Security-Policy: frame-ancestors 'none'` or `X-Frame-Options: DENY` response header. GitHub Pages does not apply custom response headers from repository files. On a host that supports them, also configure `X-Content-Type-Options: nosniff` and a restrictive `Permissions-Policy`. Unsupported meta tags are not equivalent protections.

Protect the GitHub owner account with a passkey or two-factor authentication, review collaborators and app access, and protect the publishing branch. These are account/repository administration settings. Public phone numbers and branding remain copyable; this site cannot guarantee prevention of spam or impersonation. Never commit private credentials or client documents.

Run `npm run build:pages` and `npm run check` before publication. Do not relax CSP with `unsafe-inline` or `unsafe-eval`.

## Asset attribution

The study photograph was originally loaded from Unsplash photo `1523240795612-9a054b0db644` and is now stored locally. DM Sans and Manrope use the SIL Open Font License; their license texts are included in `assets/fonts/`.

## Custom domain or another host

Set the `SITE_URL` environment variable to your final HTTPS site URL before building. Links, canonical metadata and the sitemap use that URL and its path prefix. Deploy the generated `dist/` directory to any static HTTPS host. At a project path such as `/Makers-Educational-Consult/`, `robots.txt` cannot control the host's root; the generated sitemap is still available at `/Makers-Educational-Consult/sitemap.xml`.
