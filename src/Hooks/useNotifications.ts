import { useCallback, useEffect, useState } from 'react';
import type { Notification } from '../types/notification';
import * as notifAPI from '../Api/notifications.api';
import { getApiErrorMessage } from '../Api/axios';

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
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de charger les notifications."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      const updated = await notifAPI.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de marquer la notification comme lue.");
      setError(msg);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    try {
      await Promise.all(unread.map(n => notifAPI.markAsRead(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de marquer toutes les notifications comme lues."));
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notifAPI.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de supprimer la notification.");
      setError(msg);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, isLoading, error, fetchNotifications, markAsRead, markAllAsRead, deleteNotification };
}