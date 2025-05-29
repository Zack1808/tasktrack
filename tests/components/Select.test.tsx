import { it, expect, describe, beforeAll, vi } from "vitest";
import Select from "../../src/components/Select";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

describe("Select component", () => {
  const items = [
    { label: "value 1", value: 1 },
    { label: "value 2", value: 2 },
    { label: "value 3", value: 3 },
    { label: "value 4", value: 4 },
    { label: "value 5", value: 5 },
  ];

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  const user = userEvent.setup();

  it("should render without label", () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    expect(select).toBeInTheDocument();
  });

  it("should render with label", () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} label="Test label" />
    );

    const label = within(container).getByText("Test label");

    expect(label).toBeInTheDocument();
  });

  it("should render with initial value selected", () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} value={items[0]} />
    );

    const displayedValue = within(container).getByTestId("select-value");

    expect(displayedValue).toHaveTextContent(items[0].label);
  });

  it("should open and close the dropdown on click", async () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    expect(within(container).queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(select);

    const dropdown = within(container).getByRole("listbox");

    expect(dropdown).toBeInTheDocument();

    await user.click(select);

    expect(within(container).queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should close the dropdown on blur", async () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    await user.click(select);

    let dropdown = within(container).getByRole("listbox");
    expect(dropdown).toBeInTheDocument();

    await user.tab();

    expect(within(container).queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(select);

    dropdown = within(container).getByRole("listbox");
    expect(dropdown).toBeInTheDocument();
    const body = document.body;

    await user.click(body);

    expect(within(container).queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should close the dropdown when the Escape key is pressed", async () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    await user.click(select);

    let dropdown = within(container).getByRole("listbox");
    expect(dropdown).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(within(container).queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should open and close the dropdown when enter or space are pressed", async () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    select.focus();
    expect(select).toHaveFocus();

    await user.keyboard("{Enter}");

    let dropdown = within(container).getByRole("listbox");
    expect(dropdown).toBeInTheDocument();

    await user.keyboard("{ }");

    expect(within(container).queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should highlight the currently focused option with the arrow keys", async () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    await user.click(select);

    const dropdown = within(container).getByRole("listbox");
    expect(dropdown).toBeInTheDocument();

    const options = within(dropdown).queryAllByRole("option");

    expect(options[0]).toHaveAttribute("data-highlighted", "true");
    expect(options[1]).toHaveAttribute("data-highlighted", "false");

    await user.keyboard("{ArrowDown}");

    expect(options[0]).toHaveAttribute("data-highlighted", "false");
    expect(options[1]).toHaveAttribute("data-highlighted", "true");

    await user.keyboard("{ArrowUp}");

    expect(options[0]).toHaveAttribute("data-highlighted", "true");
    expect(options[1]).toHaveAttribute("data-highlighted", "false");
  });

  it("should select the highlighted option when pressing enter or space", async () => {
    const handleSelect = vi.fn();

    const { container } = render(
      <Select options={items} onChange={handleSelect} />
    );

    const select = within(container).getByRole("combobox");

    select.focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(handleSelect).toHaveBeenCalledWith(items[1]);
  });
});
