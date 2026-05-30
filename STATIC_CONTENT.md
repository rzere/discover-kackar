# Static site content

The public website no longer loads copy or structure from Supabase at runtime. Everything lives in:

- `src/lib/data/static/content.json` — full export (pages, categories, footer, CTA, contact, gallery)
- `src/lib/data/siteContent.ts` — typed helpers (`getHomePage`, `getCategories`, etc.)

## Updating text (every ~6 months)

1. Edit content in Supabase (or edit `content.json` directly).
2. Re-export from production:

   ```bash
   node scripts/export-static-data.js
   ```

3. Commit `src/lib/data/static/content.json` and deploy.

## Images

All CMS images are downloaded to `public/images/static/` and referenced as `/images/static/...` in `content.json`.

To refresh images after a content export:

```bash
node scripts/export-static-data.js
node scripts/download-static-images.js
```

Then commit both `content.json` and `public/images/static/`.

The home hero carousel, category heroes, subcategory photos, gallery, and contact hero all use these local files. No Supabase Storage dependency at runtime.

### Hero carousel (separate from CMS gallery)

The home page hero uses **5 fixed HiRes DJI drone photos** (`imageUtils.ts` → `/images/optimized/*_desktop.avif`), not the CMS gallery. The gallery export is sorted by upload date and mostly subcategory thumbnails.

To (re)build hero images from `../assets/`:

```bash
node scripts/setup-hero-images.js
```

Commit `public/images/optimized/*DJI*` with your deploy.

## Contact form

Submissions are sent to your inbox via [Resend](https://resend.com) (`/api/public/contact`).

Set in `.env.local` / Vercel:

- `RESEND_API_KEY` — from Resend dashboard
- `CONTACT_TO_EMAIL` — comma-separated recipients (default: `nceylansensoy@gmail.com`, `ruzzfl@gmail.com`)
- `CONTACT_FROM_EMAIL` — verified sender (use `onboarding@resend.dev` for testing; use `@discoverkackar.com` after domain verification)

## Admin panel

`/admin` still expects Supabase credentials. It is optional; the live site does not depend on it.
