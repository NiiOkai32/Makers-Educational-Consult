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

## Custom domain or another host

Set the `SITE_URL` environment variable to your final HTTPS site URL before building. Links, canonical metadata and the sitemap use that URL and its path prefix. Deploy the generated `dist/` directory to any static HTTPS host. At a project path such as `/Makers-Educational-Consult/`, `robots.txt` cannot control the host's root; the generated sitemap is still available at `/Makers-Educational-Consult/sitemap.xml`.
