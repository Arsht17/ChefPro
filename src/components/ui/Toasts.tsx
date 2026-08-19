import { useApp } from '../../state/AppState'
import { Icon } from './Icon'

/** Confirmation feedback for save / reserve / start-lesson. Polite live region
 *  so the change is announced without stealing focus from the flow. */
export function Toasts() {
  const { toasts, dismissToast } = useApp()

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-[16px] bg-charcoal px-5 py-4 text-text-inverse shadow-drop-02 motion-safe:animate-[toastIn_220ms_ease-out]"
        >
          <div className="min-w-0 flex-1">
            <p className="text-body-s font-bold">{toast.title}</p>
            {toast.body && (
              <p className="mt-0.5 text-body-xs text-white/80">{toast.body}</p>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="-m-1 rounded-full p-1 text-white/70 transition-colors hover:text-white"
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
