import DashboardLayout from '../../components/layout/DashboardLayout';
import NotificationCard from '../../components/notifications/NotificationCard';
import { useNotifications } from '../../Hooks/useNotifications';

function Notifications() {
  const { notifications, isLoading, error, markAsRead, deleteNotification } = useNotifications();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">Restez à jour sur l'activité de vos projets.</p>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-medium mb-1">Aucune notification</h3>
            <p className="text-gray-500 text-sm">Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Notifications;