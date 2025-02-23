import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth";
import { getFcmToken, onFcmMessage } from "../configs/firebase-config";

export function useNotifications() {
  const { logged, updateFcmToken } = useAuth();
  const [notificationReceived, setNotificationReceived] = useState(false);

  async function getMessageToken() {
    const storedFcmToken = localStorage.getItem("fcmToken");

    if (storedFcmToken) {
      return storedFcmToken;
    }

    try {
      const fcmToken = await getFcmToken();
      localStorage.setItem("fcmToken", fcmToken);
      return fcmToken;
    } catch (error) {
      console.error("Erro ao gerar token firebase:", error);
      return null;
    }
  }

  useEffect(() => {
    (async () => {
      if (!logged) return;

      const fcmToken = await getMessageToken();
      if (!fcmToken) return;

      updateFcmToken(fcmToken);
    })();
  }, [logged, updateFcmToken]);

  useEffect(() => {
    const unsubscribe = onFcmMessage((message) => {
      console.log("MENSAGEM RECEBIDA DO FIREBASE", message);

      if (Notification.permission === "granted") {
        const { title, body } = message.notification ?? {};

        if (title && body) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body,
              icon: "/icon.png",
            });
          });
        }
      }

      setNotificationReceived((prev) => !prev);
    });

    return () => unsubscribe();
  }, []);

  return { notificationReceived };
}
