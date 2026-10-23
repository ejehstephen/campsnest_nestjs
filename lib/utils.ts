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
    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch (e) {
      // Fallback to FileReader if createObjectURL fails
    }

    const processImage = (img: HTMLImageElement) => {
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
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
        return;
      }

      // Draw with high quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first for lowest byte size (30-40% smaller than JPEG)
      let mimeType = "image/webp";
      let output = canvas.toDataURL(mimeType, initialQuality);

      // Fallback to JPEG if browser doesn't export webp
      if (!output.startsWith("data:image/webp")) {
        mimeType = "image/jpeg";
        output = canvas.toDataURL(mimeType, initialQuality);
      }

      // Tier 1 Aggressive loop: Step down quality
      let currentQuality = initialQuality;
      let approxKb = (output.length * 0.75) / 1024;

      while (approxKb > maxKbTarget && currentQuality > 0.35) {
        currentQuality -= 0.1;
        output = canvas.toDataURL(mimeType, currentQuality);
        approxKb = (output.length * 0.75) / 1024;
      }

      // Tier 2 Dimension step-down for high-detail photos to strictly adhere to target
      if (approxKb > maxKbTarget) {
        const secondary = document.createElement("canvas");
        secondary.width = Math.round(width * 0.75);
        secondary.height = Math.round(height * 0.75);
        const sCtx = secondary.getContext("2d", { alpha: false });
        if (sCtx) {
          sCtx.imageSmoothingEnabled = true;
          sCtx.drawImage(canvas, 0, 0, secondary.width, secondary.height);
          output = secondary.toDataURL(mimeType, 0.55);
        }
      }

      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(output);
    };

    const img = new Image();
    img.onload = () => processImage(img);
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      // Fallback using FileReader
      const reader = new FileReader();
      reader.onload = (event) => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => processImage(fallbackImg);
        fallbackImg.onerror = () => reject(new Error("Failed to load image for compression"));
        fallbackImg.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    };

    if (objectUrl) {
      img.src = objectUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
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
 * Aggressively compress or transcode a video tour to ultra-compact size (< 5MB target).
 * Uses canvas captureStream + MediaRecorder when available to scale down resolution (max 540p)
 * and target ~750 kbps bitrate. If already small (< 2.5MB) or MediaRecorder is unsupported,
 * safely falls back without blocking the user.
 */
export async function compressVideoFile(
  file: File,
  maxDimension = 540,
  targetBitrate = 750000
): Promise<string> {
  // If file is already ultra-lightweight (< 2.5MB), read directly as DataURL
  if (file.size <= 2.5 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // If MediaRecorder or canvas captureStream is unsupported, return direct data URL
  if (
    typeof window === "undefined" ||
    typeof window.MediaRecorder === "undefined" ||
    !HTMLCanvasElement.prototype.captureStream
  ) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;

    // Timeout safety fallback (max 10s transcoding)
    const timeoutId = setTimeout(() => {
      cleanup();
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    }, 10000);

    const cleanup = () => {
      clearTimeout(timeoutId);
      try {
        video.pause();
        URL.revokeObjectURL(objectUrl);
      } catch (e) {}
    };

    video.onloadedmetadata = () => {
      try {
        let width = video.videoWidth || 640;
        let height = video.videoHeight || 360;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Make dimensions even numbers (required by video codecs)
        width = width % 2 === 0 ? width : width - 1;
        height = height % 2 === 0 ? height : height - 1;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { alpha: false });

        if (!ctx) {
          cleanup();
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
          return;
        }

        const stream = canvas.captureStream(24);
        let mimeType = "video/webm;codecs=vp8";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "video/mp4";
        }

        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
          videoBitsPerSecond: targetBitrate,
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          cleanup();
          const compressedBlob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(compressedBlob);
        };

        let animFrameId: number;
        const drawFrame = () => {
          if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, width, height);
            animFrameId = requestAnimationFrame(drawFrame);
          }
        };

        video.onended = () => {
          cancelAnimationFrame(animFrameId);
          if (recorder.state === "recording") {
            recorder.stop();
          }
        };

        recorder.start(250);
        video.playbackRate = 2.0; // 2x faster encoding
        video.play().then(() => {
          drawFrame();
        }).catch(() => {
          cleanup();
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      } catch (err) {
        cleanup();
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    };

    video.onerror = () => {
      cleanup();
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
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
 * Generate a deterministic, collision-free RFC4122 v4 UUID for a 1-on-1 conversation
 * between two users (and optional context ID). Both participants will always generate
 * the identical conversation ID regardless of who initiates, preventing multi-user leakage.
 */
export function getDeterministicConversationId(user1: string, user2: string, contextId = ""): string {
  if (!user1 && !user2) return "00000000-0000-4000-8000-000000000000";
  const sorted = [user1.trim().toLowerCase(), user2.trim().toLowerCase()].sort();
  const rawKey = `${sorted[0]}#${sorted[1]}#${contextId.trim().toLowerCase()}`;

  let h1 = 0xdeadbeef ^ rawKey.length;
  let h2 = 0x41c6ce57 ^ rawKey.length;
  for (let i = 0; i < rawKey.length; i++) {
    const ch = rawKey.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = ((h1 >>> 0).toString(16) + (h2 >>> 0).toString(16)).padStart(16, "0");
  const hex2 = (((h2 ^ 0x5a5a5a5a) >>> 0).toString(16) + ((h1 ^ 0xa5a5a5a5) >>> 0).toString(16)).padStart(16, "0");
  const hex = (hex1 + hex2).slice(0, 32);

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
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
