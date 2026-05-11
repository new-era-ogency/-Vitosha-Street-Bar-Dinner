# Vitosha Street Bar & Dinner | Digital Solution by New Era Agency

## Overview

Single-page digital presence for an **industrial–vintage** cocktail bar and restaurant on **Vitosha Boulevard, Sofia** (concept address in markup). The experience is cinematic and tactile: layered hero depth, film-style lighting cues, grain, blur gradients, smooth inertial scroll, and restrained motion on UI and menu transitions. Copy and metadata are **Bulgarian-first**, aligned with local SEO and brand tone.

## Tech stack

| Layer | Implementation |
|--------|----------------|
| Markup | HTML5, semantic sections, JSON-LD (`Restaurant`) |
| Styling | **Tailwind CSS** (Play CDN + inline `tailwind.config`), custom `<style>` for Lenis, cursor, grain, and motion-reduced states |
| Typography | **Google Fonts** — Oswald (display) |
| Scripting | **Vanilla JavaScript** (`app.js`, IIFE) |
| Motion | **GSAP** + **ScrollTrigger**; **Lenis** smooth scroll with ScrollTrigger scroller proxy |
| Micro-interactions | **Motion** (`motion/dom`, ESM) — vanilla API from the Framer Motion ecosystem (not React `framer-motion`) |
| Assets / media | Remote hero imagery/video URLs as in markup |
| Discovery | `robots.txt`, `sitemap.xml` (placeholder domain) |

No build step or framework runtime: static files suitable for any static host or CDN.

## Features

- **Responsive layout** — mobile drawer navigation, touch-friendly controls, breakpoints from Tailwind utilities.
- **Digital menu UX** — tabbed **Drinks / Kitchen** panels, tag-based filters on the drinks panel, card-based dishes with hover states; **QR-menu ready** in the sense that the same URL is a lightweight, phone-first menu surface (no separate QR asset generator in-repo).
- **Accessibility & motion** — `prefers-reduced-motion` respected for scroll behaviour and key animations.
- **Loading & transitions** — full-viewport loader; GSAP “curtain” for in-page anchor navigation (excluding hero jump).
- **Hero & atmosphere** — video/gradient stack, spotlight follow, vignette, progressive image blur-to-sharp, night-time accent logic for Sofia hours.
- **Gallery** — masonry-style grid with lightbox; Lenis paused while lightbox is open where implemented.
- **Booking block** — client-side form handling (demo / console as in script).
- **SEO & sharing** — meta description, keywords, canonical, Open Graph, Twitter Card, Bulgarian `lang` on `<html>`.

**Localization note:** This repository ships **Bulgarian** content and `lang="bg"`. **English and Ukrainian** locales are not implemented in the current static files; they are a standard scope item for a production handoff if the venue requires full BG / EN / UA parity.

## Project structure

```
Vitosha Street Bar & Dinner/
├── index.html    # Page shell, Tailwind config, fonts, vendor scripts, inline critical CSS
├── app.js        # Lenis, GSAP, Motion, menu, nav, loader, lightbox, cursor, booking
├── robots.txt
├── sitemap.xml
└── README.md
```

## Поддръжка

Този проект е разработен и се поддържа от **New Era Agency**. За актуализации на менюто, цените или техническа поддръжка, моля свържете се с нас.

## Credits

**Rodion Oleksandrovych** — Founder, New Era Agency.
