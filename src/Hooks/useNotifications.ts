import { useCallback, useEffect, useState } from 'react';
import type { Notification } from '../types/notification';
import * as notifAPI from '../Api/notifications.api';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await notifAPI.getNotifications();
      setNotifications(data);
    } catch {
      setError("Impossible de charger les notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    const updated = await notifAPI.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
  };

  const deleteNotification = async (id: number) => {
    await notifAPI.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, isLoading, error, markAsRead, deleteNotification };
}