# CAMPSNEST 2.0 — PRODUCT REDESIGN & REBRANDING

I am rebuilding CampsNest from scratch as CampsNest 2.0.

The previous application was built with Flutter Web and Supabase in C:\Users\Ejeh Stephen\campsnest\Houe-roomate-finding, go through it in details. The new version should be built as a modern, fast, responsive web application for web and mobile using:

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- shadcn/ui where appropriate

IMPORTANT:
The goal is not to recreate the old Flutter UI. This is a complete visual and product redesign while preserving useful existing business logic and Supabase data where applicable.

====================================================
PRODUCT OVERVIEW
====================================================

CampsNest is evolving from a student housing platform into a year-round student living, marketplace, and social connection platform.

The platform should give students reasons to return even outside accommodation/rent seasons.

Core areas:

1. Home
2. Housing
3. Market
4. Connect
5. Profile

The application should feel like a premium modern Gen-Z student platform.

It should NOT look like a traditional real estate website.

It should feel:

- Modern
- Social
- Youthful
- Premium
- Friendly
- Trustworthy
- Fast
- Visually exciting
- Mobile-first

The platform combines student housing, P2P marketplace, roommate matching and social connection.

====================================================
BRAND
====================================================

Brand Name:

CampsNest

Version:

CampsNest 2.0

Suggested brand message:

"Your Campus. Your Space. Your People."

Alternative messaging can include:

"Everything campus living, in one place."

The CampsNest logo should remain recognizable but can be modernized in the new interface.

====================================================
VISUAL DESIGN DIRECTION
====================================================

Use the attached landing page design as the primary visual inspiration.

The design should use:

- Deep purple backgrounds
- Blue-purple gradients
- Soft pink/magenta accent gradients
- Glassmorphism
- Subtle blur effects
- Soft glowing elements
- Rounded cards
- Modern typography
- Smooth animations
- Minimal but expressive icons

The visual identity should feel similar to a modern startup landing page.

DO NOT copy the exact design.

Instead, translate the aesthetic into a unique CampsNest design system.

Primary visual direction:

Deep background:
Dark navy / deep purple.

Accent gradients:
Purple → Blue → Pink / Magenta.

Cards:
Semi-transparent glass cards with subtle borders and background blur.

Buttons:
Rounded pill buttons with gradients or subtle glow.

Use shadows carefully.

Avoid excessive visual clutter.

====================================================
DESIGN SYSTEM
====================================================

Create a reusable design system.

Border radius:

- Small components: rounded-lg
- Cards: rounded-2xl
- Important feature cards: rounded-3xl

Spacing:

Generous whitespace.

Typography hierarchy:

Large bold headlines.
Clean readable body text.
Strong section titles.

Buttons:

Primary:
Gradient purple/pink button.

Secondary:
Glass / outlined button.

Danger:
Minimal red treatment.

Cards should have:

- subtle border
- translucent background
- backdrop blur
- hover animation
- slight elevation

Animations:

Use subtle Framer Motion animations where appropriate.

Examples:

- Fade in
- Slide up
- Scale slightly on hover
- Smooth page transitions
- Skeleton loading states

Animations should feel premium but never slow down the application.

====================================================
RESPONSIVE DESIGN
====================================================

The application must be mobile-first.

Desktop:
Use a modern dashboard layout with a sidebar.

Mobile:
Use a bottom navigation bar.

Mobile bottom navigation:

⌂ Home
🏠 Housing
🛒 Market
💕 Connect
👤 Profile

The active tab should have:

- glowing gradient icon
- subtle pill background
- smooth animation

Desktop navigation:

Left sidebar containing:

CampsNest Logo

Home
Housing
Market
Connect

Bottom section:

Profile
Settings

====================================================
HOME PAGE
====================================================

The home page should feel alive and personalized.

Greeting example:

Good evening, Stephen 👋

Subtitle:

Everything happening around your campus.

The home page should not simply be a dashboard.

It should feel like a curated student activity feed.

Sections:

----------------------------------------------------

1. HERO / WELCOME SECTION

A visually beautiful gradient card.

Example:

"Find your space.
Meet your people.
Live campus better."

Include subtle animated gradient blobs.

Include small quick action buttons:

🏠 Find Housing

🛒 Browse Market

💕 Discover Matches

----------------------------------------------------

2. TRENDING ON CAMPUS

Horizontal cards showing:

- Popular marketplace items
- New housing listings
- Student activity

----------------------------------------------------

3. MARKETPLACE PICKS

Show a horizontal scrolling row.

Example cards:

Used iPhone

Study Table

Laptop

Mattress

Textbooks

Each card should include:

Image
Price
Condition
Campus
Seller

----------------------------------------------------

