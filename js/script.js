
// Simple interactive logic: theme toggle, mobile menu, project filter, smooth reveal
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector("#themeToggle");
  const html = document.documentElement;

  // Persist theme
  const saved = localStorage.getItem("theme");
  if (saved) html.classList.toggle("dark", saved === "dark");
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    html.classList.add("dark");
  }

  themeToggle?.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Mobile menu
  const menuBtn = document.querySelector("#menuBtn");
  const mobileNav = document.querySelector("#mobileNav");
  menuBtn?.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
  });

  // Load projects
  fetch("data/projects.json")
    .then(r => r.json())
    .then(items => {
      const grid = document.querySelector("#projectsGrid");
      const filters = document.querySelector("#filters");
      if (!grid) return;
      const allTags = new Set();
      items.forEach(p => (p.tags || []).forEach(t => allTags.add(t)));
      // Render filters
      filters.innerHTML = ['All', ...Array.from(allTags)].map(tag => `
        <button data-tag="${tag}" class="px-3 py-1 rounded-full border text-sm hover:scale-[1.02] transition">
          ${tag}
        </button>
      `).join("");
      // Render cards
      const render = (tag = "All") => {
        grid.innerHTML = items
          .filter(p => tag === "All" || (p.tags || []).includes(tag))
          .map(p => `
            <article class="group rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur transition hover:shadow-lg">
              <div class="aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                ${p.image ? `<img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition">` : ''}
              </div>
              <h3 class="mt-4 text-lg font-semibold">${p.title}</h3>
              <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">${p.description}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                ${(p.tags || []).map(t => `<span class="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border">${t}</span>`).join("")}
              </div>
              <a href="${p.link || '#'}" target="_blank" class="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                View details <span aria-hidden>→</span>
              </a>
            </article>
          `).join("");
      };
      render();
      filters.addEventListener("click", (e) => {
        const tag = e.target?.dataset?.tag;
        if (!tag) return;
        render(tag);
        // active styles
        Array.from(filters.children).forEach(btn => btn.classList.remove("bg-black","text-white","dark:bg-white","dark:text-black"));
        e.target.classList.add("bg-black","text-white","dark:bg-white","dark:text-black");
      });
    });

  // Intersection reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0", "translate-y-4");
        entry.target.classList.add("opacity-100", "translate-y-0");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll("[data-reveal]").forEach(el => {
    el.classList.add("opacity-0", "translate-y-4", "transition", "duration-700");
    observer.observe(el);
  });
});
