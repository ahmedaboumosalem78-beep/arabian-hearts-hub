<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Site content (services, coverage areas, posts, phone numbers) lives in `src/lib/site.ts` and `src/lib/content.ts` — keeps copy editable and CMS-ready.
- Page metadata is built with `pageMeta()` / JSON-LD helpers in `src/lib/seo.ts` so every route stays SEO-consistent.
- Shared UI lives in `src/components/site/`; the root route renders Header, Footer and the sticky call/WhatsApp bars once.
