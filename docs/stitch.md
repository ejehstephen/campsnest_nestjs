# CAMPSNEST 2.0 — STITCH DESIGN SYSTEM & UI REFERENCE SPECIFICATION

> **Stitch Project ID:** `17005767938099272656`  
> **Stitch Project URL:** [https://stitch.withgoogle.com/projects/17005767938099272656](https://stitch.withgoogle.com/projects/17005767938099272656)  
> **Theme Name:** Nocturne Campus Glass (Fidelity Dark)  
> **Primary Font:** `Plus Jakarta Sans` (Headlines & UI Labels) & `Inter` (Body text)  

---

## 1. Design System Overview & Tokens

### 1.1 Color Palette
* **Deep Base Canvas:** `#0B0819` (Midnight Void) and `#141122` (Deep Surface)
* **Surface Containers:**
  * Lowest: `#0F0C1D`
  * Low: `#1C192B`
  * Standard: `#201D2F`
  * High: `#2B283A`
  * Highest: `#363245`
* **Vibrant Accent Spectrum:**
  * **Primary (Electric Violet):** `#8B5CF6` / `#D0BCFF`
  * **Secondary (Neon Pink/Magenta):** `#EC4899` / `#FFB0CD`
  * **Tertiary (Electric Blue):** `#3B82F6` / `#ADC6FF`
* **Surface Overlays & Glass:**
  * Card Background: `rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)`
  * Glass Border: `1px solid rgba(255, 255, 255, 0.12)`
  * Backdrop Filter: `blur(16px)` to `blur(24px)`
* **Text & Contrast:**
  * Primary Headings: `#FFFFFF` / `#E6DFF8`
  * Secondary Body: `#CBC3D7` / `#94A3B8`
  * Muted / Meta: `#64748B` / `#958EA0`

### 1.2 Typography System
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero (Desktop)** | Plus Jakarta Sans | 56px | 800 (ExtraBold) | 64px | -0.03em |
| **Display Hero (Mobile)** | Plus Jakarta Sans | 36px | 800 (ExtraBold) | 44px | -0.02em |
| **Headline Lg (Desktop)** | Plus Jakarta Sans | 36px | 700 (Bold) | 44px | -0.02em |
| **Headline Lg (Mobile)** | Plus Jakarta Sans | 28px | 700 (Bold) | 36px | -0.02em |
| **Headline Md** | Plus Jakarta Sans | 24px | 600 (SemiBold) | 32px | -0.01em |
| **Headline Sm** | Plus Jakarta Sans | 20px | 600 (SemiBold) | 28px | normal |
| **Title Md** | Plus Jakarta Sans | 16px | 600 (SemiBold) | 24px | normal |
| **Body Lg** | Inter | 16px | 400 (Regular) | 26px | normal |
| **Body Md** | Inter | 14px | 400 (Regular) | 22px | normal |
| **Body Sm** | Inter | 12px | 400 (Regular) | 18px | normal |
| **Label Md** | Plus Jakarta Sans | 13px | 600 (SemiBold) | 18px | +0.02em |
| **Label Sm** | Plus Jakarta Sans | 11px | 700 (Bold) | 16px | +0.05em |

### 1.3 Corner Radii & Elevation
* **Buttons, Badges, Search Bars:** `rounded-full` (`9999px`)
* **Standard Content Cards:** `rounded-2xl` (16px – 24px)
* **Hero / Standout Cards:** `rounded-3xl` (28px – 32px)
* **Elevation & Halo Glows:**
  * Standard Card Glow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`
  * Interactive Hover Glow: `0 12px 32px -4px rgba(139, 92, 246, 0.25)`
  * Modal Glow: `0 24px 48px -12px rgba(0, 0, 0, 0.6)`

---

## 2. Screen Catalog & Responsive Mapping

The Stitch project contains paired **Desktop (1280px / 2560px canvas)** and **Mobile (390px / 780px canvas)** screens:

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│ Desktop View (12-col Sidebar Layout) │ Mobile View (4-col Bottom Nav Layout) │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ 1. Home Feed                          │ 1. Mobile Home Feed                   │
│ 2. Housing Discovery                  │ 2. Mobile Housing Discovery           │
│ 3. Housing Details                    │ 3. Mobile Housing Details             │
│ 4. Campus Market                      │ 4. Mobile Campus Market               │
│ 5. Product Details                    │ -                                     │
│ 6. Connect Portal                     │ -                                     │
│ 7. Connect Questionnaire              │ -                                     │
│ 8. Match Results                      │ -                                     │
│ 9. Match Reveal (Confetti/Hearts)     │ 5. Mobile Match Reveal                │
│ 10. Student Profile                   │ 6. Mobile Student Profile             │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 3. Screen-by-Screen Detailed Breakdown

### 3.1 Home Feed
* **Desktop Screen ID:** `e7e54fe95b6a49f883e9c19ae5477b07` (2560×4626)
* **Mobile Screen ID:** `1e6eb57333d64bbc8f05eaf20e1ecc07` (780×4058)
* **Visual Components:**
  * Top navigation bar with campus selector, search input, notification bell, and user avatar.
  * Hero banner with glowing electric violet-to-pink gradient, animated blobs, and primary CTAs (*"Explore Housing"*, *"Browse Market"*, *"Meet People"*).
  * Quick action cards row (Find House, Sell Item, Take Quiz, Roommate Match).
  * Horizontal scrolling carousel for **Trending on Campus** & **Top Marketplace Picks**.
  * Dynamic grid for **New Housing Listings** with price tags, distance, and verified host badges.
  * **Connect Activity Teaser** with floating emoji chips (`🎧 Afrobeats`, `🌙 Night Owl`, `📚 Study Grind`).

### 3.2 Housing Discovery
* **Desktop Screen ID:** `a73d413e4ad34cac89f6aa1823d76561` (2560×3674)
* **Mobile Screen ID:** `9a0885c820f145fca04204819bd947de` (780×2946)
* **Visual Components:**
  * Header with title *"Find Your Nest 🏡"* and location/campus filter dropdown.
  * Horizontal filter pills: *All*, *Self-Contain*, *Single Room*, *Shared Flat*, *Under ₦150k*, *Walking Distance*.
  * Multi-column listing grid (3 columns on desktop, 1 column on mobile).
  * Listing card features:
    * High-res image carousel with badge overlays (*Verified Host*, *Available Now*).
    * Price in bold font (e.g. `₦180,000 / year`).
    * Proximity indicator (`📍 5 mins from North Gate`).
    * Amenity tags (`⚡ 24/7 Light`, `💧 Running Water`, `🛡️ Security`).
    * Quick bookmark heart and share icon.

### 3.3 Housing Details
* **Desktop Screen ID:** `8e37f866776d42c1b9a8d96008c88de6` (2560×4076)
* **Mobile Screen ID:** `7ad05a8ccf9c4510a3618d4f014c2924` (780×4546)
* **Visual Components:**
  * Large panoramic hero image gallery with thumbnail previews and photo counter.
  * Host profile card with verified checkmark, rating, and member date.
  * Sticky booking card:
    * Inspection date & time slot picker.
    * Inspection fee breakdown (`₦1,000 Admin/Inspection fee`).
    * CTA: *"Request Physical Inspection"*.
    * Security banner: *"Safety First: Never pay accommodation fees online without a physical inspection."*
  * Detailed amenities checklist with custom glowing status icons.
  * House rules and curfew policy accordion.

### 3.4 Campus Marketplace
* **Desktop Screen ID:** `1c24e0160bca4efe81dd7e92f1a3311c` (2560×2432)
* **Mobile Screen ID:** `4318fd4729044f99b56a1fdb33c6b91a` (780×2426)
* **Visual Components:**
  * Campus market search bar with category icon pills: *Electronics*, *Laptops*, *Books*, *Hostel Essentials*, *Fashion*, *Gaming*.
  * Responsive 4-column product grid (desktop) / 2-column grid (mobile).
  * Product card layout:
    * 1:1 square image preview.
    * Condition pill (*New*, *Like New*, *Fairly Used*).
    * Title, Price (`₦35,000`), and campus pickup location (`Hostel Block B`).
    * Seller mini-avatar and posted timestamp.
  * Floating action button on mobile: *"Sell an Item 🛒"*.

### 3.5 Marketplace Product Details
* **Desktop Screen ID:** `2bf11ec879cc485aa177144551d73665` (2560×4818)
* **Visual Components:**
  * Multi-image thumbnail gallery.
  * Item condition assessment with clear bullet points.
  * Verified student seller badge with department and university.
  * In-app chat CTA: *"Message Seller"*.
  * Safety disclaimer: *"Meet in daylight in a public campus location (e.g. Student Center or Faculty Gate)."*

### 3.6 Connect Portal & Questionnaire
* **Portal Screen ID:** `8ddc57414a1b4c969850b82d396b91f1` (2560×3152)
* **Questionnaire Screen ID:** `419dd99869bd4d679260d6f6de2ae235` (2560×2956)
* **Visual Components:**
  * Luminous cosmic hero: *"Meet People Who Match Your Vibe 💕"*.
  * 10-step progress bar with glowing active pip.
  * Card-based interactive question choices with emoji accents (e.g., Weekend plans: *🎬 Netflix & Chill*, *🎉 Campus Parties*, *📚 Library Marathon*, *😴 Catching Sleep*).
  * Smooth micro-transition animations on option selection.

### 3.7 Match Results & Screenshot-Worthy Match Reveal
* **Match Results Screen ID:** `c8eacd65c33a492e9c77f2f4f59c1c55` (2560×3044)
* **Desktop Match Reveal Screen ID:** `c07ffa236e8140dea1c06e5f35e9e9bf` (2560×2676)
* **Mobile Match Reveal Screen ID:** `e9dd92bef0d04fd3939fb986e3e11de9` (780×2714)
* **Visual Components:**
  * Dual-avatar glowing alignment with compatibility score badge (e.g. `94% Match ✨`).
  * Confetti particles and floating heart emojis (`💜`, `✨`, `🎧`, `☕`).
  * Shared interests tag cloud (`Afrobeats`, `Night Owl`, `Coffee Lover`, `Code & Chill`).
  * Primary Action: Gradient pill button *"Say Hello 👋"* (immediately launches contextual chat).
  * Secondary Action: *"Keep Swiping"*.

### 3.8 Student Profile
* **Desktop Screen ID:** `48ea0612d3f7461ea0ea940424d7233b` (2560×3528)
* **Mobile Screen ID:** `70adfd79a0324522a541f691a023a367` (780×3820)
* **Visual Components:**
  * Large circular avatar with neon border ring and verified student badge.
  * Academic info banner: `Computer Science • Federal University Wukari • 300 Level`.
  * Profile stats ribbon: `12 Market Items Sold` | `4 Saved Houses` | `18 Connections`.
  * Tab navigation: *My Listings*, *Saved Houses*, *Saved Items*, *Connections*, *Settings*.
  * Privacy toggles: Discovery visibility, Marketplace seller mode, Contact preferences.

---

## 4. Responsive Layout Strategy for Next.js

```
┌────────────────────────────────────────────────────────────────────────┐
│ Desktop Viewport (>= 1024px)                                          │
│ ┌───────────────┬────────────────────────────────────────────────────┐ │
│ │ Fixed Sidebar │ Main Content Canvas (Scrollable)                   │ │
│ │ - Logo        │ ┌────────────────────────────────────────────────┐ │ │
│ │ - Nav Links   │ │ Top Bar (Search, Campus Select, Avatar)       │ │ │
│ │ - Quick CTA   │ ├────────────────────────────────────────────────┤ │ │
│ │ - Profile/Set │ │ Dynamic Page Content (12-Col Responsive Grid) │ │ │
│ │               │ └────────────────────────────────────────────────┘ │ │
│ └───────────────┴────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ Mobile Viewport (< 1024px)                                            │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Mobile Top Header (Logo, Campus Dropdown, Notifications)           │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ Dynamic Mobile Content (Single/Dual Column, Touch-friendly)        │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ Floating Frosted Bottom Navigation Bar                             │ │
│ │ [ ⌂ Home  |  🏠 Housing  |  🛒 Market  |  💕 Connect  |  👤 Profile ] │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Summary & Implementation Alignment

All visual styles, component behaviors, gradients, typography, and responsive structures from Stitch project `17005767938099272656` are strictly aligned with:
1. [project.md](file:///c:/Users/Ejeh%20Stephen/campsnest/campsnest%20v2/docs/project.md) (Product & Rebranding Specs)
2. [USER_FLOWS.md](file:///c:/Users/Ejeh%20Stephen/campsnest/campsnest%20v2/docs/USER_FLOWS.md) (All 9 User Journeys)
3. [DATABASE.md](file:///c:/Users/Ejeh%20Stephen/campsnest/campsnest%20v2/docs/DATABASE.md) (Supabase Schema & Tables)
4. [FEATURE_ROADMAP.md](file:///c:/Users/Ejeh%20Stephen/campsnest/campsnest%20v2/docs/FEATURE_ROADMAP.md) (Phased Implementation Plan)
