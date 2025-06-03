import { it, expect, describe, vi } from "vitest";
import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Button from "../../src/components/Button";
import "@testing-library/jest-dom/vitest";

describe("Button component", () => {
  const buttonText = "Click me!";
  const user = userEvent.setup();

  const setup = (variant: string, props: any = {}) => {
    const { container } = render(
      <Button variant={variant as "contained" | "outlined" | "text"} {...props}>
        {buttonText}
      </Button>
    );
    return container;
  };

  describe.each([
    ["contained", "contained"],
    ["outlined", "outlined"],
    ["text", "text"],
  ])("variant: %s", (variant) => {
    it(`should render with data-variant="${variant}"`, () => {
      const container = setup(variant);
      const button = within(container).getByRole("button");
      expect(button).toHaveAttribute("data-variant", variant);
    });
  });

  describe("link behavior", () => {
    it("should render React Router <Link> when 'link' prop is provided without target", () => {
      const { container } = render(
        <MemoryRouter>
          <Button variant="text" link="/home">
            {buttonText}
          </Button>
        </MemoryRouter>
      );
      const link = within(container).getByRole("link");
      expect(link).toHaveAttribute("href", "/home");
      expect(link).not.toHaveAttribute("target");
    });

    it("should render <a> with target when 'link' and 'target' props are provided", () => {
      const container = setup("text", {
        link: "https://example.com",
        target: "_blank",
      });
      const anchor = within(container).getByRole("link");
      expect(anchor).toHaveAttribute("href", "https://example.com");
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noreferrer");
    });
  });

  describe("disabled and loading states", () => {
    it.each([
      ["disabled", { disabled: true }],
      ["loading", { loading: true }],
    ])(
      "should render button that is disabled when %s prop is true",
      (_, props) => {
        const container = setup("contained", { ...props });
        const button = within(container).getByRole("button");
        expect(button).toBeDisabled();
      }
    );

    it("should show loader when loading", () => {
      const container = setup("contained", { loading: true });
      const button = within(container).getByRole("button");
      const loader = within(button).queryByTestId("loader");
      expect(loader).toBeInTheDocument();
    });

    it("should not show loader when not loading", () => {
      const container = setup("contained");
      const button = within(container).getByRole("button");
      const loader = within(button).queryByTestId("loader");
      expect(loader).not.toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  it("should apply custom className", () => {
    const container = setup("contained", {
      className: "custom-class",
    });
    const button = within(container).getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  describe("click behavior", () => {
    it("should call onClick handler when clicked", async () => {
      const handleClick = vi.fn();
      const container = setup("contained", { onClick: handleClick });
      const button = within(container).getByRole("button");
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when loading", async () => {
      const handleClick = vi.fn();
      const container = setup("contained", {
        loading: true,
        onClick: handleClick,
      });
      const button = within(container).getByRole("button");
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it("should be keyboard accessible and triggers onClick with Enter and Space", async () => {
    const handleClick = vi.fn();

    const container = setup("contained", { onClick: handleClick });
    const button = within(container).getByRole("button");

    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    await user.keyboard("{ }");

    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
