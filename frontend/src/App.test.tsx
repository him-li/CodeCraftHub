import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { LanguageProvider } from "./i18n";

const renderApp = () => render(<LanguageProvider><App /></LanguageProvider>);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CodeCraftHub dashboard", () => {
  it("loads courses and renders dashboard statistics", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([{ id: 1, name: "React", description: "Learn components", target_date: "2026-12-10", status: "In Progress", created_at: "2026-01-01T00:00:00.000Z" }]), { status: 200, headers: { "Content-Type": "application/json" } }));
    renderApp();
    expect(await screen.findByText("React")).toBeInTheDocument();
    expect(screen.getByText("In progress").nextElementSibling).toHaveTextContent("1");
  });

  it("creates a course from the form", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock.mockResolvedValueOnce(new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } }));
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, name: "TypeScript", description: "Learn type safety", target_date: "2026-12-20", status: "Not Started", created_at: "2026-01-01T00:00:00.000Z" }), { status: 201, headers: { "Content-Type": "application/json" } }));
    const user = userEvent.setup();
    renderApp();
    await screen.findByText("No courses yet");
    await user.type(screen.getByLabelText("Course name"), "TypeScript");
    await user.type(screen.getByLabelText("Description"), "Learn type safety");
    await user.type(screen.getByLabelText("Target date"), "2026-12-20");
    await user.click(screen.getByRole("button", { name: "Add course" }));
    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
