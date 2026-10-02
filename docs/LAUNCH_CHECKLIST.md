CampsNest 2.0 Launch Checklist
1. Privacy Policy 🔴 Essential

You collect:

Name
Email
Age
Gender
Profile information
University/department
Marketplace data
Housing interactions
Connect matching preferences

You definitely need a Privacy Policy.

Route:

/privacy
2. Terms & Conditions 🔴 Essential

Especially important because CampsNest involves:

Housing listings
Marketplace transactions
Student interactions
Connect/social matching
User-generated content

Route:

/terms
3. Secrets off the Frontend 🔴 Critical

Never expose:

SUPABASE_SERVICE_ROLE_KEY
PAYSTACK_SECRET_KEY
SMTP PASSWORD
API SECRET KEYS

Only public keys should be exposed in the frontend.

For Next.js:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Anything sensitive should NOT have NEXT_PUBLIC_.

4. Force HTTPS 🟢

If you deploy through Vercel or similar modern hosting, HTTPS is generally handled automatically.

Still ensure:

https://campsnest.com

redirects properly.

5. Cookie Consent 🟡

If you use analytics, authentication cookies, or tracking, consider a cookie consent banner.

Especially useful if you later have users outside Nigeria.

6. Meta Titles & Descriptions 🔴 Important

Every major page needs SEO metadata.

Example:

Home:
CampsNest | Student Housing, Marketplace & Campus Connections

Housing:
Student Housing Near Campus | CampsNest

Market:
Campus Marketplace | Buy & Sell Used Items | CampsNest

Connect:
Meet Students Who Match Your Vibe | CampsNest
7. Social Preview Image 🔴 Important

When someone shares CampsNest on WhatsApp, Twitter/X, LinkedIn, or Facebook, it should display a beautiful branded preview.

Create an Open Graph image.

Example:

CampsNest

Your Campus.
Your Space.
Your People.

🏠 Find Housing
🛒 Buy & Sell
💕 Meet Your People

This is particularly important because most of your marketing currently happens through WhatsApp and social media.

8. Favicon 🟢

Use your CampsNest logo as:

favicon.ico
apple-touch-icon.png
9. Sitemap + robots.txt 🟡

Very useful for Google indexing.

For example:

/sitemap.xml
/robots.txt

This becomes especially important for public housing and marketplace listings.

10. Alt Text on Images 🔴 Important

Every meaningful image should have descriptive alt text.

Example:

<Image
  src={house.image}
  alt={`Self-contained apartment in ${house.location}`}
/>

This helps:

Accessibility
SEO
Screen readers
11. Compress Images 🔴 Very Important for CampsNest

You will have lots of:

House images
Marketplace images
Profile pictures

Large images can destroy performance.

You should implement:

Automatic compression before upload
WebP/AVIF where possible
Image size limits
Lazy loading

For example:

Maximum upload: 5MB
Recommended: Under 1MB after compression
12. Check Page Load Speed 🔴 Critical

Your main reason for moving away from Flutter Web is performance.

So performance testing must be part of CampsNest 2.0 development.

Track:

First Contentful Paint
Largest Contentful Paint
JavaScript bundle size
Image loading
Mobile performance
13. Fix Color Contrast 🟡

Your purple/pink design must remain readable.

Be careful with:

Light text on gradients
Small grey text
Transparent glass cards

A beautiful UI that students cannot read is not good UX.

14. Make It Mobile Friendly 🔴 CRITICAL

For CampsNest, this is probably one of the most important.

Most of your students will access it through:

Android phones
iPhones
Mobile browsers

Design mobile first.

15. Custom 404 Page 🟢

Create something branded.

Example:

Lost on campus? 🏡

This page doesn't exist.

Button:

Back to CampsNest

16. Fix Broken Links 🔴

Before launch, test:

Navigation
Shared listing links
Housing links
Marketplace links
Profile links
Password reset links

Especially dynamic routes.

17. Form Validation 🔴 Essential

You have multiple forms:

Sign up
Login
Create housing listing
Sell item
Connect questionnaire
Profile editing

Validate both:

Client-side for user experience
Server-side/database level for security
18. Spam Protection 🔴 Important

CampsNest allows user-generated content.

You need protection against:

Fake accounts
Spam listings
Bot registrations
Marketplace scams
Abuse in Connect

Consider:

Rate limiting
CAPTCHA on suspicious activity
Supabase Auth protections
Report system
Content moderation
19. Analytics 🔴 Important

You already showed interest in Firebase Analytics before, but for Next.js you can reconsider your analytics setup.

Track events like:

User Signed Up
Housing Viewed
Housing Saved
Inspection Requested
Marketplace Item Viewed
Marketplace Item Posted
Connect Questionnaire Completed
Match Created
Message Sent

These metrics will tell you which new features actually work.

20. Clear Call To Action 🔴 Essential

Every major page should answer:

What should the student do next?

Examples:

Housing

Find a House

Marketplace

Sell an Item

Connect

Start Matching

Home

Explore Campus

My Recommended Priority for CampsNest

I would categorize them like this:

Before Development
□ Database security
□ Secrets management
□ Privacy policy requirements
□ Terms & conditions
□ Authentication security
□ User reporting system
During Development
□ Mobile responsiveness
□ Image compression
□ Form validation
□ Alt text
□ Color contrast
□ SEO metadata
□ Performance optimization
□ Spam protection
Before Launch
□ Privacy policy
□ Terms & conditions
□ HTTPS
□ Favicon
□ Social preview image
□ Sitemap
□ robots.txt
□ Custom 404
□ Broken link testing
□ Analytics
□ Page speed testing
□ Clear CTAs