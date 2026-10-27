import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import NotificationCard from '../../components/notifications/NotificationCard';
import { useNotifications } from '../../Hooks/useNotifications';
import { useToast } from '../../context/ToastContext';

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();

  const { success, error: toastError } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      success("Notification marquée comme lue.");
    } catch {
      toastError("Erreur lors de la mise à jour.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      success("Toutes les notifications ont été marquées comme lues !");
    } catch {
      toastError("Impossible de marquer toutes les notifications.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      success("Notification supprimée.");
    } catch {
      toastError("Erreur lors de la suppression.");
    }
  };

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Restez informé des modifications et de l'avancée de vos projets.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-semibold">{error}</p>
                <p className="text-[11px] text-amber-700">Impossible de joindre l'API des notifications.</p>
              </div>
            </div>
            <button
              onClick={() => fetchNotifications()}
              className="px-3 py-1.5 bg-amber-200/60 hover:bg-amber-200 text-amber-900 text-xs font-medium rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Filter tabs */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'unread'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>
        )}

        {/* Notification List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-md mx-auto my-6">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Aucune notification</h3>
            <p className="text-xs text-slate-500">
              Vous êtes parfaitement à jour ! Vous recevrez une alerte dès qu'une activité aura lieu.
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-xs text-slate-500">
            Toutes vos notifications sont lues.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}