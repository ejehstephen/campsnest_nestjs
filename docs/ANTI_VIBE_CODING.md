# CAMPSNEST 2.0 — ANTI-VIBE-CODING UI/UX REFINEMENT PROMPT

You are working on an EXISTING, FUNCTIONAL CampsNest 2.0 application.

IMPORTANT:
DO NOT rebuild the application from scratch.
DO NOT replace the existing architecture.
DO NOT replace the existing Supabase backend.
DO NOT create duplicate database tables.
DO NOT remove existing working functionality.
DO NOT change business logic unless absolutely necessary to fix a UI/UX issue.

Your job is to AUDIT, REFINE, and POLISH the existing interface so that CampsNest 2.0 feels like a professionally designed real-world product rather than an AI-generated/vibe-coded website.

The existing Stitch design specification is a VISUAL REFERENCE, NOT A RULE THAT EVERY EFFECT MUST BE USED.

The goal is:

"Premium, modern, student-focused, distinctive, practical, and believable."

NOT:

"Generic AI SaaS landing page."

==================================================
1. FIRST: AUDIT THE EXISTING APPLICATION
==================================================

Before modifying code:

1. Inspect the current project structure.
2. Inspect the existing components.
3. Inspect the existing pages/routes.
4. Inspect the existing Supabase integration.
5. Inspect the existing authentication flow.
6. Inspect existing housing functionality.
7. Inspect existing marketplace functionality.
8. Inspect existing Connect/matching functionality.
9. Inspect existing profile functionality.
10. Inspect the existing responsive behavior.
11. Inspect the current design implementation.

Read these documentation files before making changes:

- docs/project.md
- docs/USER_FLOWS.md
- docs/DATABASE.md
- docs/FEATURE_ROADMAP.md
- docs/STITCH.md

Do not make assumptions about existing functionality when it can be inspected directly.

==================================================
2. PRIMARY DESIGN OBJECTIVE
==================================================

Make CampsNest look like a REAL PRODUCT built by an experienced product/design team.

The interface should feel:

- intentional
- clean
- polished
- human-designed
- student-focused
- trustworthy
- practical
- visually memorable
- consistent
- fast
- easy to understand

Avoid the visual patterns commonly associated with AI-generated interfaces.

The design should have personality, but personality must come from CampsNest's product identity and content, NOT from adding random visual effects.

==================================================
3. IMPORTANT: REDUCE THE "AI-GENERATED" LOOK
==================================================

Audit the entire application for excessive use of:

- gradients
- glassmorphism
- glowing borders
- glowing cards
- excessive rounded corners
- excessive pill buttons
- excessive floating elements
- excessive emojis
- decorative blobs
- unnecessary animations
- excessive shadows
- gradient text
- neon effects
- oversized typography
- generic hero sections
- generic SaaS copy
- repetitive card layouts
- excessive empty space
- decorative elements that do not communicate information

REMOVE, REDUCE, OR SIMPLIFY these where they do not improve usability.

Do not remove the CampsNest visual identity.

Instead, create a hierarchy.

==================================================
4. GRADIENT RULE
==================================================

CampsNest uses violet, blue and pink as brand colors.

KEEP the brand gradient.

However:

The gradient should be an ACCENT, not the entire interface.

Use gradients primarily for:

- important hero areas
- primary CTA emphasis
- selected states
- match reveal
- special promotional sections
- subtle decorative brand moments

Do NOT use gradients on every card, every button, every heading, every section, or every background.

The majority of the application should have clean surfaces and strong content hierarchy.

The user should notice the CampsNest brand, not the CSS effects.

==================================================
5. GLASSMORPHISM RULE
==================================================

Glass effects should be used sparingly.

Do NOT make every component glass.

Avoid:

glass card inside glass card inside glass modal.

Use solid or subtle surfaces for most content.

Housing cards, marketplace cards, profile sections, forms and normal application content should prioritize:

- readability
- hierarchy
- spacing
- imagery
- useful information

rather than decorative effects.

==================================================
6. CARDS MUST HAVE A PURPOSE
==================================================

Audit every card.

Ask:

"What information does this card communicate?"

If a card exists only because "modern websites use cards", simplify it.

Avoid excessive nested cards.

Avoid putting a card inside another card unless there is a strong UX reason.

Housing listings should prioritize:

IMAGE
↓
PRICE
↓
LOCATION
↓
KEY INFORMATION
↓
ACTION

Marketplace listings should prioritize:

IMAGE
↓
ITEM
↓
PRICE
↓
CONDITION
↓
LOCATION/SELLER

Do not bury useful information under decoration.

==================================================
7. EMOJI RULE
==================================================

Emojis are part of the CampsNest personality, especially in Connect.

However, emojis must NOT appear everywhere.

