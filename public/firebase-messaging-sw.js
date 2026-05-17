importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyCShHyhtsDW8HV2KXPrbUk8ufLYQhOkuUc",
  authDomain: "shopdibz-seller-hub.firebaseapp.com",
  projectId: "shopdibz-seller-hub",
  storageBucket: "shopdibz-seller-hub.appspot.com",
  messagingSenderId: "852067253825",
  appId: "1:852067253825:web:9b07e9f90a0e95bcd710c0",
  measurementId: "G-N4JPNHLP74",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  const notification = payload?.notification || {};
  const data = payload?.data || {};
  const title = notification.title || data.title || "Shopdibz Brand Hub";
  const body = notification.body || data.body || "";
  const icon = notification.icon || "/favicon.ico";
  const targetUrl =
    data.click_action || data.url || data.href || data.link || "/";

  return self.registration.showNotification(title, {
    body,
    icon,
    data: {
      targetUrl,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.targetUrl || "/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((windowClients) => {
      for (let index = 0; index < windowClients.length; index += 1) {
        const client = windowClients[index];

        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return undefined;
    }),
  );
});
