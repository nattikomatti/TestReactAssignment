import type { ReactNode } from "react";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  err?: string | null;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = "ยืนยัน",
  onConfirm,
  onCancel,
  busy,
  err,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="modal-backdrop-custom">
      <div className="modal-card">
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{title}</h6>
          <button className="btn btn-sm btn-outline-secondary" onClick={onCancel} disabled={busy}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="mb-2">{message}</div>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <div className="text-end">
            <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
              {busy ? <span className="spinner-border spinner-border-sm" /> : confirmText}
            </button>
            <button className="btn btn-outline-secondary ms-2" onClick={onCancel} disabled={busy}>
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
