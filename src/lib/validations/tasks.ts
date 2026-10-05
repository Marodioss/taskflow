import z from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const toggleTaskSchema = z.object({
  id: z.string().min(1),
  completed: z.boolean(),
});
