// ============================================================================
// CAMPSNEST 2.0 SERVICE WORKER — WEB PUSH NOTIFICATIONS & DAILY ENGAGEMENT
// ============================================================================

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming background Push events from server
self.addEventListener("push", (event) => {
  let data = {
    title: "CampsNest Alert 🔔",
    body: "You have a new campus notification.",
    icon: "/campsnest-logo.png",
    badge: "/campsnest-logo.png",
    url: "/notifications",
    data: { url: "/notifications" }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
      if (!data.data) data.data = { url: data.url || "/notifications" };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/campsnest-logo.png",
    badge: data.badge || "/campsnest-logo.png",
    vibrate: [100, 50, 100],
    data: data.data || { url: data.url || "/notifications" },
    actions: [
      { action: "explore", title: "Open App 🚀" },
      { action: "dismiss", title: "Dismiss ✕" }
    ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click: focus or open the appropriate campus page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || "/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
