export const COURSE_STATUSES = ["Not Started", "In Progress", "Completed"] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export interface Course {
  id: number;
  name: string;
  description: string;
  target_date: string;
  status: CourseStatus;
  created_at: string;
}

export type CourseInput = Pick<Course, "name" | "description" | "target_date" | "status">;
