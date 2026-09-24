// CodeCraftHub - a beginner-friendly REST API built with Express.
// Course data is stored in courses.json, so no database is required.

const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
// Use port 5000 by default. A PORT environment variable is useful for tests
// or environments where port 5000 is already being used by another program.
const PORT = process.env.PORT || 5000;
const COURSES_FILE = path.join(__dirname, "courses.json");
const VALID_STATUSES = ["Not Started", "In Progress", "Completed"];

// This middleware converts JSON request bodies into JavaScript objects.
app.use(express.json());

/**
 * Create courses.json the first time the application runs.
 * The "wx" flag creates the file only when it does not already exist.
 */
async function ensureCoursesFile() {
  try {
    await fs.writeFile(COURSES_FILE, "[]\n", { flag: "wx" });
  } catch (error) {
    // EEXIST simply means the file is already there, which is expected.
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

// Read and parse all courses from the JSON file.
async function readCourses() {
  const data = await fs.readFile(COURSES_FILE, "utf8");
  const courses = JSON.parse(data);

  // The data file should always contain a JSON array.
  if (!Array.isArray(courses)) {
    throw new Error("courses.json must contain a JSON array");
  }

  return courses;
}

// Save the complete course list. Indentation keeps the JSON easy to read.
async function writeCourses(courses) {
  await fs.writeFile(COURSES_FILE, `${JSON.stringify(courses, null, 2)}\n`, "utf8");
}

// Check both the YYYY-MM-DD format and whether it is a real calendar date.
function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// Return a validation message, or null when the supplied course is valid.
function validateCourse(course) {
  if (!course || typeof course !== "object" || Array.isArray(course)) {
    return "Request body must be a JSON object containing course fields";
  }

  const requiredFields = ["name", "description", "target_date", "status"];
  const missingFields = requiredFields.filter(
    (field) =>
      typeof course[field] !== "string" || course[field].trim().length === 0
  );

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  if (!isValidDate(course.target_date)) {
    return "target_date must be a valid date in YYYY-MM-DD format";
  }

  if (!VALID_STATUSES.includes(course.status)) {
    return `status must be one of: ${VALID_STATUSES.join(", ")}`;
  }

  return null;
}

// Convert an ID from the URL to a positive integer.
function parseCourseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// POST /api/courses - add a new course.
app.post("/api/courses", async (req, res, next) => {
  try {
    const validationError = validateCourse(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const courses = await readCourses();

    // Start at 1, then use one more than the greatest existing ID.
    const nextId = courses.reduce((highest, course) => {
      return Number.isInteger(course.id) ? Math.max(highest, course.id) : highest;
    }, 0) + 1;

    const newCourse = {
      id: nextId,
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      target_date: req.body.target_date,
      status: req.body.status,
      created_at: new Date().toISOString(),
    };

    courses.push(newCourse);
    await writeCourses(courses);

    return res.status(201).json(newCourse);
  } catch (error) {
    return next(error);
  }
});

// GET /api/courses - return every course.
app.get("/api/courses", async (req, res, next) => {
  try {
    const courses = await readCourses();
    return res.json(courses);
  } catch (error) {
    return next(error);
  }
});

// GET /api/courses/stats - summarize the number of courses in each status.
// This route must appear before /api/courses/:id so "stats" is not read as an ID.
app.get("/api/courses/stats", async (req, res, next) => {
  try {
    const courses = await readCourses();
    const byStatus = {
      "Not Started": 0,
      "In Progress": 0,
      Completed: 0,
    };

    for (const course of courses) {
      // Only count recognized statuses if the JSON file was edited manually.
      if (Object.hasOwn(byStatus, course.status)) {
        byStatus[course.status] += 1;
      }
    }

    return res.json({
      total: courses.length,
      by_status: byStatus,
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/courses/:id - return one course by ID.
app.get("/api/courses/:id", async (req, res, next) => {
  try {
    const id = parseCourseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: "Course ID must be a positive integer" });
    }

    const courses = await readCourses();
    const course = courses.find((item) => item.id === id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.json(course);
  } catch (error) {
    return next(error);
  }
});

// PUT /api/courses/:id - replace the editable fields of a course.
app.put("/api/courses/:id", async (req, res, next) => {
  try {
    const id = parseCourseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: "Course ID must be a positive integer" });
    }

    const validationError = validateCourse(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const courses = await readCourses();
    const courseIndex = courses.findIndex((item) => item.id === id);

    if (courseIndex === -1) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = {
      id,
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      target_date: req.body.target_date,
      status: req.body.status,
      // Keep the original creation time when updating the course.
      created_at: courses[courseIndex].created_at,
    };

    courses[courseIndex] = updatedCourse;
    await writeCourses(courses);

    return res.json(updatedCourse);
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/courses/:id - remove a course by ID.
app.delete("/api/courses/:id", async (req, res, next) => {
  try {
    const id = parseCourseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: "Course ID must be a positive integer" });
    }

    const courses = await readCourses();
    const courseIndex = courses.findIndex((item) => item.id === id);

    if (courseIndex === -1) {
      return res.status(404).json({ error: "Course not found" });
    }

    const [deletedCourse] = courses.splice(courseIndex, 1);
    await writeCourses(courses);

    return res.json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (error) {
    return next(error);
  }
});

// Return JSON for unknown routes instead of Express's default HTML response.
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Handle malformed JSON request bodies and file read/write errors in one place.
// Express recognizes this as error-handling middleware because it has 4 arguments.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Request body contains invalid JSON" });
  }

  console.error("Server error:", error.message);
  return res.status(500).json({
    error: "Unable to read or write course data",
  });
});

// Create the data file before accepting requests.
ensureCoursesFile()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CodeCraftHub API is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Could not initialize courses.json:", error.message);
    process.exitCode = 1;
  });
