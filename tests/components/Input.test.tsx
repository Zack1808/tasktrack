import { it, expect, describe } from "vitest";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../../src/components/Input";
import "@testing-library/jest-dom/vitest";

describe("Input component", () => {
  const user = userEvent.setup();

  it("should render without crashing", () => {
    const { container } = render(<Input />);

    const input = within(container).getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should render with label without crashing", () => {
    const { container } = render(<Input id="email" label="Email" />);

    const input = within(container).getByLabelText("Email");
    expect(input).toBeInTheDocument();
  });

  it("should render an asterisk on the label when the input is required and label is provided", () => {
    const { container } = render(<Input label="Email" required />);

    const input = within(container).getByLabelText(/Email \*/);
    expect(input).toBeInTheDocument();
  });

  it("should render a toggle password visibility button when type is password", () => {
    const { container } = render(
      <Input type="password" label="Password" aria-label="password-input" />
    );

    const button = within(container).getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should not render the toggle password visibility button for non-password inputs", () => {
    const { container } = render(<Input type="text" />);

    const button = within(container).queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should toggle the password visibility if the toggle password visibility button is pressed", async () => {
    const { container } = render(<Input type="password" label="Password" />);

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

  it("should set autoComplete to 'new-password' for password inputs", () => {
    const { container } = render(<Input type="password" label="Password" />);

    const input = within(container).getByLabelText("Password");
    expect(input).toHaveAttribute("autoComplete", "new-password");
  });

  it("should set autoComplete to 'on' for non-password inputs", () => {
    const { container } = render(<Input type="email" />);

    const input = within(container).getByRole("textbox");
    expect(input).toHaveAttribute("autoComplete", "on");
  });

  it("should get the additional props get passed down", () => {
    const { container } = render(<Input type="text" placeholder="UserName" />);

    const input = within(container).getByPlaceholderText("UserName");
  });
});
