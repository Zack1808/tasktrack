import { it, expect, describe, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Button from "../../src/components/Button";
import "@testing-library/jest-dom/vitest";

describe("Button component", () => {
  const buttonText = "Click me!";

  it("should render with 'contained' variant", () => {
    const { container } = render(
      <Button variant="contained">{buttonText}</Button>
    );
    const button = within(container).getByRole("button");
    expect(button).toHaveAttribute("data-variant", "contained");
  });

  it("should render with 'outlined' variant", () => {
    const { container } = render(
      <Button variant="outlined">{buttonText}</Button>
    );
    const button = within(container).getByRole("button");
    expect(button).toHaveAttribute("data-variant", "outlined");
  });

  it("should render with 'text' variant", () => {
    const { container } = render(
      <Button variant="text" name="text-button">
        {buttonText}
      </Button>
    );
    const button = within(container).getByRole("button");
    expect(button).toHaveAttribute("data-variant", "text");
  });

  it("should render a Link button when link prop is provided", () => {
    const { container } = render(
      <MemoryRouter>
        <Button variant="text" link="/home">
          {buttonText}
        </Button>
      </MemoryRouter>
    );
    const link = within(container).getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
    expect(link).not.toHaveAttribute("target", "_blank");
  });

  it("should render an anchor tag when link and target are provided", () => {
    const { container } = render(
      <Button variant="text" link="https://example.com" target="_blank">
        {buttonText}
      </Button>
    );
    const anchor = within(container).getByRole("link");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "https://example.com");
    expect(anchor).toHaveAttribute("target", "_blank");
  });

  it("should be disabled when 'disabled' prop is true", () => {
    const { container } = render(
      <Button variant="contained" disabled>
        {buttonText}
      </Button>
    );
    const button = within(container).getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should be disabled when 'loading' prop is true and should show loader", () => {
    const { container } = render(
      <Button variant="contained" loading>
        {buttonText}
      </Button>
    );
    const button = within(container).getByRole("button");
    expect(button).toBeDisabled();
    expect(within(button).getByTestId("loader")).toBeInTheDocument();
  });

  it("should not show loader if loading is not true", () => {
    const { container } = render(
      <Button variant="contained">{buttonText}</Button>
    );
    const button = within(container).getByRole("button");

    expect(button).not.toBeDisabled();
    expect(within(button).queryByTestId("loader")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Button variant="contained" className="custom-class">
        {buttonText}
      </Button>
    );
    const button = within(container).getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  it("should call onClick when button is clicked", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Button variant="contained" onClick={handleClick}>
        {buttonText}
      </Button>
    );

    const button = within(container).getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when loading", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Button variant="contained" loading onClick={handleClick}>
        {buttonText}
      </Button>
    );

    const button = within(container).getByRole("button");

    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
