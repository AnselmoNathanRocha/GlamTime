import { initializeApp } from "firebase/app";
import { getMessaging, getToken, MessagePayload, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAayTEw6BJkm-0zU_c58U-MhNmEviurpfU",
  authDomain: "finances-react-webapp.firebaseapp.com",
  projectId: "finances-react-webapp",
  storageBucket: "finances-react-webapp.firebasestorage.app",
  messagingSenderId: "685138899317",
  appId: "1:685138899317:web:467e7a4092f7c160a3233c",
  measurementId: "G-LV8LFG8K42",
};

const vapidKey =
  "BC-pSlXpfxal7ybbsNXdpiYWFjRNfM7vH4nDRxQ0K7e1Slq1xgInxXvKjBiPbpheTFgk1yixfMFAhH0J2rUcEXQ";
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export async function getFcmToken() {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Permissão de notificação negada");
  }

  return getToken(messaging, { vapidKey });
}

type Handler = (message: MessagePayload) => void;

class MessagingHandler {
  private initialized = false;
  private observers: Handler[] = [];

  subscribe(observer: Handler) {
    if (!this.initialized) {
      onMessage(messaging, (message) => this.notify(message));
      this.initialized = true;
    }

    this.observers.push(observer);
  }

  unsubscribe(observer: Handler) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(message: MessagePayload) {
    this.observers.forEach((observer) => observer(message));
  }
}

const messagingHandler = new MessagingHandler()

export function onFcmMessage(handler: Handler) {
  messagingHandler.subscribe(handler)

  return () => messagingHandler.unsubscribe(handler)
}