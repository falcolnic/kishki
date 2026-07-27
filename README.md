# KISHKI_NET

A Watch Dogs / ctOS-inspired site for the KISHKI squad: scanline terminal aesthetic,
a scroll-driven history log, a "profiler" squad grid, and a 3-stage BREACH PROTOCOL
minigame (memory pattern → decrypt → firewall bypass).

## Stack

- React 18 + Vite
- Tailwind CSS (custom `cyan` / `breach` / `amber` ctOS palette in `tailwind.config.js`)
- No backend — everything is static, deploys straight to Vercel

## Structure

```
src/
  data/squad.js          ← edit this first: squad name, history log, roster, social links
  hooks/
    useTypewriter.js      terminal boot-text effect (Hero)
    useInView.js          triggers the profiler scan animation on scroll
  components/
    LoadingScreen.jsx     gates the site on first load — scatter of data tags,
                          center percentage counter + reticle, progress bar,
                          tap-to-skip after 0.5s. See "Loading screen" below.
    Navbar.jsx
    Hero.jsx              glitch wordmark + typed boot sequence
    History.jsx           squad story as a timestamped log
    Squad.jsx / ProfilerCard.jsx   member grid with scan-in HUD
    BreachMinigame.jsx    the 3-stage hacking minigame
    Footer.jsx            social links as a directory listing
  App.jsx                 composes all sections + fixed CRT overlay
  index.css               Tailwind layers + scanline/vignette/glitch CSS
```

## Editing content

Everything text-based — squad name, history entries, member bios, social links —
lives in `src/data/squad.js`. You shouldn't need to touch component code just to
update copy.

The minigame's answer word (Stage 2, decrypt) is `DECRYPT_TARGET` near the top of
`src/components/BreachMinigame.jsx` — currently set to the squad name.

## Local dev

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com/new.
3. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`
   (Vercel usually detects this automatically).
4. Deploy.

`vercel.json` is included so client-side routing (if you add more pages/routes
later) falls back to `index.html` correctly.

## Loading screen

A full ~15s boot/login sequence modeled on a reference clip, staged in `src/components/LoadingScreen.jsx`:

1. Boot log types out bottom-left (region link, session id, protocol negotiation)
2. A blank center panel fades in with corner brackets
3. The HUD frame draws in — top-left logo/clock slot, top-right env/node slot, right-edge signal rail
4. The right-edge cipher content resolves (noise grid + vertical ID string)
5. Corner content fills in (real clock — a live stopwatch — + today's date, ENV/NODE readout), and the center panel becomes the `sasaOS` wordmark with a login form underneath
6. Username row reveals, then the password field "types" itself out square by square
7. Auto-submits — LOGIN button shows a spinner, then the password flips **green** for a moment (the one deliberate exception to the site's monochrome+red palette, matching the reference clip exactly)
8. Crossfades to an ID card ("IDENTITY VERIFIED", employee id/class, full name, hex + barcode, photo silhouette) with a blinking `[ENTER] TO CONFIRM`
9. Waits for a real <kbd>Enter</kbd> keypress (or auto-advances after ~2.6s so nobody gets stuck)
10. Crossfades to a final "ENTERING SYSTEM" progress bar, then reveals the site

All stage transitions use `framer-motion` (`AnimatePresence`/`motion.div`) for real crossfades rather than hard cuts — that's a real dependency in `package.json`, not a sandbox-only trick, so it works the same after `npm install` and on Vercel.

Everything text/content-wise is editable at the top of `LoadingScreen.jsx`: `BOOT_LINES`, `SESSION_TAG`, `ENV_LABEL`, `NODE_IP`, `CIPHER_ID`, `OS_PREFIX`/`OS_SUFFIX` (the wordmark), `USERNAME`, `PASSWORD_LENGTH`, and the `CARD` object (employee id, class, full name — currently Cyrillic, rendered in IBM Plex Mono which has native Cyrillic glyph coverage via Google Fonts, unlike the pixel display font).

Note: the original reference clip is *Watch Dogs: Legion*'s in-game ctOS boot/login screen (Ubisoft's fictional "Blume Corp"/"Sentinel"/"ctOS" branding). This build matches the layout and pacing but renames the in-fiction branding to KISHKI's own (`sasaOS`, `KISHKI Systems`, `WARDEN`) rather than reproducing Ubisoft's specific proper nouns.

## About the logo you sent

The uploaded image (the hooded skull / "SASASEC" graffiti mark) is a distinct
piece of existing artwork, so it isn't reproduced here — but the site's whole
visual language (scanline CRT texture, cyan/red duotone, stencil-ish display
type, glitch treatment on the wordmark) is built to sit in that same "hacker
crew tag" world. Swap in KISHKI's own logo as an SVG/PNG in `public/` and drop
it into `Navbar.jsx` / `Hero.jsx` in place of the text wordmark whenever it's
ready.
