import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes cleanly with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency to Nigerian Naira (NGN).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate long strings with ellipsis.
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  initialQuality?: number;
  maxKbTarget?: number; // Target max file size in KB
}

/**
 * Aggressively compress an image file to ultra-low storage consumption.
 * Uses WebP format when supported (30-40% smaller) with iterative quality step-down.
 */
export function compressImageFile(
  file: File,
  options?: CompressionOptions | number // supports legacy maxWidth as second arg
): Promise<string> {
  const maxWidth = typeof options === "number" ? options : options?.maxWidth || 580;
  const maxHeight = typeof options === "object" ? options?.maxHeight || 580 : 580;
  const initialQuality = typeof options === "object" ? options?.initialQuality || 0.65 : 0.65;
  const maxKbTarget = typeof options === "object" ? options?.maxKbTarget || 45 : 45;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio constraint
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for lowest byte size
        let mimeType = "image/webp";
        let output = canvas.toDataURL(mimeType, initialQuality);

        // Fallback to JPEG if browser doesn't export webp
        if (!output.startsWith("data:image/webp")) {
          mimeType = "image/jpeg";
          output = canvas.toDataURL(mimeType, initialQuality);
        }

        // Aggressive loop: If data exceeds maxKbTarget, step down quality
        let currentQuality = initialQuality;
        let approxKb = (output.length * 0.75) / 1024;

        while (approxKb > maxKbTarget && currentQuality > 0.35) {
          currentQuality -= 0.1;
          output = canvas.toDataURL(mimeType, currentQuality);
          approxKb = (output.length * 0.75) / 1024;
        }

        resolve(output);
      };
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Ultra-aggressive profile picture compression (under 25KB, max 320x320)
 */
export function compressAvatarImage(file: File): Promise<string> {
  return compressImageFile(file, {
    maxWidth: 320,
    maxHeight: 320,
    initialQuality: 0.65,
    maxKbTarget: 25
  });
}

/**
 * Aggressive accommodation & room photos compression (under 50KB, max 640x640)
 */
export function compressHouseImage(file: File): Promise<string> {
  return compressImageFile(file, {
    maxWidth: 640,
    maxHeight: 640,
    initialQuality: 0.65,
    maxKbTarget: 50
  });
}

/**
 * Aggressive marketplace product photos compression (under 40KB, max 580x580)
 */
export function compressMarketImage(file: File): Promise<string> {
  return compressImageFile(file, {
    maxWidth: 580,
    maxHeight: 580,
    initialQuality: 0.65,
    maxKbTarget: 40
  });
}

/**
 * Extract ultra-lightweight thumbnail frame from a video file (< 25KB)
 */
export function compressVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 0.5;

    video.onloadeddata = () => {
      video.currentTime = 0.5;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 540;
      let width = video.videoWidth || 540;
      let height = video.videoHeight || 360;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/webp", 0.6);
        URL.revokeObjectURL(videoUrl);
        resolve(dataUrl);
      } else {
        URL.revokeObjectURL(videoUrl);
        resolve(videoUrl);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error("Failed to process video frame"));
    };
  });
}

/**
 * Helper to ensure a valid UUID format. If already UUID, returns it. If with prefix, strips prefix.
 * If not UUID, generates a deterministic UUID v4 string.
 */
export function sanitizeUUID(rawId: string): string {
  if (!rawId) return "00000000-0000-0000-0000-000000000000";
  const stripped = rawId.replace(/^[hmc]-/, "");
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(stripped)) {
    return stripped;
  }
  // Fallback: create a 32-char hex string formatted as UUID
  let hash = 0;
  for (let i = 0; i < rawId.length; i++) {
    hash = ((hash << 5) - hash) + rawId.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `00000000-0000-4000-8000-${hex.repeat(2).slice(0, 12)}`;
}

/**
 * Check if a URL points to a video file (.mp4, .webm, .mov, etc.)
 */
export function isVideoUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".ogv") ||
    clean.endsWith(".avi") ||
    clean.startsWith("data:video/") ||
    clean.includes("/video") ||
    clean.includes("video_tour")
  );
}

/**
 * Format human-readable name from email prefix (e.g. 'ejehstephen966@gmail.com' -> 'Ejeh Stephen')
 */
export function formatNameFromEmail(email?: string | null): string {
  if (!email || !email.includes("@")) return "Campus Student";
  const prefix = email.split("@")[0].replace(/[0-9]/g, " ").trim();
  if (!prefix) return "Campus Student";
  return prefix
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Intelligently parse a user's name across legacy Flutter data, Supabase Auth user_metadata,
 * and current Next.js models, preventing unwanted 'Stephen Ekeson' or 'New User' default names.
 */
export function parseUserName(
  dbRecord?: Record<string, any> | null,
  authUser?: Record<string, any> | null,
  fallback = "Campus Student"
): string {
  const isInvalid = (val?: any): boolean => {
    if (!val || typeof val !== "string") return true;
    const clean = val.trim().toLowerCase();
    return (
      clean === "" ||
      clean === "new user" ||
      clean === "null" ||
      clean === "undefined" ||
      clean === "stephen ekeson" ||
      clean === "student resident" ||
      clean === "verified campus host"
    );
  };

  // 1. Direct DB Record fields
  if (dbRecord) {
    if (!isInvalid(dbRecord.name)) return dbRecord.name.trim();
    if (!isInvalid(dbRecord.full_name)) return dbRecord.full_name.trim();
    if (!isInvalid(dbRecord.display_name)) return dbRecord.display_name.trim();
    if (!isInvalid(dbRecord.username)) {
      return dbRecord.username
        .replace(/[_.-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  // 2. Supabase Auth User Metadata fields
  if (authUser?.user_metadata) {
    const meta = authUser.user_metadata;
    if (!isInvalid(meta.name)) return meta.name.trim();
    if (!isInvalid(meta.full_name)) return meta.full_name.trim();
    if (!isInvalid(meta.display_name)) return meta.display_name.trim();
    if (!isInvalid(meta.displayName)) return meta.displayName.trim();
    if (!isInvalid(meta.username)) {
      return meta.username
        .replace(/[_.-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  // 3. Email-derived Name
  const email = dbRecord?.email || authUser?.email;
  if (email && email.includes("@")) {
    const fromEmail = formatNameFromEmail(email);
    if (!isInvalid(fromEmail) && fromEmail !== "Campus Student") {
      return fromEmail;
    }
  }

  return fallback;
}