Good uses:

Connect:
💕 🎧 ☕ 📚 ✨

Match reveal:
💜 ✨ 🎉

Occasional category indicators.

Bad uses:

"Find Your Nest 🏡"
"Market 🛒"
"Profile 👤"
"Settings ⚙️"
"Search 🔍"
"Verified ✅"
"Location 📍"

on every single element.

Prefer Lucide icons or another consistent icon system for functional UI.

Emojis should communicate personality, not replace interface design.

==================================================
8. TYPOGRAPHY
==================================================

Keep the existing typography direction:

- Plus Jakarta Sans for major headings/UI emphasis
- Inter for body content

But avoid making every heading huge.

Create a clear hierarchy.

Headings should feel confident but realistic.

Do not use:

- giant text everywhere
- gradient text everywhere
- excessive font weights
- unnecessarily tight letter spacing

Readable typography is more important than visual drama.

==================================================
9. BUTTONS
==================================================

Not every button should be a giant gradient pill.

Create a proper button hierarchy:

PRIMARY:
Strong CampsNest brand treatment.

SECONDARY:
Subtle surface/outline treatment.

TERTIARY:
Text or icon action.

DESTRUCTIVE:
Clear danger treatment.

Buttons should communicate importance.

Do not make every possible action visually dominant.

==================================================
10. NAVIGATION
==================================================

Navigation should be extremely clear.

Core CampsNest navigation:

Home
Housing
Market
Connect
Profile

Desktop:

Use a clean persistent sidebar/navigation system where appropriate.

Mobile:

Use the bottom navigation.

The active navigation item should be obvious without excessive glowing effects.

Navigation must feel like a real application rather than a marketing landing page.

==================================================
11. HOUSING EXPERIENCE
==================================================

Housing is one of CampsNest's most important features.

The design should prioritize TRUST.

Housing listings should feel practical and informative.

Prioritize:

- real house images
- price
- location
- availability
- house type
- amenities
- distance
- verification status
- inspection information

Avoid making housing listings look like generic SaaS cards.

The house itself should be the visual focus.

The user should immediately understand:

"What is this house?"
"How much is it?"
"Where is it?"
"Is it available?"
"What do I do next?"

==================================================
12. MARKETPLACE EXPERIENCE
==================================================

The Market should feel like a REAL student marketplace.

Prioritize:

- product photography
- price
- item condition
- seller
- location
- category

Do not overdecorate product cards.

Images should carry most of the visual weight.

Make browsing feel natural and familiar.

==================================================
13. CONNECT EXPERIENCE
==================================================

Connect can be the most playful section of CampsNest.

This is where more personality is allowed.

Use:

- emojis
- playful micro-interactions
- compatibility animations
- match reveal
- subtle hearts
- shared-interest visuals

BUT:

Keep the actual questionnaire extremely clean.

The questionnaire should feel like a polished consumer product.

Avoid turning every question into a neon/glass/gradient spectacle.

The Match Reveal can be visually special because it is a meaningful emotional moment.

==================================================
14. PROFILE
==================================================

Profile should feel useful and trustworthy.

Prioritize:

- profile identity
- academic information
- privacy
- listings
- saved items
- saved houses
- connections
- settings

Avoid unnecessary decorative elements.

The profile should feel like a student's actual account rather than a fictional SaaS user dashboard.

==================================================
15. REAL CONTENT OVER DECORATION
==================================================

Whenever possible, use realistic CampsNest content structures.

Avoid:

"Empower your journey."
"Discover endless possibilities."
"Connect. Discover. Experience."

and other generic AI marketing language.

CampsNest copy should sound like something students actually say.

Use clear language such as:

"Find a place near campus."
"See what's available."
"Sell what you no longer need."
"Find students who match your vibe."
"Request an inspection."

Simple language is better.

==================================================
16. SPACING
==================================================

Create a consistent spacing system.

Do not randomly use:

16px here
37px there
53px somewhere else
84px somewhere else

Use a consistent spacing scale.

Sections should breathe, but avoid excessive empty space.

Cards should not feel unnecessarily large.

The application should feel information-rich without feeling crowded.

==================================================
17. BORDER RADIUS
==================================================

Do not make every element extremely rounded.

Use different radii intentionally.

Examples:

Buttons:
Moderately rounded.

Inputs:
Moderately rounded.

Cards:
16–20px approximately.

Large feature sections:
24–28px where appropriate.

Avoid making the entire application look like a collection of floating bubbles.

==================================================
18. SHADOWS AND GLOW
==================================================

Reduce excessive glow.

Most normal cards should use subtle elevation.

Glow should be reserved for:

- important interactive states
- match reveal
- special brand moments
- selected states

The application should still look good if all glow effects are removed.

