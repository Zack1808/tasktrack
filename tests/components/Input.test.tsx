import { it, expect, describe, afterAll, vi } from "vitest";
import { render, within, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../../src/components/Input";
import "@testing-library/jest-dom/vitest";

describe("Input component", () => {
  const user = userEvent.setup();

  afterAll(() => {
    vi.clearAllMocks();
  });

  const renderInput = (
    props: Partial<React.ComponentProps<typeof Input>> = {}
  ) => {
    const { container } = render(<Input {...props} />);

    return {
      input: within(container),
      button: within(container).queryByRole("button"),
    };
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { input } = renderInput();

      expect(input.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render input with label", () => {
      const { input } = renderInput({ label: "Test" });

      const label = input.queryByText("Test");
      expect(label).toBeInTheDocument();
    });

    it("should render input with label and asterisk when input is required", () => {
      const { input } = renderInput({ label: "Test", required: true });

      const label = input.queryByText("Test *");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Password visibility toggle", () => {
    it("should render toggle button for password type", () => {
      const { button } = renderInput({
        type: "password",
        label: "Password",
      });

      expect(button).toBeInTheDocument();
    });

    it("should not render toggle button for non-password type", () => {
      const { button } = renderInput({
        type: "email",
      });

      expect(button).not.toBeInTheDocument();
    });

    it("should toggle password visibility and button aria-label", async () => {
      const { input, button } = renderInput({
        type: "password",
        label: "Password",
      });

      const inputEl = input.getByLabelText("Password") as HTMLInputElement;

      expect(inputEl.type).toBe("password");
      expect(button).toHaveAccessibleName("Show password");

      await user.click(button as HTMLButtonElement);
      expect(inputEl.type).toBe("text");
      expect(button).toHaveAccessibleName("Hide password");

      await user.click(button as HTMLButtonElement);
      expect(inputEl.type).toBe("password");
      expect(button).toHaveAccessibleName("Show password");
    });
  });

  describe("Auto-complete behavior", () => {
    it.each([
      { type: "password", expected: "new-password", label: "Password" },
      { type: "email", expected: "on", label: "Email" },
    ])(
      "should set autoComplete to $expected for $type",
      ({ type, expected, label }) => {
        const { input } = renderInput({ type, label });

        expect(input.getByLabelText(label)).toHaveAttribute(
          "autoComplete",
          expected
        );
      }
    );
  });

  describe("Prop forwarding", () => {
    it("should pass additional props to input element", () => {
      const { input } = renderInput({ type: "text", placeholder: "Username" });

      expect(input.getByPlaceholderText("Username")).toBeInTheDocument();
    });
  });
});
