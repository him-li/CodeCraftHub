import express, { type NextFunction, type Request, type Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type CourseStatus = "Not Started" | "In Progress" | "Completed";

export interface Course {
  id: number;
  name: string;
  description: string;
  target_date: string;
  status: CourseStatus;
  created_at: string;
}

type CourseInput = Pick<Course, "name" | "description" | "target_date" | "status">;

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5000;
const COURSES_FILE = process.env.COURSES_FILE || (
  process.env.VERCEL
    ? path.join("/tmp", "codecrafthub-courses.json")
    : path.join(currentDirectory, "courses.json")
);
const FRONTEND_DIST = path.join(currentDirectory, "public");
const VALID_STATUSES: CourseStatus[] = ["Not Started", "In Progress", "Completed"];

app.use(express.json());

async function ensureCoursesFile(): Promise<void> {
  try {
    await fs.writeFile(COURSES_FILE, "[]\n", { flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
}

async function readCourses(): Promise<Course[]> {
  const data = await fs.readFile(COURSES_FILE, "utf8");
  const courses: unknown = JSON.parse(data);
  if (!Array.isArray(courses)) throw new Error("courses.json must contain a JSON array");
  return courses as Course[];
}

async function writeCourses(courses: Course[]): Promise<void> {
  await fs.writeFile(COURSES_FILE, `${JSON.stringify(courses, null, 2)}\n`, "utf8");
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validateCourse(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "Request body must be a JSON object containing course fields";
  }
  const course = value as Record<string, unknown>;
  const requiredFields = ["name", "description", "target_date", "status"];
  const missingFields = requiredFields.filter(
    (field) => typeof course[field] !== "string" || (course[field] as string).trim().length === 0,
  );
  if (missingFields.length > 0) return `Missing required fields: ${missingFields.join(", ")}`;
  if (!isValidDate(course.target_date as string)) return "target_date must be a valid date in YYYY-MM-DD format";
  if (!VALID_STATUSES.includes(course.status as CourseStatus)) return `status must be one of: ${VALID_STATUSES.join(", ")}`;
  return null;
}

function parseCourseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.use("/api", async (_req, _res, next) => {
  try {
    await ensureCoursesFile();
    next();
  } catch (error) {
    next(error);
  }
});

app.post("/api/courses", async (req, res, next) => {
  try {
    const validationError = validateCourse(req.body);
    if (validationError) return res.status(400).json({ error: validationError });
    const input = req.body as CourseInput;
    const courses = await readCourses();
    const newCourse: Course = {
      id: courses.reduce((highest, course) => Math.max(highest, course.id), 0) + 1,
      name: input.name.trim(),
      description: input.description.trim(),
      target_date: input.target_date,
      status: input.status,
      created_at: new Date().toISOString(),
    };
    courses.push(newCourse);
    await writeCourses(courses);
    return res.status(201).json(newCourse);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/courses", async (_req, res, next) => {
  try {
    return res.json(await readCourses());
  } catch (error) {
    return next(error);
  }
});

app.get("/api/courses/stats", async (_req, res, next) => {
  try {
    const courses = await readCourses();
    const byStatus: Record<CourseStatus, number> = { "Not Started": 0, "In Progress": 0, Completed: 0 };
    for (const course of courses) if (VALID_STATUSES.includes(course.status)) byStatus[course.status] += 1;
    return res.json({ total: courses.length, by_status: byStatus });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/courses/:id", async (req, res, next) => {
  try {
    const id = parseCourseId(req.params.id);
    if (id === null) return res.status(400).json({ error: "Course ID must be a positive integer" });
    const course = (await readCourses()).find((item) => item.id === id);
    return course ? res.json(course) : res.status(404).json({ error: "Course not found" });
  } catch (error) {
    return next(error);
  }
});

app.put("/api/courses/:id", async (req, res, next) => {
  try {
    const id = parseCourseId(req.params.id);
    if (id === null) return res.status(400).json({ error: "Course ID must be a positive integer" });
    const validationError = validateCourse(req.body);
    if (validationError) return res.status(400).json({ error: validationError });
    const courses = await readCourses();
    const courseIndex = courses.findIndex((course) => course.id === id);
    if (courseIndex === -1) return res.status(404).json({ error: "Course not found" });
    const input = req.body as CourseInput;
    const updatedCourse: Course = {
      id,
      name: input.name.trim(),
      description: input.description.trim(),
      target_date: input.target_date,
      status: input.status,
      created_at: courses[courseIndex].created_at,
    };
    courses[courseIndex] = updatedCourse;
    await writeCourses(courses);
    return res.json(updatedCourse);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/courses/:id", async (req, res, next) => {
  try {
    const id = parseCourseId(req.params.id);
    if (id === null) return res.status(400).json({ error: "Course ID must be a positive integer" });
    const courses = await readCourses();
    const courseIndex = courses.findIndex((course) => course.id === id);
    if (courseIndex === -1) return res.status(404).json({ error: "Course not found" });
    const [deletedCourse] = courses.splice(courseIndex, 1);
    await writeCourses(courses);
    return res.json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (error) {
    return next(error);
  }
});

app.use(express.static(FRONTEND_DIST));
app.get("/", (_req, res, next) => {
  res.sendFile(path.join(FRONTEND_DIST, "index.html"), (error) => (error ? next(error) : undefined));
});
app.use((_req, res) => res.status(404).json({ error: "Endpoint not found" }));

app.use((error: Error & { code?: string; status?: number; body?: unknown }, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Request body contains invalid JSON" });
  }
  if (error.code === "ENOENT" && req.path === "/") {
    return res.status(503).json({ error: "Frontend build not found. Run npm run build first." });
  }
  console.error("Server error:", error.message);
  return res.status(500).json({ error: "Unable to read or write course data" });
});

if (!process.env.VERCEL) {
  ensureCoursesFile()
    .then(() => app.listen(PORT, () => console.log(`CodeCraftHub is running at http://localhost:${PORT}`)))
    .catch((error: Error) => {
      console.error("Could not initialize courses.json:", error.message);
      process.exitCode = 1;
    });
}

export default app;
