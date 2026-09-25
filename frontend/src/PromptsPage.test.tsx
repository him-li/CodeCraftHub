import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import PromptsPage from "./PromptsPage";
import { promptShowcase } from "./content/prompts";
import { LanguageProvider } from "./i18n";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.dir = "ltr";
});

describe("Prompt journey page", () => {
  it("renders every prompt showcase area", () => {
    const { container } = render(<LanguageProvider><PromptsPage /></LanguageProvider>);
    expect(screen.getByRole("heading", { name: "The prompts behind the product." })).toBeInTheDocument();
    expect(container.querySelectorAll("pre")).toHaveLength(promptShowcase.length);
    expect(screen.getByText(/Create a learning management dashboard with API operations/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/");
  });

  it("translates Chinese prompts and keeps Arabic prompts in English", async () => {
    const user = userEvent.setup();
    render(<LanguageProvider><PromptsPage /></LanguageProvider>);
    const language = screen.getByRole("combobox", { name: "Language" });

    await user.selectOptions(language, "zh-CN");
    expect(screen.getByRole("heading", { name: "产品背后的 Prompts。" })).toBeInTheDocument();
    expect(screen.getByText(/我想创建一个名为 CodeCraftHub/)).toBeInTheDocument();

    await user.selectOptions(language, "ar");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(screen.getByText(/I want to create a simple personalized learning platform/)).toBeInTheDocument();
  });
});
