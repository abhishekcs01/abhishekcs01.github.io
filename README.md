# Portfolio (Redesigned)

This is a refreshed, static portfolio for **Abhishek Chettiar**. It uses Tailwind via CDN and vanilla JS for interactivity, making it perfect for GitHub Pages.

## Features
- Dark/light theme toggle with local storage
- Responsive layout with sticky header
- Filterable projects grid (data/projects.json)
- Intersection-based reveal animations
- Minimal dependencies, static-friendly

## Structure
```
.
├─ index.html
├─ 404.html
├─ .nojekyll
├─ assets/
│  └─ img/  # images and resume if copied
├─ data/
│  └─ projects.json
└─ js/
   └─ script.js
```

## Update your info
- Replace email and links in **index.html** (Contact section)
- Replace the résumé file under **assets/** and update its filename in the hero button
- Edit **data/projects.json** to add/update projects

## Deploy to GitHub Pages
1. Create/clean a repo (e.g., `abhishekcs01.github.io`).
2. Commit and push all files to the `main` branch.
3. In repo Settings → Pages: set **Source: Deploy from a branch**, Branch **main** and folder **/**.
4. Wait for Pages to build. Your site will be live at `https://<username>.github.io`.

### Optional
- Add a custom domain under Settings → Pages.
- Add basic analytics (Plausible) by including their script in `index.html`.
