# Cloudflare Workers Fullstack Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/myschoolstory/sketchdrop)

A production-ready boilerplate for building fullstack applications on Cloudflare Workers. Combines a powerful backend with Durable Objects for stateful entities and a modern React frontend with shadcn/ui.

## Features

- **Backend**: Cloudflare Workers with Hono routing, Durable Objects for scalable entity storage (users, chats, messages), indexed listing, CRUD operations
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui components, TanStack Query, React Router
- **Shared Types**: Type-safe API with shared TypeScript types between frontend and backend
- **Entity System**: Pre-built entity classes for users and chat boards with indexing, pagination, transactions
- **Development**: Hot reload for both frontend and backend, Bun-powered scripts
- **Deployment**: One-command deploy to Cloudflare Workers with SPA asset handling
- **UI/UX**: Dark mode, responsive design, animations, sidebar layout, theme toggle
- **Error Handling**: Client/server error reporting, boundaries, TanStack Query devtools-ready

Demo endpoints: `/api/users`, `/api/chats`, `/api/chats/:id/messages`

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Hono, Durable Objects, TypeScript |
| **Frontend** | React 18, Vite, Tailwind CSS, shadcn/ui, Lucide Icons |
| **State** | TanStack Query, Zustand, Immer, React Hook Form, Zod |
| **UI Utils** | Framer Motion, Headless UI, Radix UI, Class Variance Authority |
| **Data** | Date-fns, UUID |
| **Dev Tools** | Bun, ESLint, TypeScript, Wrangler |

## Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed
   - [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated (`wrangler login`)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   bun install
   ```

3. **Run Locally**:
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

## Development

- **Frontend**: `src/` – Edit React components, pages in `src/pages/`
- **Backend**: `worker/` – Add routes in `worker/user-routes.ts`, entities in `worker/entities.ts`
- **Shared**: `shared/` – Types, mock data
- **Hot Reload**: Auto-reloads on changes. Backend routes lazy-load.
- **Type Generation**: `bun run cf-typegen` for Worker bindings.
- **Lint**: `bun run lint`
- **Preview**: `bun run preview`

### Customizing

- **Add Entities**: Extend `IndexedEntity` in `worker/entities.ts`, add routes in `user-routes.ts`
- **API Calls**: Use `api()` from `src/lib/api-client.ts` (TanStack Query integrated)
- **UI**: Install shadcn components via `components.json` aliases (`@/components/ui/*`)
- **Sidebar**: Customize `src/components/app-sidebar.tsx`, use `AppLayout` in pages
- **Theme**: Toggle via `ThemeToggle`, uses `useTheme` hook
- **Seed Data**: Auto-seeds on first API call via `ensureSeed`

Example API Usage (React):
```tsx
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';

const users = await api<User[]>('/api/users');
```

## Deployment

Deploy to Cloudflare Workers with a single command:

```bash
bun run deploy
```

- Builds frontend assets (`bun run build`)
- Deploys Worker with SPA routing (`assets` in `wrangler.jsonc`)
- Sets up Durable Objects automatically

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/myschoolstory/sketchdrop)

**Post-Deploy**:
- View logs: `wrangler tail`
- Custom Domain: `wrangler deploy --name production`
- Config: Edit `wrangler.jsonc`

## Project Structure

```
├── shared/          # Shared types & mocks
├── src/             # React frontend
│   ├── components/  # shadcn/ui + custom
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utils, API client
│   └── pages/       # Router pages
├── worker/          # Cloudflare Worker backend
│   ├── core-utils.ts # DO entity system (DO NOT MODIFY)
│   ├── entities.ts  # Your entities
│   └── user-routes.ts # Add routes here
├── package.json     # Bun scripts
└── wrangler.jsonc   # Worker config
```

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Build frontend |
| `bun run preview` | Local preview |
| `bun run deploy` | Deploy to Cloudflare |
| `bun run lint` | Lint code |
| `bun run cf-typegen` | Generate Worker types |

## License

MIT – Feel free to use in commercial projects. See [LICENSE](LICENSE) for details.

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

Built with ❤️ for Cloudflare Workers.