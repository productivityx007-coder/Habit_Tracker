import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  isDestructive?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={22} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }} aria-label="Cancel">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '12px' }}>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            {message}
          </p>
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', fontSize: '0.8rem' }}>
            This action cannot be undone. Historical tracking data will be removed.
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Keep Habit
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="btn btn-danger"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};
