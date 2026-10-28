import api from './axios';
import type { Notification } from '../types/notification';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>('/notifications');
  return response.data;
};

export const markAsRead = async (id: number): Promise<Notification> => {
  const response = await api.patch<Notification>(`/notifications/${id}/read`);
  return response.data;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};