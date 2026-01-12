// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Your VAPID Public Key
const VAPID_PUBLIC_KEY = 'BCf8etJZvD1q4CJOJcknh8qIpN3wluPZfnxK7QtPYMg3wmRbEPh5IfG03cAjRzBxg-Pq2i2jFYSDkzWi1mixjD0';

// Register Service Worker and Subscribe to Push
async function registerServiceWorkerAndSubscribe(latitude, longitude, radiusKm = 50) {
  try {
    // Check browser support
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker tidak didukung di browser ini');
    }

    if (!('PushManager' in window)) {
      throw new Error('Push notification tidak didukung di browser ini');
    }

    console.log('📝 Registering Service Worker...');

    // Handle Trusted Types policy (untuk browser yang strict)
    let swUrl = '/service-worker.js';
    if (window.trustedTypes && trustedTypes.createPolicy) {
      try {
        const policy = trustedTypes.createPolicy('default', {
          createScriptURL: (url) => url
        });
        swUrl = policy.createScriptURL('/service-worker.js');
      } catch (e) {
        console.log('Trusted Types policy already exists');
      }
    }

    // Register Service Worker
    const registration = await navigator.serviceWorker.register(swUrl);
    console.log('✅ Service Worker registered:', registration);

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('✅ Service Worker ready');

    // Request Notification Permission
    console.log('🔔 Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Permission status:', permission);

    if (permission !== 'granted') {
      throw new Error('Notification permission ditolak');
    }

    // Subscribe to Push Manager
    console.log('📬 Subscribing to push notifications...');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // Get subscription details
    const subscriptionJSON = subscription.toJSON();
    console.log('✅ Push subscription created:', subscriptionJSON);

    // Send subscription to backend
    console.log('📤 Sending subscription to backend...');
    const response = await fetch('http://localhost:3000/api/public/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
        keys: {
          p256dh: subscriptionJSON.keys.p256dh,
          auth: subscriptionJSON.keys.auth
        },
        latitude: latitude,
        longitude: longitude,
        radiusKm: radiusKm
      })
    });

    const result = await response.json();
    console.log('✅ Backend response:', result);

    return {
      success: true,
      subscription: subscriptionJSON,
      backend: result
    };

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Unsubscribe function
async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      const endpoint = subscription.endpoint;
      
      // Unsubscribe locally
      await subscription.unsubscribe();
      console.log('✅ Unsubscribed locally');

      // Notify backend
      await fetch('http://localhost:3000/api/public/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endpoint })
      });
      
      console.log('✅ Unsubscribed from backend');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    return false;
  }
}

// Check subscription status
async function checkSubscriptionStatus() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log('✅ Already subscribed:', subscription.toJSON());
      return subscription.toJSON();
    } else {
      console.log('❌ Not subscribed');
      return null;
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    return null;
  }
}

// Auto-run on page load (optional)
console.log('📱 Push notification helper loaded');
console.log('Usage:');
console.log('  registerServiceWorkerAndSubscribe(-7.78, 110.43, 50)');
console.log('  checkSubscriptionStatus()');
console.log('  unsubscribeFromPush()');
