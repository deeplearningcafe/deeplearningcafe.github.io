# deeplearningcafe.github.io

Personal research portfolio of **aipracticecafe** (Víctor Rodrigo González / Deep Learning Café) and static GitHub Pages hub for generative AI research projects.

- **Live Portfolio:** [`https://deeplearningcafe.github.io/`](https://deeplearningcafe.github.io/)
- **Featured Paper Page (Asuka-FM):** [`https://deeplearningcafe.github.io/projects/asuka-fm/`](https://deeplearningcafe.github.io/projects/asuka-fm/)

## Hosted Projects
- **Asuka-FM** ([`/projects/asuka-fm/`](https://deeplearningcafe.github.io/projects/asuka-fm/)) — *A System-Architectural Co-Design Framework for Efficient Text-to-Image Pretraining on Consumer Hardware* (206M Dual-Stream SPRINT DiT trained from scratch on a single RTX 4090).

## Repository Structure
```text
deeplearningcafe.github.io/
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── .gitignore
├── index.html              # Portfolio landing page (focusing on Asuka-FM)
├── README.md
└── projects/
    └── asuka-fm/           # Asuka-FM project site (index.html, style.css, app.js, images/)
```

## Local Preview
From the repository root, start a local HTTP server (avoid opening `index.html` via `file://`, as relative scripts and assets require HTTP):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/` (or `http://localhost:8000/projects/asuka-fm/`).

## Links
- **GitHub:** [github.com/deeplearningcafe](https://github.com/deeplearningcafe)
- **Hugging Face:** [huggingface.co/aipracticecafe](https://huggingface.co/aipracticecafe)
- **Zenn:** [zenn.dev/fuwamoekissaten](https://zenn.dev/fuwamoekissaten)
- **X (Twitter):** [x.com/aipracticecafe](https://x.com/aipracticecafe)
