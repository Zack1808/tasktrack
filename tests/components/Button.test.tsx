import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../../src/components/Button";
import "@testing-library/jest-dom/vitest";

describe("Button component", () => {
  it("renders with 'contained' variant", () => {
    render(<Button variant="contained">Contained Variant</Button>);
    const button = screen.getByRole("button", { name: "Contained Variant" });
    expect(button).toHaveAttribute("data-variant", "contained");
  });

  it("renders with 'outlined' variant", () => {
    render(<Button variant="outlined">Outlined Variant</Button>);
    const button = screen.getByRole("button", { name: "Outlined Variant" });
    expect(button).toHaveAttribute("data-variant", "outlined");
  });

  it("renders with 'text' variant", () => {
    render(
      <Button variant="text" name="text-button">
        Text Variant
      </Button>
    );
    const button = screen.getByRole("button", { name: "Text Variant" });
    expect(button).toHaveAttribute("data-variant", "text");
  });
});
