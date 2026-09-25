# Fatima Sherpeeva UGC

Portfolio site for Fatima Sherpeeva (UGC creator). Live at [fatimasherpeeva.ru](https://www.fatimasherpeeva.ru).

## Stack

Static HTML/CSS/JS (`src/`) + Vercel serverless functions (`src/api/`) + Vercel Blob for media storage. No build step.

## Deploy

Hosted on Vercel, project `fatima-sherpeeva-ugc` (team `sabr7`). Vercel project setting **Root Directory** is `src`.

This repository is **not** currently connected to Vercel's Git integration — deploys are pushed via the Vercel API/CLI. Pushes here are for version history only and do not trigger a deploy on their own.

## Admin panel

`/admin.html` — upload photos/videos into the 7 content slots (`hero`, `about`, `photo1`, `photo2`, `video1-3`) and edit contact links. Protected by the `ADMIN_PASSCODE` environment variable set in Vercel.
