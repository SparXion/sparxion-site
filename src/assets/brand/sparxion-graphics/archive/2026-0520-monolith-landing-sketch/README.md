# Archived monolith landing sketch

These Illustrator exports were replaced on **2026-05-20** by composed hero layers under `graphics-svg/`, assembled in `src/lib/buildLandingHeroSvg.ts` and rendered from `LandingHero.tsx`.

## Active hero layers (edit these)

| Layer | Path |
|-------|------|
| Right wedge | `graphics-svg/hero-band-right.svg` |
| Wordmark | `graphics-svg/wordmark.svg` |
| Tagline | `graphics-svg/tagline.svg` |
| Small X | `graphics-svg/x-mark.svg` |
| Large X (hero) | `graphics-svg/hero-x-mark-large.svg` |
| Large X (overlay) | `graphics-svg/x-mark-large.svg` |

## Why archived

Single-file `Sparxion_Landing_Sketch-Scale.svg` exports often dropped `#hero-band-right` when wordmark/tagline were re-exported. Layer files avoid that coupling.

## Files in this folder

- `Sparxion_Landing_Sketch-Scale.svg` — last app import target (superseded)
- `Sparxion_Landing_Sketch-Scalev0.svg`, `v1.svg` — export attempts / reference
- `Sparxion_Landing.svg`, `Sparxion_Landing.ai` — earlier full-artboard sources
- `Sparxion_Landing-001.svg` … `003.svg` — iteration exports from `src/assets/`
