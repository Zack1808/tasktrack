import { it, expect, describe, beforeAll, vi } from "vitest";
import Select from "../../src/components/Select";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

describe("Select component", () => {
  const items = Array.from({ length: 50 }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `${i + 1}`,
  }));

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

  it("should open the dropdown when the up or down arrow keys have been pressed", async () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    select.focus();
    expect(select).toHaveFocus();

    await user.keyboard("{ArrowDown}");

    let dropdown = within(container).getByRole("listbox");
    expect(dropdown).toBeInTheDocument();

    await user.keyboard("{ }");

    expect(within(container).queryByRole("listbox")).not.toBeInTheDocument();

    await user.keyboard("{ArrowUp}");

    dropdown = within(container).getByRole("listbox");
    expect(dropdown).toBeInTheDocument();
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
    await user.keyboard("{Enter}");

    expect(handleSelect).toHaveBeenCalledWith(items[0]);
  });

  it("should not call the onChange if the the option is the same as the current value", async () => {
    const handleSelect = vi.fn();

    const { container } = render(
      <Select options={items} value={items[0]} onChange={handleSelect} />
    );

    const select = within(container).getByRole("combobox");

    select.focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("should scroll to highlighted option if it is out of view", async () => {
    const { container } = render(
      <Select options={items} onChange={() => {}} />
    );

    const select = within(container).getByRole("combobox");

    await user.click(select);

    const options = await within(container).findAllByRole("option");

    options.forEach((item) => (item.scrollIntoView = vi.fn()));

    for (let i = 0; i < 20; i++) await user.keyboard("{ArrowDown}");

    expect(options[19].scrollIntoView).toHaveBeenCalled();
  });
});
