"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      duration={3500}
      toastOptions={{
        classNames: {
          toast:
            "group bg-card text-card-foreground border-border shadow-md rounded-lg",
        },
      }}
    />
  );
}
