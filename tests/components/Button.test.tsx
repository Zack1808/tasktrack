import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
