# AI Mindmap Slideshow

Interactive radial mind-map with Presenter Mode.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript, React 19
- Tailwind CSS v4
- Framer Motion
- Zustand

## Run locally
```bash
# In WSL
cd /mnt/c/school/ai-mindmap
npm i
npm run dev
# open http://localhost:3000
```

## Data
Static JSON at `src/data/tools.json`. Edit to change clusters and tools.

## Presenter Mode
Visit `/presenter`. Use Left/Right keys or on-screen Prev/Next.

## Deploy (Vercel)
- Push to GitHub
- Import repo in Vercel
- Add env var `NEXT_PUBLIC_BUILD_DATE` (e.g., `Sep 2025`)
- Trigger deploy

## Notes
- Animations: fadeIn 0.3s; orbit stagger 0.06s; zoom spring {stiffness 120, damping 18}
- Pricing line displays “As of {NEXT_PUBLIC_BUILD_DATE}`
# SchoolPrez
