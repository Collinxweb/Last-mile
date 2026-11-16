# Last Mile: Manhattan Courier

A driving mission game with four story missions, a dispatcher guide, a city map, and missions linked to AI news.

## Files

- `index.html`: the game (HUD, missions, map, guide)
- `news.json`: mission headlines with source, date and status. Each item has `reviewed: false` until you check it.
- `api/guide.js`: optional serverless function for the AI dispatcher, which runs on Vercel
- `README.md`: this file

## Before you publish

1. Open every link in `news.json` and confirm the headline matches the article. Then set `"reviewed": true`.
2. Keep the disclaimer on the menu screen. The story is fiction; the headlines are real reports.
3. Do not add ads, paid items, or tokens while the game uses real company names or likenesses.

## Deploy to Vercel

1. Create a GitHub repository and push this folder.
2. In Vercel, click **Add New > Project**, import the repository, and deploy. No build settings are needed; it is a static site with one function.
3. For the AI guide, go to **Project > Settings > Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from the Anthropic Console
   - Environments: Production and Preview
4. Redeploy after adding the key.

Without the key, the guide shows its scripted hints and the game still works.

## Test locally

Open `index.html` through a local server (`npx serve .`). The game fetches `news.json`, so it will not load from a plain double-click on some browsers.

## Next steps

- Add more missions by copying an entry in `MISSIONS` and pointing `news` to an id in `news.json`.
- Replace the procedural city with real street data (OpenStreetMap, with attribution) when you are ready.
