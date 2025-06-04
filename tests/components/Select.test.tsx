import { it, expect, describe, beforeAll, vi, afterEach } from "vitest";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "../../src/components/Select";
import React from "react";
import "@testing-library/jest-dom/vitest";

describe("Select component", () => {
  const user = userEvent.setup();
  const items = Array.from({ length: 50 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: `${i + 1}`,
  }));
  const handleChange = vi.fn();

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "auto";
  });

  const renderSelect = (
    props: Partial<React.ComponentProps<typeof Select>> = {}
  ) => {
    const { container } = render(
      <Select options={items} onChange={handleChange} {...props} />
    );

    const { label } = props;

    return {
      getSelect: () => within(container).queryByRole("combobox"),
      getLabel: () => (label ? within(container).queryByText(label) : null),
      getDropdown: () => within(container).queryByRole("listbox"),
      getOptions: () => within(container).queryAllByRole("option"),
    };
  };

  describe("Rendering", () => {
    it("should render without label", () => {
      const { getSelect } = renderSelect();

      expect(getSelect()).toBeInTheDocument();
    });

    it("should render with label", () => {
      const { getSelect, getLabel } = renderSelect({ label: "Test" });

      expect(getSelect()).toBeInTheDocument();
      expect(getLabel()).toBeInTheDocument();
    });

    it("should render with initial value", () => {
      const { getSelect } = renderSelect({ value: items[0] });

      expect(getSelect()).toHaveTextContent(items[0].label);
    });
  });

  describe("Accessibility", () => {
    it("should apply the ARIA roles and attributes", async () => {
      const { getSelect, getDropdown, getOptions } = renderSelect();

      let select = getSelect();
      let dropdown = getDropdown();

      expect(select).toHaveAttribute("aria-expanded", "false");
      expect(select).not.toHaveAttribute("aria-activedescendant");
      expect(dropdown).not.toBeInTheDocument();

      await user.click(select as HTMLElement);

      dropdown = getDropdown();
      const id = dropdown?.getAttribute("id");
      const options = getOptions();

      expect(dropdown).toBeInTheDocument();
      expect(select).toHaveAttribute("aria-expanded", "true");
      expect(select).toHaveAttribute("aria-controls", id);
      expect(options).toHaveLength(items.length);
    });

    it("should have aria-selected on all options", async () => {
      const { getSelect, getOptions } = renderSelect();

      const select = getSelect();

      await user.click(select as HTMLElement);

      const options = getOptions();

      options.forEach((option) =>
        expect(option).toHaveAttribute("aria-selected")
      );
    });

    it("should associate label with select and focuses on label click", async () => {
      const { getSelect, getLabel } = renderSelect({ label: "Test Label" });

      const select = getSelect();
      const label = getLabel();

      expect(label).toHaveAttribute("for", (select as HTMLElement).id);
      await user.click(label as HTMLElement);
      expect(select).toHaveFocus();
    });
  });

  describe("Keyboard interactions", () => {
    it("should open dropdown on ArrowUp/ArrowDown and selects on Enter/Space", async () => {
      const { getSelect, getDropdown } = renderSelect();

      const select = getSelect();
      (select as HTMLElement).focus();

      await user.keyboard("{ArrowDown}");
      expect(getDropdown()).toBeInTheDocument();

      await user.keyboard("{Enter}");
      expect(handleChange).toHaveBeenCalledWith(items[0]);
      expect(getDropdown()).not.toBeInTheDocument();

      await user.keyboard("{ArrowUp}{ }");
      expect(handleChange).toHaveBeenCalledWith(items[0]);
    });

    it("should highlight options with arrow keys", async () => {
      const { getSelect, getOptions } = renderSelect();
      await user.click(getSelect() as HTMLElement);

      const options = getOptions();

      expect(options[0]).toHaveAttribute("data-highlighted", "true");

      await user.keyboard("{ArrowDown}");
      expect(options[0]).toHaveAttribute("data-highlighted", "false");
      expect(options[1]).toHaveAttribute("data-highlighted", "true");
    });

    it("should close dropdown on Escape", async () => {
      const { getSelect, getDropdown } = renderSelect();

      await user.click(getSelect() as HTMLElement);

      expect(getDropdown()).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(getDropdown()).not.toBeInTheDocument();
    });

    it("should prevent page scroll when open with keyboard and allow scroll when closed", async () => {
      const { getSelect } = renderSelect();

      (getSelect() as HTMLElement).focus();

      await user.keyboard("{ArrowDown}");
      expect(document.body.style.overflow).toBe("hidden");

      await user.keyboard("{Escape}");
      expect(document.body.style.overflow).toBe("auto");
    });
  });

  describe("Mouse interactions", () => {
    it("should toggle on click", async () => {
      const { getSelect, getDropdown } = renderSelect();

      const select = getSelect();

      await user.click(select as HTMLElement);
      expect(getDropdown()).toBeInTheDocument();

      await user.click(select as HTMLElement);
      expect(getDropdown()).not.toBeInTheDocument();
    });

    it("should close dropdown on blur", async () => {
      const { getSelect, getDropdown } = renderSelect();

      await user.click(getSelect() as HTMLElement);
      expect(getDropdown()).toBeInTheDocument();

      await user.keyboard("{Tab}");
      expect(getDropdown()).not.toBeInTheDocument();
    });

    it("should select option on click", async () => {
      const { getOptions, getSelect } = renderSelect();
      await user.click(getSelect() as HTMLElement);
      const options = getOptions();
      await user.click(options[1]);
      expect(handleChange).toHaveBeenCalledWith(items[1]);
    });
  });

  describe("Dropdown positioning", () => {
    const setupPositinTest = (position: "top" | "bottom") => {
      const rect =
        position === "top"
          ? { top: 450, bottom: 470, height: 20 }
          : { top: 100, bottom: 120, height: 20 };

      window.innerHeight = position === "top" ? 500 : 800;

      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        ...rect,
        width: 200,
        left: 0,
        right: 200,
        x: 0,
        y: rect.top,
        toJSON: () => {},
      }));

      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        configurable: true,
        get() {
          return 100;
        },
      });
    };

    it.each(["top", "bottom"])(
      "should open dropdown on %s of the select",
      async (position) => {
        setupPositinTest(position as "top" | "bottom");
        const { getSelect, getDropdown } = renderSelect();

        await user.click(getSelect() as HTMLElement);
        expect((getDropdown() as HTMLElement).className).toMatch(
          `${position === "top" ? "bottom" : "top"}-full`
        );
      }
    );
  });

  describe("Performance optimizing", () => {
    it("should reset highlighted index when reopening", async () => {
      const { getSelect, getOptions } = renderSelect();
      const select = getSelect();

      await user.click(select as HTMLElement);
      let options = getOptions();
      expect(options[0]).toHaveAttribute("data-highlighted", "true");

      await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
      expect(options[3]).toHaveAttribute("data-highlighted", "true");

      await user.click(select as HTMLElement);
      await user.click(select as HTMLElement);

      options = getOptions();
      expect(options[0]).toHaveAttribute("data-highlighted", "true");
    });

    it("should reset scroll position when reopening", async () => {
      const { getSelect, getDropdown } = renderSelect();

      const select = getSelect();

      await user.click(select as HTMLElement);
      const dropdown = getDropdown();
      (dropdown as HTMLElement).scrollTop = 100;

      await user.click(select as HTMLElement);
      await user.click(select as HTMLElement);

      expect((getDropdown() as HTMLElement).scrollTop).toBe(0);
    });

    it("should only rerender when the props change", () => {
      const renderSpy = vi.fn();
      const MemoizedSelect = React.memo(
        (props: Partial<React.ComponentProps<typeof Select>>) => {
          renderSpy();
          return (
            <Select
              options={props.options ?? []}
              onChange={props.onChange ?? handleChange}
              {...props}
            />
          );
        }
      );

      const { rerender } = render(
        <MemoizedSelect
          options={items}
          onChange={handleChange}
          value={items[0]}
        />
      );

      rerender(
        <MemoizedSelect
          options={items}
          value={items[0]}
          onChange={handleChange}
        />
      );

      rerender(
        <MemoizedSelect
          options={items}
          value={items[1]}
          onChange={handleChange}
        />
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
