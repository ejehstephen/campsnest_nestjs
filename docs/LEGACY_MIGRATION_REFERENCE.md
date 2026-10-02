# CAMPSNEST 2.0 — LEGACY FLUTTER MIGRATION & REFERENCE MATRIX

> **Legacy Project Source:** `C:\Users\Ejeh Stephen\campsnest\Houe-roomate-finding`  
> **Supabase Endpoint:** `https://mmzchrpwefipnmodpwor.supabase.co`  
> **Target Application:** `CampsNest 2.0` (Next.js App Router + TypeScript + Tailwind CSS)

---

## 1. Architectural Mapping: Flutter to Next.js 2.0

| Domain | Legacy Flutter File (`Houe-roomate-finding`) | CampsNest 2.0 Equivalent | Notes & Preservation Details |
| :--- | :--- | :--- | :--- |
| **Configuration** | `lib/core/extension/config.dart` | `lib/constants.ts`, `.env.local` | Supabase URL, Anon Key, Support WhatsApp (`2348134351762`). |
| **User Model** | `lib/core/model/user_model.dart` | `types/user.types.ts`, `features/profile/` | Preserves: `id`, `name`, `email`, `profile_image`, `school`, `age`, `gender`, `phone_number`, `preferences`, `role`, `is_banned`, `is_verified`, `is_super_admin`, `last_active_at`. |
| **Auth Service** | `lib/core/service/auth_service.dart` | `features/auth/actions/`, `lib/supabase/` | Preserves Supabase Auth OTP verification, password reset OTP, session management, and profile synchronization. |
| **Housing Model** | `lib/core/model/room_listing.dart` | `types/housing.types.ts`, `features/housing/` | Preserves `room_listings` table schema, relations (`room_listing_images`, `room_listing_amenities`, `room_listing_rules`), and adds house types & inspection fee. |
| **Housing Service** | `lib/core/service/listing_service.dart` | `features/housing/services/housing.service.ts` | Preserves search filters (school, location, min/max price, gender preference, verified-first sort order). |
| **Questionnaire Model** | `lib/core/model/questionnaire.dart` | `types/connect.types.ts`, `features/connect/` | Preserves `questionnaire_questions`, `question_options`, `questionnaire_answers`, and `answer_values`. |
| **Questionnaire Service** | `lib/core/service/questionaire_service.dart` | `features/connect/services/connect.service.ts` | Preserves multi-option answer serialization and completion check. |
| **Matching Engine** | `lib/core/service/matching_service.dart` | `features/connect/services/matching.service.ts` | Interacts with Supabase PostgreSQL RPC `get_roommate_matches` calculating compatibility score & common interests. |
| **Roommate Model** | `lib/core/model/roomate_matching.dart` | `types/connect.types.ts` | Preserves `RoommateMatchModel` JSON mapping: score, common interests, budget, and matched profile data. |
| **Verification Service** | `lib/core/service/verification_service.dart` | `features/profile/services/verification.service.ts` | Preserves `verification_requests` schema (NIN, document type, front/back image storage paths, status transitions). |
| **Reports Model & Service**| `lib/core/model/report_model.dart`, `lib/core/service/listing_service.dart` | `features/admin/services/reports.service.ts` | Preserves `reports` table schema for user, listing, and item reporting. |
| **Admin Service** | `lib/core/service/admin_service.dart` | `features/admin/services/admin.service.ts` | Preserves RPC calls: `admin_delete_listing`, `admin_feature_listing`, `admin_broadcast_notification`, user banning & role controls. |
| **Notification Model** | `lib/core/model/notification_model.dart` | `types/notification.types.ts`, `lib/supabase/` | Preserves in-app notification queries & read status updates. |

---

## 2. Supabase Storage Buckets & File Naming Conventions

All storage buckets and path formats from the legacy codebase are preserved for seamless asset compatibility:

| Bucket Name | Privacy | Legacy Path Format | CampsNest 2.0 Purpose |
| :--- | :--- | :--- | :--- |
| `avatars` | **Public** | `${userId}/profile_${timestamp}.${ext}` | Student profile pictures & avatars |
| `listing-images` | **Public** | `${userId}/${timestamp}.${ext}` | Accommodation property photo galleries |
| `marketplace-images` | **Public** | `${userId}/market_${timestamp}.${ext}` | Campus marketplace product photos (New) |
| `chat-attachments` | **Authenticated** | `${conversationId}/${timestamp}.${ext}` | In-app messaging attachments (New) |
| `verification_docs` | **Private** | `${userId}/${timestamp}_front.${ext}` | KYC Student ID / NIN verification documents |

---

## 3. Server-Side Supabase RPC Functions Retained

The following PostgreSQL stored procedures from the existing Supabase instance are actively reused:
* `get_roommate_matches()`
* `update_user_activity(user_id)`
* `admin_delete_listing(target_listing_id)`
* `admin_feature_listing(target_listing_id)`
* `admin_broadcast_notification(title, body)`
* `delete_user()`
