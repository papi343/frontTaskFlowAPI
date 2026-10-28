import type { Notification } from '../../types/notification';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  const dateFormatted = new Date(notification.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
        notification.read
          ? 'bg-white border-slate-200/70 hover:border-slate-300'
          : 'bg-slate-50 border-slate-300/80 shadow-xs ring-1 ring-slate-900/5'
      }`}
    >
      <div className="shrink-0 mt-1">
        {notification.read ? (
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-200 animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            notification.read ? 'text-slate-600' : 'text-slate-900 font-semibold'
          }`}
        >
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-slate-400 font-medium">
          {dateFormatted}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {!notification.read && (
          <button
            type="button"
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Marquer comme lue"
            aria-label="Marquer la notification comme lue"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(notification.id)}
          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Supprimer la notification"
          aria-label="Supprimer la notification"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;