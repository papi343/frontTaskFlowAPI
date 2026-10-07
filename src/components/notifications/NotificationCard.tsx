import type { Notification } from '../../types/notification';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  return (
    <div className={`flex items-start gap-4 p-5 rounded-xl border transition-colors ${
      notification.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'
    }`}>
      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-gray-200' : 'bg-blue-500'}`} />
      
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
          {notification.message}
        </p>
        <p className="mt-1.5 text-xs text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
            title="Marquer comme lu"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Supprimer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;