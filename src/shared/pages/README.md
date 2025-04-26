# Reminder: Database-Driven Page Management & Permissions

This project uses a custom structure for managing both static and dynamic pages under `src/shared/pages`. The plan is to eventually:

- Store page metadata (paths, permissions, menu/sidebar inclusion, etc.) in the database.
- Use a loader component to dynamically render pages and menus based on user permissions and DB data.
- Ensure that permissions are enforced at the page/component level, since not every static page has the same access requirements.
- Consider SEO implications if public-facing: implement SSR or SSG as needed.

**TODOs:**
- [ ] Design a database schema for pages and permissions.
- [ ] Implement a loader that reads page metadata from the DB.
- [ ] Map file paths to DB entries for route resolution.
- [ ] Add dynamic permission checks in the loader.
- [ ] (If SEO is important) Ensure server-side rendering for dynamic/static pages.

---

_This file is a reminder to set up database-driven page management and permission control in the future. Adjust structure and implementation as needed for your framework and use case._
