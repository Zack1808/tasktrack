import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Input from "../../src/components/Input";
import "@testing-library/jest-dom/vitest";

describe("Input component", () => {
  it("should render without crashing", () => {
    render(<Input id="test" />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });
});
