import { describe, it, expect } from "vitest";
import { createTaskSchema, toggleTaskSchema } from "./tasks";

describe("Task Validation Schemas", () => {
  // Test 1: Valid task title
  it("accepts a valid title", () => {
    const result = createTaskSchema.safeParse({ title: "Ship Level 1" });
    expect(result.success).toBe(true);
  });

  // Test 2: Whitespace trimming
  it("trims leading and trailing whitespace", () => {
    const result = createTaskSchema.safeParse({ title: "   Write tests   " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Write tests");
    }
  });

  // Test 3: Rejects empty or whitespace-only title
  it("rejects an empty or whitespace-only title", () => {
    // TODO: Test that empty title ("") or whitespace ("   ") fails
    const result = createTaskSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });

  // Test 4: Rejects titles over 100 characters
  it("rejects titles exceeding 100 characters", () => {
    // TODO: Create a string with 101 characters and verify result.success is false
    const longTitle = "a".repeat(101);
    const result = createTaskSchema.safeParse({ title: longTitle });
    expect(result.success).toBe(false);
  });

  // Test 5: Toggle task validation
  it("validates toggleTaskSchema properly", () => {
    // TODO: Verify valid id & boolean passes, missing id fails
    const valid = toggleTaskSchema.safeParse({ id: "task-1", completed: true });
    expect(valid.success).toBe(true);

    const invalid = toggleTaskSchema.safeParse({ id: "", completed: true });
    expect(invalid.success).toBe(false);
  });
  it("returns the exact error message when title is empty", () => {
    const result = createTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Title cannot be empty");
    }
  });
});
