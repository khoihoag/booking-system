import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X
} from 'lucide-react';
import './ToastContainer.css';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="toast-icon-success" size={20} />;
        let typeClass = 'type-success';

        if (toast.type === 'error') {
          icon = <XCircle className="toast-icon-error" size={20} />;
          typeClass = 'type-error';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="toast-icon-warning" size={20} />;
          typeClass = 'type-warning';
        } else if (toast.type === 'info') {
          icon = <Info className="toast-icon-info" size={20} />;
          typeClass = 'type-info';
        }

        return (
          <div
            key={toast.id}
            className={`toast-item ${typeClass}`}
          >
            <div className="toast-icon-wrap">{icon}</div>

            <div className="toast-content">
              <h4 className="toast-title">{toast.title}</h4>
              <p className="toast-desc">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close-btn"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};