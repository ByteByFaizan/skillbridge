"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  }[type];

  const icon = {
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  }[type];

  return createPortal(
    <div
      role="alert"
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-fade-in-up ${bgColor}`}
    >
      {icon}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 rounded-full p-1 hover:bg-black/10"
        aria-label="Close notification"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>,
    document.body
  );
}

interface ToastConfig {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastConfig & { id: number }>>([]);

  const show = useCallback((config: ToastConfig) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...config, id }]);
  }, []);

  const close = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => {
    return (
      <>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => close(toast.id)}
          />
        ))}
      </>
    );
  }, [toasts, close]);

  return { show, ToastContainer };
}
