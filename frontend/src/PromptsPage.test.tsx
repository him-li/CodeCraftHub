import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import PromptsPage from "./PromptsPage";
import { promptShowcase } from "./content/prompts";

afterEach(cleanup);

describe("Prompt journey page", () => {
  it("renders every prompt showcase area", () => {
    const { container } = render(<PromptsPage />);
    expect(screen.getByRole("heading", { name: "The prompts behind the product." })).toBeInTheDocument();
    expect(container.querySelectorAll("pre")).toHaveLength(promptShowcase.length);
    expect(screen.getByText(/Create a learning management dashboard with API operations/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/");
  });
});
