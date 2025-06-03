import { it, expect, describe } from "vitest";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../../src/components/Input";
import "@testing-library/jest-dom/vitest";

describe("Input component", () => {
  const user = userEvent.setup();

  const setup = (props: any = {}) => {
    const { container } = render(<Input {...props} />);
    return container;
  };

  it("should render without crashing", () => {
    const container = setup();

    const input = within(container).getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should render with label without crashing", () => {
    const container = setup({ id: "email", label: "Email" });

    const input = within(container).getByLabelText("Email");
    expect(input).toBeInTheDocument();
  });

  it("should render an asterisk on the label when the input is required and label is provided", () => {
    const container = setup({ label: "Email", required: true });

    const input = within(container).getByLabelText(/Email \*/);
    expect(input).toBeInTheDocument();
  });

  it("should render a toggle password visibility button when type is password", () => {
    const container = setup({
      type: "password",
      label: "Password",
      "aria-label": "password-input",
    });

    const button = within(container).getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should not render the toggle password visibility button for non-password inputs", () => {
    const container = setup({ type: "text" });

    const button = within(container).queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should toggle the password visibility if the toggle password visibility button is pressed", async () => {
    const container = setup({ type: "password", label: "Password" });

    const input = within(container).getByLabelText(
      "Password"
    ) as HTMLInputElement;
    const toggleButton = within(container).getByRole("button");

    expect(input.type).toBe("password");
    expect(toggleButton).toHaveAccessibleName("Show password");

    await user.click(toggleButton);

    expect(input.type).toBe("text");
    expect(toggleButton).toHaveAccessibleName("Hide password");

    await user.click(toggleButton);

    expect(input.type).toBe("password");
    expect(toggleButton).toHaveAccessibleName("Show password");
  });

  const autoCompleteCases = [
    { type: "password", expected: "new-password", label: "Password" },
    { type: "email", expected: "on", label: "Text" },
  ];

  autoCompleteCases.forEach(({ type, expected, label }) => {
    it(`should set autoComplete to ${expected} for type of ${type}`, () => {
      const container = setup({ type, label });

      const input = within(container).getByLabelText(label);
      expect(input).toHaveAttribute("autoComplete", expected);
    });
  });

  it("should get the additional props get passed down", () => {
    const container = setup({ type: "text", placeholder: "UserName" });

    const input = within(container).getByPlaceholderText("UserName");
    expect(input).toBeInTheDocument();
  });
});
