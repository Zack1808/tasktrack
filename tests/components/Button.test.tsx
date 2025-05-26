import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../../src/components/Button";
import "@testing-library/jest-dom/vitest";

describe("Button component", () => {
  it("renders with 'contained' variant", () => {
    render(<Button variant="contained">Contained Variant</Button>);
    const button = screen.getByRole("button", { name: "Contained Variant" });
    expect(button).toHaveTextContent("Contained Variant");
    expect(button.className).toContain(
      "border-2 border-blue-500 bg-blue-500 text-white"
    );
  });

  it("renders with 'outlined' variant", () => {
    render(<Button variant="outlined">Outlined Variant</Button>);
    const button = screen.getByRole("button", { name: "Outlined Variant" });
    expect(button).toHaveTextContent("Outlined Variant");
    expect(button.className).toContain(
      "border-2 border-blue-500 text-blue-500"
    );
  });

  it("renders with 'text' variant", () => {
    render(
      <Button variant="text" name="text-button">
        Text Variant
      </Button>
    );
    const button = screen.getByRole("button", { name: "Text Variant" });
    expect(button).toHaveTextContent("Text Variant");
    expect(button.className).toContain("text-blue-500");
    expect(button.className).not.toContain("border-2 border-blue-500");
  });
});
