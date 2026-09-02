# Siduktag Frontend (Next.js + TypeScript)

Minimal Next.js (TypeScript) frontend scaffold to connect to the existing Laravel backend.

Quick start

```bash
cd frontend
npm install
npm run dev
```

Environment

- Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to your Laravel API URL (e.g. `http://localhost:8000`).

Auth (Laravel Sanctum)

This scaffold configures `axios` with `withCredentials: true` to support Laravel Sanctum cookie-based auth. To use Sanctum, configure CORS and session cookie domain on the Laravel app and then call `/sanctum/csrf-cookie` from the Next.js app before authenticating.

Checklist

- Laravel: add `FRONTEND_URL=http://localhost:3000` to `.env`.
- Laravel: ensure `config/cors.php` includes `sanctum/csrf-cookie` and `'supports_credentials' => true`.
- Laravel: set session cookie settings for local dev: `SESSION_DOMAIN=localhost`, `SESSION_SAME_SITE=lax`, `SESSION_SECURE_COOKIE=false`.
- Next.js: set `NEXT_PUBLIC_API_URL` and use the helper in `src/lib/auth.ts` which calls `/sanctum/csrf-cookie` before login.

Example flow

- Visit `/login` in Next.js and submit credentials. The app calls `/sanctum/csrf-cookie`, then `/login` on the Laravel app, using cookies for auth.
- After login, the frontend can call `/api/user` to retrieve the authenticated user.

Notes

- For development the cookie settings above are enough; for production configure `SESSION_DOMAIN` for your domains and set `SESSION_SECURE_COOKIE=true` with HTTPS.

Next steps

- Migrate Blade views from `resources/views` into React pages under `frontend/pages`.
- Gradually port components into `frontend/src/components`.
- Configure asset pipeline if you rely on Vite-built assets or public storage.

Automatic placeholder generation

You can automatically generate Next.js placeholder pages and components from existing Blade views (skips `resources/views/admin`) with:

```bash
node ../scripts/generate-next-placeholders.cjs
```

This creates files under `frontend/pages` and `frontend/src/components` mapping the Blade structure to Next.js placeholders.