==================================================
19. ANIMATIONS
==================================================

Animations must serve UX.

GOOD:

- subtle page transitions
- hover states
- button feedback
- loading states
- image transitions
- match reveal
- notification feedback

BAD:

- constant floating objects
- cursor-following effects everywhere
- excessive parallax
- unnecessary bouncing
- decorative animations that affect performance

Respect CampsNest's performance goal.

The application must feel fast.

==================================================
20. RESPONSIVE DESIGN
==================================================

Treat mobile as a FIRST-CLASS EXPERIENCE.

Do not simply shrink desktop.

Audit the application at:

390px
414px
768px
1024px
1280px
1440px+

Check:

- navigation
- cards
- images
- forms
- typography
- buttons
- spacing
- bottom navigation
- modals
- filters
- listing details

Nothing should overflow or feel cramped.

==================================================
21. ACCESSIBILITY
==================================================

Improve:

- text contrast
- focus states
- keyboard navigation
- button labels
- form labels
- image alt text
- touch target sizes
- semantic HTML

Do not sacrifice accessibility for aesthetics.

==================================================
22. PERFORMANCE
==================================================

CampsNest 2.0 is specifically being rebuilt to improve the heavy/slow experience of the previous Flutter Web application.

Therefore:

Avoid unnecessary JavaScript.

Avoid unnecessary animations.

Lazy-load images.

Optimize images.

Avoid rendering large lists unnecessarily.

Use appropriate caching.

Do not add libraries simply for decorative effects.

Every dependency must have a reason.

==================================================
23. CONSISTENCY AUDIT
==================================================

Audit the entire application for inconsistencies in:

- colors
- typography
- spacing
- icons
- button styles
- card styles
- input styles
- border radius
- shadows
- loading states
- empty states
- error states

Create reusable design primitives where appropriate.

Do not create five different versions of the same button.

==================================================
24. DO NOT OVERENGINEER
==================================================

Do not introduce unnecessary:

- component abstractions
- libraries
- animation frameworks
- state management systems
- database changes
- API changes

Prefer simple maintainable solutions.

Existing functionality is more important than architectural experimentation.

==================================================
25. IMPORTANT: PRESERVE THE STITCH IDENTITY
==================================================

The Stitch design specification contains the intended visual direction:

- Midnight/dark visual system
- Violet
- Pink
- Blue
- Plus Jakarta Sans
- Inter
- Modern student platform
- Glass accents
- Responsive desktop/mobile layouts

KEEP THIS IDENTITY.

But reinterpret it with restraint.

The goal is:

STITCH DESIGN LANGUAGE
+
REAL PRODUCT UX
+
CAMPSNEST PERSONALITY
+
LESS VISUAL NOISE

==================================================
26. FINAL QUALITY TEST
==================================================

After refinement, evaluate every page using these questions:

1. Does this look like a real product?
2. Does it look intentionally designed?
3. Is the content more important than the effects?
4. Can a student understand the page immediately?
5. Are gradients being used intentionally?
6. Are glass effects necessary?
7. Are emojis being used intentionally?
8. Are there too many pills?
9. Are there too many cards?
10. Is there unnecessary animation?
11. Does it feel like CampsNest rather than a generic AI SaaS template?
12. Does it work beautifully on mobile?
13. Is it fast?
14. Does the interface inspire trust?
15. Would I believe this product was designed by a professional product team?

If the answer to any of these is NO, refine the interface.

==================================================
27. DEVELOPMENT PROCESS
==================================================

Do NOT modify everything blindly.

Work in stages:

PHASE 1:
Audit the existing UI.

PHASE 2:
Identify the biggest sources of "AI/vibe-coded" appearance.

PHASE 3:
Create a short prioritized list of improvements.

PHASE 4:
Refine the global design system first.

PHASE 5:
Refine navigation and shared components.

PHASE 6:
Refine Home.

PHASE 7:
Refine Housing.

PHASE 8:
Refine Market.

PHASE 9:
Refine Connect.

PHASE 10:
Refine Profile.

PHASE 11:
Audit mobile responsiveness.

PHASE 12:
Audit performance and accessibility.

IMPORTANT:
After each major phase, verify that existing functionality still works.

Do not replace working functionality just to make the UI look different.

==================================================
FINAL INSTRUCTION
==================================================

CampsNest should NOT look like:

"An AI generated website showing off gradients, glassmorphism and animations."

CampsNest SHOULD look like:

"A polished student platform that happens to have a beautiful visual identity."

Design with restraint.

Prioritize product usability over visual effects.

Prioritize real content over decoration.

Prioritize trust over hype.

Prioritize performance over animation.

Prioritize consistency over novelty.

Make CampsNest 2.0 feel like a product that could genuinely be used by thousands of students.