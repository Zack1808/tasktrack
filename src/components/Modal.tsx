import React, { useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

import Button from "./Button";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  isOpen,
  closeModal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const handleBackgroundClick = useCallback((event: React.MouseEvent) => {
    if (!modalRef.current) return;

    if (event.target === modalRef.current) closeModal();
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isOpen) lastFocusedRef.current?.focus();
        lastFocusedRef.current = null;
        closeModal();
      }

      if (!modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const focusedList = Array.from(focusable || []);

      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (isOpen) {
        if (event.key === "Tab") {
          if (!focusedList.includes(document.activeElement as HTMLElement)) {
            lastFocusedRef.current = document.activeElement as HTMLElement;
            first.focus();
          } else if (event.shiftKey) {
            if (document.activeElement === first) {
              event.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [isOpen]);

  return ReactDOM.createPortal(
    <div
      ref={modalRef}
      className={`bg-black/40 fixed inset-0 flex items-center justify-center p-4 duration-250 ${
        isOpen ? "opacity-100" : "opacity-0"
      } ${isOpen ? "visible" : "invisible"}`}
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded-md w-full max-w-4xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl">{title}</h2>
          <Button variant="text" onClick={closeModal}>
            <X />
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.getElementById("modal")!
  );
};

export default Modal;
