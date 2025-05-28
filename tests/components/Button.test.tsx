import { it, expect, describe, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Button from "../../src/components/Button";
import "@testing-library/jest-dom/vitest";

describe("Button component", () => {
  it("should render with 'contained' variant", () => {
    render(<Button variant="contained">Contained Variant</Button>);
    const button = screen.getByRole("button", { name: "Contained Variant" });
    expect(button).toHaveAttribute("data-variant", "contained");
  });

  it("should render with 'outlined' variant", () => {
    render(<Button variant="outlined">Outlined Variant</Button>);
    const button = screen.getByRole("button", { name: "Outlined Variant" });
    expect(button).toHaveAttribute("data-variant", "outlined");
  });

  it("should render with 'text' variant", () => {
    render(
      <Button variant="text" name="text-button">
        Text Variant
      </Button>
    );
    const button = screen.getByRole("button", { name: "Text Variant" });
    expect(button).toHaveAttribute("data-variant", "text");
  });

  it("should render a Link button when link prop is provided", () => {
    render(
      <MemoryRouter>
        <Button variant="text" link="/home">
          Button with Link component
        </Button>
      </MemoryRouter>
    );
    const link = screen.getByRole("link", {
      name: "Button with Link component",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
    expect(link).not.toHaveAttribute("target", "_blank");
  });

  it("should render an anchor tag when link and target are provided", () => {
    render(
      <Button variant="text" link="https://example.com" target="_blank">
        Button with Anchor tag
      </Button>
    );
    const anchor = screen.getByRole("link", { name: "Button with Anchor tag" });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "https://example.com");
    expect(anchor).toHaveAttribute("target", "_blank");
  });

  it("should be disabled when 'disabled' prop is true", () => {
    render(
      <Button variant="contained" disabled>
        Disabled Button
      </Button>
    );
    const button = screen.getByRole("button", {
      name: "Disabled Button",
    });
    expect(button).toBeDisabled();
  });

  it("should be disabled when 'loading' prop is true and should show loader", () => {
    render(
      <Button variant="contained" loading>
        Loading Button
      </Button>
    );
    const button = screen.getByRole("button", {
      name: "Loading Button",
    });
    expect(button).toBeDisabled();
    expect(within(button).getByTestId("loader")).toBeInTheDocument();
  });

  it("should not show loader if loading is not true", () => {
    render(<Button variant="contained">Button Not Loading</Button>);
    const button = screen.getByRole("button", {
      name: "Button Not Loading",
    });

    expect(button).not.toBeDisabled();
    expect(within(button).queryByTestId("loader")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(
      <Button variant="contained" className="custom-class">
        New ClassName
      </Button>
    );
    const button = screen.getByRole("button", { name: "New ClassName" });
    expect(button.className).toContain("custom-class");
  });

  it("should call onClick when button is clicked", () => {
    const handleClick = vi.fn();
    render(
      <Button variant="contained" onClick={handleClick}>
        With Onclick
      </Button>
    );

    const button = screen.getByRole("button", { name: "With Onclick" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when loading", () => {
    const handleClick = vi.fn();
    render(
      <Button variant="contained" loading onClick={handleClick}>
        Loading with OnClick
      </Button>
    );

    const button = screen.getByRole("button", { name: "Loading with OnClick" });

    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
