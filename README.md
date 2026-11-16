# Last Mile: Manhattan Courier

A driving mission game with four story missions, a dispatcher guide, a city map, and missions linked to AI news.

## Files

- `index.html`: the game (HUD, missions, map, guide)
- `news.json`: mission headlines with source, date and status. Each item has `reviewed: false` until it has been checked against the original article.
- `api/guide.js`: optional serverless function for the AI dispatcher, using Groq's free tier
- `README.md`: this file

## Before you publish

1. Open every link in `news.json`, confirm the headline matches the article, then set `"reviewed": true`.
2. Keep the disclaimer on the menu screen. The story is fiction; the headlines are real reports.
3. Do not add ads, paid items, or tokens while the game uses real company names or likenesses.

## Set up the AI guide (Groq free tier)

1. Create a free API key at https://console.groq.com
2. In your Vercel project, go to **Settings > Environment Variables** and add:
   - Name: `GROQ_API_KEY`
   - Value: your Groq key
   - Environments: Production and Preview
3. Redeploy the project.

Without a key, the guide shows its scripted hints and the game still works. Free limits are small and can change, so the game falls back to scripted hints when the quota runs out.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New > Project**, import the repository, and deploy. No build settings are needed; it is a static site with one serverless function.

## Test locally

Serve the folder with a local server (for example `npx serve .`). The game loads `news.json`, which some browsers block when the page is opened directly from disk.

## Next steps

- Add missions by copying an entry in `MISSIONS` in `index.html` and pointing its `news` field to an id in `news.json`.
- Replace the procedural city with real street data (OpenStreetMap, with attribution) when ready.
