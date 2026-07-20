# Nexus Node

Submission for INFINITUS 14.0 — Cognition: Ghost in the Machine.

Plain HTML/CSS/JS, no build step, no dependencies besides Google Fonts.

## Pages

- `index.html` — home / hero
- `manifesto.html` — theme philosophy + human/machine duality
- `terminal.html` — interactive operator shell (`help`, `status`, `scan`, `whoami`, `connect`, `ls`, `cat <file>`, `glitch`, `clear`)
- `network.html` — full-screen mouse-reactive neural map

## Run locally

```
python3 -m http.server 8931
```

Then open http://localhost:8931/index.html

## Deploy to GitHub Pages

```
git init
git add .
git commit -m "Nexus Node"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

Then in the repo: **Settings → Pages → Source → Deploy from branch → main / (root)**.
Your live link will be `https://<username>.github.io/<repo-name>/`.

## Submission checklist

- [ ] Live hosted link (GitHub Pages)
- [ ] Source code zipped (`zip -r nexus-node.zip . -x ".git/*"`)
