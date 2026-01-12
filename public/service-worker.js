console.log('🚀 Disaster Command Center - Service Worker loaded');

// Install event
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(clients.claim());
});

// Push event - Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received:', event);

  let notificationData = {
    title: '⚠️ PERINGATAN BENCANA',
    body: 'Ada bencana terdeteksi di sekitar Anda',
    icon: '/icon.png',
    badge: '/badge.png'
  };

  // Parse data from push event
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        url: data.url || '/disasters/active',
        data: data
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [300, 100, 200, 100, 300],
    tag: 'disaster-notification',
    requireInteraction: true, // Notification tetap muncul sampai user interact
    actions: [
      {
        action: 'view',
        title: '👁️ Lihat Detail'
      },
      {
        action: 'close',
        title: '❌ Tutup'
      }
    ],
    data: {
      url: notificationData.url,
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event.action);

  event.notification.close();

  // Handle action buttons
  if (event.action === 'close') {
    return;
  }

  // Default action or 'view' action
  const urlToOpen = event.notification.data.url || '/disasters/active';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('🔕 Notification closed:', event);
});

// Background sync (optional - untuk future feature)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'sync-disasters') {
    event.waitUntil(syncDisasters());
  }
});

async function syncDisasters() {
  try {
    const response = await fetch('/api/public/disasters');
    const disasters = await response.json();
    console.log('✅ Disasters synced:', disasters);
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}
