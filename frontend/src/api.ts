import type { Course, CourseInput } from "./types";

const API_URL = "/api/courses";

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const body = (await response.json()) as T | { error?: string };
  if (!response.ok) {
    const message = typeof body === "object" && body && "error" in body ? body.error : undefined;
    throw new Error(message || `Request failed with HTTP ${response.status}`);
  }
  return body as T;
}

export const courseApi = {
  list: () => apiRequest<Course[]>(API_URL),
  create: (course: CourseInput) => apiRequest<Course>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  }),
  update: (id: number, course: CourseInput) => apiRequest<Course>(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  }),
  remove: (id: number) => apiRequest<{ message: string }>(`${API_URL}/${id}`, { method: "DELETE" }),
};
