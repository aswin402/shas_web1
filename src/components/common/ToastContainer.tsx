import { useToastStore } from '@/store/useToastStore';
import type { Toast } from '@/store/useToastStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[10000] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <style>{`
        @keyframes toast-slide-in {
          0% { transform: translateY(1.5rem) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes toast-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-temple-red shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-brown/70 shrink-0" />,
  };

  const themeBorderColors = {
    success: 'border-emerald-600/20',
    error: 'border-temple-red/20',
    warning: 'border-amber-600/20',
    info: 'border-muted-brown/30',
  };

  const progressBarColors = {
    success: 'bg-emerald-600',
    error: 'bg-temple-red',
    warning: 'bg-amber-600',
    info: 'bg-temple-red/70',
  };

  return (
    <div
      className={`relative flex items-start gap-3 p-4 pr-9 rounded-lg border bg-[#fdfbf7] text-[#3d2f23] shadow-md shadow-brown/5 pointer-events-auto overflow-hidden ${themeBorderColors[toast.type]}`}
      style={{
        animation: 'toast-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      role="alert"
    >
      {icons[toast.type]}
      <p className="text-xs sm:text-sm font-body font-medium flex-1 text-deep-brown">{toast.message}</p>
      
      <button
        onClick={() => onClose(toast.id)}
        className="absolute top-3.5 right-3 text-muted-brown hover:text-deep-brown transition-colors duration-200 cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Countdown Progress Bar */}
      <div 
        className={`absolute bottom-0 left-0 h-[2.5px] rounded-r-full ${progressBarColors[toast.type]}`}
        style={{
          animation: `toast-progress ${toast.duration || 3000}ms linear forwards`,
        }}
      />
    </div>
  );
}