4. NEW HOUSING

Display recently posted houses.

Include:

House image
Price
Location
House type

----------------------------------------------------

5. CONNECT ACTIVITY

A visually playful section.

Example:

💕 12 new people joined Connect today.

Button:

Discover People

----------------------------------------------------

6. QUICK ACTIONS

Compact icon buttons:

Post Item
Find Housing
Find Roommate
Update Profile

====================================================
HOUSING SECTION
====================================================

Housing should NOT look like a boring real estate directory.

It should feel like a social discovery feed for accommodation.

The Housing tab should contain:

----------------------------------------------------

TOP HEADER

Title:

Find Your Nest 🏡

Subtitle:

Discover student-friendly places around campus.

Search bar:

Search by location, price or house type.

----------------------------------------------------

FILTERS

Beautiful horizontally scrollable filter chips:

All

Self Contain

Single Room

Shared Apartment

Budget

Distance

Available Now

----------------------------------------------------

HOUSING FEED

Housing listings should appear as rich visual cards.

Each card should contain:

Large image.

Availability badge:

Available
Inspection Scheduled
Taken

House type.

Price.

Location.

Distance from campus.

Number of rooms.

Posted date.

Save button.

----------------------------------------------------

SOCIAL STYLE INTERACTION

Allow users to:

Save listing.

Share listing.

Request inspection.

Report listing.

----------------------------------------------------

HOUSING DETAIL PAGE

This page should feel immersive.

Large image gallery at the top.

Image counter.

Back button.

Floating save button.

Main information:

House Name / Type

Price

Location

Distance from campus

Availability status

Description

Amenities.

Example:

✓ Water
✓ Electricity
✓ Bathroom
✓ Kitchen
✓ Security

----------------------------------------------------

INTERACTION SECTION

Primary CTA:

Request Inspection

Secondary:

Contact / Ask Question

Show:

"Safety Tip"

Never pay rent online without physically inspecting a property.

----------------------------------------------------

RELATED LISTINGS

Show similar housing options.

====================================================
MARKETPLACE
====================================================

The marketplace is a peer-to-peer student marketplace.

Students can buy and sell used items within their campus community.

The marketplace should feel similar to a modern combination of Facebook Marketplace and a campus community.

But it must remain uniquely CampsNest.

----------------------------------------------------

MARKET HEADER

Title:

Campus Market 🛒

Subtitle:

Buy and sell with students around you.

Include:

Search bar.

----------------------------------------------------

CATEGORIES

Beautiful rounded category cards:

📱 Electronics

💻 Computers

📚 Books

🛏 Hostel Essentials

👕 Fashion

🎮 Gaming

🔧 Others

----------------------------------------------------

MARKET FEED

Display items in a modern responsive grid.

Each item:

Large image.

Item title.

Price.

Condition:

New
Like New
Fairly Used
Used

Seller campus.

Posted time.

Save icon.

----------------------------------------------------

ITEM DETAIL PAGE

Large image gallery.

Item name.

Price.

Condition.

Description.

Location.

Seller information.

Example:

Sold by:

John D.

Computer Science
Federal University Wukari

Member since 2025.

Buttons:

Message Seller

Save Item

Report Listing

----------------------------------------------------

SELL ITEM FLOW

A beautiful multi-step posting experience.

Step 1:

Upload photos.

Step 2:

Item information.

Step 3:

Price and condition.

Step 4:

Location.

Step 5:

Preview and publish.

Make this experience extremely simple.

====================================================
CONNECT
====================================================

This is the most playful and emotionally engaging part of CampsNest.

Connect helps students discover compatible people through personality questions.

It can eventually support:

- Friendship
- Dating
- Study partners
- Campus connections

Do not aggressively label everything as dating.

Use the brand:

CampsNest Connect 💕

----------------------------------------------------

CONNECT LANDING PAGE

Visually beautiful.

Gradient background.

Floating emojis.

Examples:

💜 ✨ 🎧 🌙 📚 😂 🎵 ☕

Headline:

Meet people who match your vibe.

Subtitle:

Answer a few questions and discover students you might genuinely connect with.

CTA:

Start Matching

----------------------------------------------------

QUESTIONNAIRE

Make the questionnaire feel fun and interactive.

One question at a time.

Large animated answer cards.

Examples:

Question:

What's your ideal weekend?

Options:

🎬 Movies at home

🎉 Going out

📚 Catching up on school work

😴 Sleeping all day

----------------------------------------------------

Other questions:

Are you an introvert or extrovert?

Morning person or night owl?

Favourite music?

Ideal first hangout?

Study style?

What makes you laugh?

Favourite campus activity?

----------------------------------------------------

PROGRESS

Show progress:

Question 4 of 10

