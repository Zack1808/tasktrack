import { it, expect, describe, vi, afterEach } from "vitest";
import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Button, { ButtonVariant } from "../../src/components/Button";
import "@testing-library/jest-dom/vitest";

describe("Button component", () => {
  const buttonText = "Click me!";
  const user = userEvent.setup();
  const handleClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderButton = (
    variant: ButtonVariant,
    props: Partial<React.ComponentProps<typeof Button>> = {}
  ) => {
    const { container } = render(
      <MemoryRouter>
        <Button variant={variant} {...props}>
          {buttonText}
        </Button>
      </MemoryRouter>
    );

    return {
      button: within(container).queryByRole("button"),
      link: within(container).queryByRole("link"),
    };
  };

  describe("Rendering", () => {
    it.each(["contained", "outlined", "text"] as const)(
      "should render '%s' variant correctly",
      (variant) => {
        const { button } = renderButton(variant);

        expect(button).toHaveAttribute("data-variant", variant);
      }
    );

    it("should apply custom className", () => {
      const { button } = renderButton("contained", {
        className: "custom-class",
      });

      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Link behaviour", () => {
    it("should render React Router Link when link prop is provided", () => {
      const { link } = renderButton("text", { link: "/home" });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/home");
      expect(link).not.toHaveAttribute("target");
    });

    it("should render anchor tag when link prop and target prop are provided", () => {
      const { link } = renderButton("text", {
        link: "https://example.com",
        target: "_blank",
      });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });

  describe("States", () => {
    it.each([
      ["disabled", { disabled: true }],
      ["loading", { loading: true }],
    ])("should be disabled when %s", (_, props) => {
      const { button } = renderButton("contained", props);

      expect(button).toBeDisabled();
    });

    it("should show the loader when loading", () => {
      const { button } = renderButton("contained", { loading: true });

      const loader = within(button as HTMLElement).getByTestId("loader");
      expect(loader).toBeInTheDocument();
    });

    it("should not show loader when not loading", () => {
      const { button } = renderButton("contained");

      const loader = within(button as HTMLElement).queryByTestId("loader");
      expect(loader).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onClick when clicked", async () => {
      const { button } = renderButton("contained", { onClick: handleClick });

      await user.click(button as HTMLElement);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it.each([
      ["disabled", { disabled: true }],
      ["loading", { loading: true }],
    ])("should not call onClick when %s", async (_, props) => {
      const { button } = renderButton("contained", {
        onClick: handleClick,
        ...props,
      });

      await user.click(button as HTMLElement);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should be keyboard accessible", async () => {
      const { button } = renderButton("contained", { onClick: handleClick });

      (button as HTMLElement).focus();

      await user.keyboard("{Enter}");
      await user.keyboard("{ }");

      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });
});
