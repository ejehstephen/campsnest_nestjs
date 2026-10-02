# CampsNest 2.0 - User Flows

## Overview

CampsNest is a student-focused platform that provides:

- Student housing discovery
- Peer-to-peer marketplace
- Student social matching
- Roommate discovery
- Student profiles

The application should provide simple, fast and intuitive user journeys.

---

# 1. AUTHENTICATION FLOW

## New User

User opens CampsNest
↓
Views landing page
↓
Clicks "Get Started"
↓
Chooses Sign Up
↓
Enters:

- Full name
- Email
- Password
- Age
- Gender

↓
Email verification
↓
Account created
↓
Completes student profile
↓
Enters CampsNest Home

---

## Returning User

User opens CampsNest
↓
Already authenticated?
↓
YES → Go directly to Home

NO → Show Login page
↓
Enter email and password
↓
Successful authentication
↓
Go to Home

---

# 2. HOME FLOW

User enters Home
↓
Sees personalized greeting
↓
Sees activity from:

- Housing
- Marketplace
- Connect

User can:

- Browse housing
- Browse marketplace
- Discover matches
- View trending activity

Quick actions allow users to move directly to important features.

---

# 3. HOUSING FLOW

User opens Housing
↓
Views housing feed
↓
Can search listings
↓
Can filter by:

- House type
- Price
- Distance
- Availability

↓
User selects a house
↓
Views housing details

Housing detail includes:

- Images
- Price
- Location
- Description
- Amenities
- Availability
- Distance from campus

User actions:

- Save listing
- Share listing
- Request inspection
- Report listing

---

## Inspection Flow

User clicks "Request Inspection"
↓
Selects preferred inspection date
↓
Reviews inspection information
↓
Sees inspection/admin fee
↓
Confirms request
↓
Receives inspection status
↓
Inspection is scheduled

Important:

CampsNest should clearly communicate that users should inspect houses physically before paying rent.

---

# 4. MARKETPLACE FLOW

User opens Market
↓
Views marketplace feed
↓
Can:

- Search items
- Browse categories
- Filter listings

↓
User selects an item
↓
Views item details

Item details include:

- Images
- Price
- Condition
- Description
- Seller information
- Location

User actions:

- Save item
- Message seller
- Report listing
- Share item

---

## Selling Flow

User clicks "Sell Item"
↓
Uploads item images
↓
Enters:

- Item name
- Description
- Category
- Condition
- Price
- Location

↓
Reviews listing
↓
Publishes item

Item appears in marketplace feed.

---

# 5. CONNECT FLOW

User opens Connect
↓
Sees introduction screen

"Meet people who match your vibe."

↓
Clicks Start Matching
↓
Completes questionnaire

Questions may include:

- Personality
- Lifestyle
- Music preferences
- Social preferences
- Hobbies
- Study habits

↓
Answers are saved
↓
Matching algorithm calculates compatibility
↓
User sees potential matches

---

## Match Flow

User views potential match
↓
Views compatibility percentage

Example:

92% Match

↓
Views shared interests
↓
User chooses:

- Like
- Skip

If two users like each other:

↓
MATCH CREATED 🎉💕
↓
Match reveal screen
↓
Users can start conversation

---

# 6. PROFILE FLOW

User opens Profile
↓
Views:

- Profile picture
- Name
- University
- Department
- Level
- Bio

User can:

- Edit profile
- Manage listings
- View saved houses
- View saved marketplace items
- View matches
- Manage privacy
- Manage notifications

---

# 7. MESSAGING FLOW

A user can enter a conversation from:

- Housing
- Marketplace
- Connect
- Roommate matching

↓
Messaging screen opens

Conversation context should be visible.

Examples:

Marketplace:

"Conversation about iPhone 13"

Housing:

"Conversation about Self Contain at..."

Connect:

"You matched with Sarah"

Users can:

- Send messages
- Send images
- Block users
- Report users

---

# 8. REPORTING FLOW

User encounters suspicious content
↓
Clicks Report

Can report:

- User
- Marketplace listing
- Housing listing
- Message

↓
Selects reason

Examples:

- Scam
- Fake listing
- Harassment
- Inappropriate content
- Other

↓
Report submitted
↓
Admin reviews report

---

# 9. BLOCKING FLOW

User opens another user's profile
↓
Clicks Block User
↓
Confirmation modal

"Are you sure you want to block this user?"

↓
User confirms
↓
Block created

Blocked users cannot:

- Message the user
- Appear in Connect matches
- View private profile information

---

# GENERAL NAVIGATION FLOW

Desktop:

Home
↓
Housing
↓
Market
↓
Connect
↓
Profile

Mobile:

Bottom navigation:

Home | Housing | Market | Connect | Profile

Users should always be able to return to the previous screen or Home easily.