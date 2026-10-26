# Image prompts (ChatGPT image generation)

Drop each exported image into `public/` at the path shown. As soon as a file exists, the site uses it in place of the placeholder; no code change is needed.
Shared style for all prompts: *soft pastel palette (sky blue #a8d8ff, blush #ffb6d9, lavender #cdb8ff, mint #bff0e0), clean product-design presentation, subtle film grain, no text or logos, no people's faces.*

| File | Size | Prompt |
|---|---|---|
| `public/images/projects/retirement-portal.webp` | 1600×940 | A desktop web dashboard for a US retirement participant portal with an AI search bar and result cards, floating at a slight angle on a pastel lavender-to-sky gradient, soft shadows, product mockup style |
| `public/images/projects/retirement-mobile.webp` | 1600×940 | Two iPhone screens of a retirement savings app (balance chart, contribution slider) floating on a blush-to-lavender gradient, product mockup style |
| `public/images/projects/ir-ai-search.webp` | 1600×940 | An enterprise AI search interface for investor relations: command palette with document results and citations, glassy UI on a sky-to-mint gradient |
| `public/images/projects/crm-platform.webp` | 1600×940 | A CRM task-management dashboard with kanban columns and activity charts, laptop mockup on a butter-yellow-to-blush gradient |
| `public/images/projects/magnil.webp` | 1600×940 | An Android app for factory employee daily task tracking (check-in, task list, progress ring) held at an angle, mint-to-sky gradient background |
| `public/images/projects/food-delivery.webp` | 1600×940 | A food delivery app with live order-tracking map and order status steps, two phones on a peach-to-blush gradient |
| `public/images/projects/ecommerce.webp` | 1600×940 | A minimal e-commerce storefront website with product grid and a calm checkout panel, browser mockup on a lavender-to-butter gradient |
| `public/images/archive/archive-1..6.webp` | various | Six single UI screens (settings page, onboarding card, analytics widget, mobile login, notification list, profile) in the same pastel style, each on its own soft background |
| `public/images/ai-workflow-hero.webp` | 1200×800 | A human hand and a soft 3D robot hand almost touching, pastel lavender and sky light, minimal, airy |

Portraits stay as placeholders until you send real photos:
- `public/images/portrait.webp` (4:5) for the hero polaroid
- `public/images/about-portrait.webp` (4:5) for the About polaroid

Convert exports to webp with: `npx sharp-cli -i in.png -o out.webp resize 1600` (or any image tool).
