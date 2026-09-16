![](title%202.png)
### Ted Song · @kitae0522

Solo product builder based in Seoul. I take a problem from the first question to a product that is actually running — and these days I do it with coding agents as the other half of the keyboard.

That last part shapes how I build. When a model sits in the middle of a product, most of my design time goes into deciding **what the model is not allowed to decide**.

---

#### 🔨 Building now

**[Palate](https://palate.one)** — restaurant search, reviews, and curation · [status](https://status.palate.one)

- Go API (pgx, sqlc, goose migrations) with a Next.js App Router web served from Cloudflare Workers through OpenNext
- PostgreSQL with pgvector for retrieval, Redis for budgets and rate limits
- **Pro Search** splits the work deliberately: the LLM only extracts search intent, while the server builds the plan, filters and ranks candidates, and owns every citation. A saved place counts as evidence only when the pipeline can prove how it was found.

**Qletter** — a YouTube report SaaS that turns subscribed channels into cited, searchable reports.

- Rust backend (axum, sqlx, tokio) behind an event-driven worker fleet: relay, scheduler, discovery, media, ASR, barrier, report
- Redis Streams for delivery only — PostgreSQL with pgvector stays the single source of truth
- Every stage retries on its own, so a failed transcript never turns into a silently wrong report

#### 🧭 What I keep coming back to

- **Take the pen away from the model.** Writing the sentence and owning the fact should not be the same component.
- **Candidates are not evidence.** Discovery and proof are different steps, and the product should say which one it did.
- **If I can't operate it, I don't understand it.** Which is how a 16GB LG Gram ended up as a NixOS home server running four self-hosted GitHub Actions runners.

#### 🛠 Tools I reach for

<p>
  <img alt="Go" src="https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white"/>
  <img alt="Rust" src="https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white"/>
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img alt="Bun" src="https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white"/>
</p>
<p>
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img alt="Redis" src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white"/>
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/>
  <img alt="Cloudflare" src="https://img.shields.io/badge/Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white"/>
  <img alt="Nix" src="https://img.shields.io/badge/Nix-5277C3?style=flat-square&logo=nixos&logoColor=white"/>
  <img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white"/>
</p>

#### 🧰 Other things I've built

- **[hangul-recognition](https://github.com/kitae0522/hangul-recognition)** — a Hangul syllable recognizer. I generated the 117,500-image dataset myself from 50 handwriting fonts, shrank a VGG19 by 39%, hit ~99% accuracy, and served it behind an API.
- **[Facial-Expression-Recognition](https://github.com/kitae0522/Facial-Expression-Recognition)** — a Korean facial-expression classifier on a modified ResNet50 that beat the stock model by 21 points on the same data.
- **[Snake-RL](https://github.com/kitae0522/Snake-RL)** — a DQN agent that learns to play Snake from scratch. The training run is on video.
- **[Bugs2Spotify](https://github.com/kitae0522/Bugs2Spotify)** — moves a Bugs playlist into a real Spotify playlist, for music that only ever lived on one service.
- **[e2e-chat-rs](https://github.com/kitae0522/e2e-chat-rs)** — a 1:1 E2EE chat written to learn where the crypto boundaries actually sit.