Use a beautiful animated progress indicator.

----------------------------------------------------

MATCH DISCOVERY

After questionnaire completion, show potential matches.

Example:

92% Match

"Your music taste and lifestyle are surprisingly similar."

Show interests using emoji chips:

🎵 Afrobeats

🌙 Night owl

📚 Study lover

😂 Loves comedy

----------------------------------------------------

MATCH REVEAL SCREEN

This must be visually special.

When two users match:

Animated screen.

Large:

🎉

"IT'S A MATCH!"

Use:

Floating hearts.

Confetti.

Animated gradient background.

Display:

You both enjoy:

🎧 Afrobeats
☕ Coffee
🌙 Late night conversations

Buttons:

Say Hello 👋

Keep Exploring

Make this screen screenshot-worthy.

Students should want to share it.

----------------------------------------------------

PRIVACY

Do NOT publicly expose:

Phone numbers.

Emails.

Exact addresses.

Personal information.

Users control:

Profile visibility.

Who can discover them.

Connect preferences.

Ability to block users.

Ability to report users.

====================================================
PROFILE
====================================================

The profile should be simple, useful and student-focused.

Top area:

Profile image.

Name.

Course / Department.

University.

Optional bio.

Example:

Stephen E.
Computer Science
Federal University Wukari

----------------------------------------------------

PROFILE STATISTICS

Beautiful compact cards.

Examples:

🏠 Saved Houses

🛒 Market Listings

💕 Connections

----------------------------------------------------

PROFILE MENU

My Listings

Saved Items

Saved Houses

My Matches

Notifications

----------------------------------------------------

PRIVACY & SETTINGS

Profile visibility.

Marketplace visibility.

Connect preferences.

Blocked users.

Notification preferences.

Account security.

Delete account.

----------------------------------------------------

STUDENT IDENTITY

The profile should feel useful for student life.

Optional fields:

University.

Faculty.

Department.

Level.

Campus.

Do not expose sensitive information publicly without user consent.

====================================================
MESSAGING
====================================================

Create one reusable messaging system.

It should support:

Marketplace conversations.

Housing conversations.

Roommate conversations.

Connect conversations.

Do not create four separate chat systems.

Messages should show context.

Example:

MARKETPLACE

Conversation about:

"iPhone 13 Pro"

[View Item]

----------------------------------------------------

Simple modern chat interface.

Features:

Text messages.

Image sharing.

Read status.

Typing indicator.

Block user.

Report user.

Do not overcomplicate the first version.

====================================================
SAFETY
====================================================

CampsNest should strongly communicate trust and student safety.

Include safety reminders throughout relevant sections.

Housing:

Never pay before inspection.

Marketplace:

Meet in safe public locations.

Connect:

Never share sensitive information immediately.

Provide:

Report User.

Block User.

Report Listing.

====================================================
EMPTY STATES
====================================================

Do not use boring empty pages.

Create beautiful illustrated empty states.

Examples:

No saved houses:

🏡

"You haven't found your perfect nest yet."

Button:

Explore Housing

No marketplace items:

🛒

"Nothing here yet. Be the first to sell something!"

No matches:

💜

"Your next connection might be one answer away."

====================================================
LOADING STATES
====================================================

Use skeleton loading.

Avoid blank screens.

Show animated placeholders matching the final content layout.

====================================================
ACCESSIBILITY
====================================================

Ensure:

Good color contrast.

Keyboard navigation.

Screen reader labels.

Readable font sizes.

Do not rely only on color for status.

====================================================
TECHNICAL RULES
====================================================

Use:

Next.js App Router.

TypeScript.

Reusable components.

Strict typing.

Supabase.

Responsive images.

Lazy loading.

Pagination or infinite scrolling.

Do not load unnecessary data.

Optimize for fast performance.

----------------------------------------------------

IMPORTANT:

Do not create massive page components.

Separate:

UI components.

Feature components.

Business logic.

Supabase queries.

Types.

Utilities.

Example structure:

app/
components/
features/
lib/
hooks/
types/

====================================================
OVERALL EXPERIENCE
====================================================

The final product should feel like:

A premium Gen-Z student platform.

Imagine a combination of:

Modern social app
+
Campus community
+
Marketplace
+
Student housing platform

The interface should make students feel:

"This was built for people like me."

Prioritize:

Speed.

Beautiful visuals.

Simple user flows.

Mobile experience.

Student engagement.

Trust.

Fun interactions.

Do not make the application feel corporate or boring.

Every major page should have a strong visual identity while remaining part of one consistent CampsNest design system.

Before implementing individual pages, first create:

1. Design tokens
2. Color system
3. Typography system
4. Reusable components
5. Navigation system
6. Application layout

Then build features progressively.