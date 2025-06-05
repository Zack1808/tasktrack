import { it, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { render, within, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import Modal from "../../src/components/Modal";
import "@testing-library/jest-dom/vitest";

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

vi.mock("./Button", () => ({
  default: vi.fn(({ children, onClick }) => (
    <button onClick={onClick} aria-label="open">
      {children}
    </button>
  )),
}));

describe("Modal component", () => {
  const closeModal = vi.fn();
  const user = userEvent.setup();
  let modalRoot: HTMLElement;

  beforeEach(() => {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal");
    modalRoot.setAttribute("tabindex", "-1");
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    document.body.removeChild(modalRoot);
    vi.clearAllMocks();
  });

  const renderModal = (
    isOpen: boolean,
    props: Partial<React.ComponentProps<typeof Modal>> = {}
  ) => {
    const { unmount } = render(
      <Modal isOpen={isOpen} closeModal={closeModal} {...props}>
        {props.children ? props.children : <div>Modal Content</div>}
      </Modal>
    );

    return {
      getModal: () => screen.queryByRole("dialog"),
      getModalIsVisible: () => {
        const modal = screen.queryByRole("dialog");
        return (
          modal &&
          !modal.classList.contains("invisible") &&
          !modal.classList.contains("opacity-0")
        );
      },
      getTitle: () => screen.queryByText(props.title || "dialog title"),
      getCloseButton: () => screen.queryByLabelText("Close Modal"),
      unmount,
    };
  };

  describe("Rendering", () => {
    it("should not be visible when isOpen is false", () => {
      const { getModalIsVisible } = renderModal(false);

      expect(getModalIsVisible()).toBe(false);
    });

    it("should render with the correct accessibility attributes when open", () => {
      const { getModal, getTitle } = renderModal(true, {
        title: "Test Modal",
      });

      const modal = getModal();
      const title = getTitle();

      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute("aria-modal", "true");
      expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
      expect(title).toHaveAttribute("id", "modal-title");
    });

    it("should render even when the title is not provided", () => {
      const { getModal, getTitle } = renderModal(true);

      const modal = getModal();
      const title = getTitle();

      expect(modal).toBeInTheDocument();
      expect(title).not.toBeInTheDocument();
    });
  });

  describe("Closing behavior", () => {
    it("should close the modal when clicking close button", async () => {
      const { getCloseButton } = renderModal(true);

      await user.click(getCloseButton() as HTMLElement);
      expect(closeModal).toHaveBeenCalled();
    });

    it("should close the modal when clicking on the background", async () => {
      const { getModal } = renderModal(true);

      await user.click(getModal() as HTMLElement);
      expect(closeModal).toHaveBeenCalled();
    });

    it("should not close when clicking on the content", async () => {
      renderModal(true);

      await user.click(screen.getByText("Modal Content"));
      expect(closeModal).not.toHaveBeenCalled();
    });

    it("should close when pressing Escape", async () => {
      renderModal(true);

      await user.keyboard("{Escape}");
      expect(closeModal).toHaveBeenCalled();
    });
  });

  describe("Focus management", () => {
    it("should trap focus within the modal", async () => {
      const { getCloseButton } = renderModal(true, {
        children: (
          <>
            <button>First Button</button>
            <button>Second Button</button>
            <button>Third Button</button>
          </>
        ),
      });

      const btn1 = screen.getByText("First Button");

      await user.tab();
      expect(getCloseButton()).toHaveFocus();

      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab();
      expect(getCloseButton()).toHaveFocus();

      await user.tab();
      expect(btn1).toHaveFocus();

      await user.tab({ shift: true });
      expect(getCloseButton()).toHaveFocus();
    });

    // it("should focus to the previously focust element when modal is closed", async () => {
    //   const triggerButton = document.createElement("button");
    //   triggerButton.textContent = "Trigger";
    //   document.body.appendChild(triggerButton);

    //   triggerButton.focus();
    //   await user.click(triggerButton);

    //   const { unmount, getCloseButton } = renderModal(true);
    //   await user.tab();
    //   await user.tab();

    //   expect(triggerButton).not.toHaveFocus();
    //   expect(getCloseButton()).toHaveFocus();

    //   unmount();

    //   expect(triggerButton).toHaveFocus();
    // });
  });
});
