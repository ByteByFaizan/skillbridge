import { z } from "zod";

// Zod schema for discovery input validation
const discoveryInputSchema = z.object({
  education: z.string().min(1, "Please select your education level.").max(100),
  skills: z
    .array(
      z.string().min(1).max(100, "Skill name must be less than 100 characters")
    )
    .min(1, "Please add at least one skill. You can add examples like Python, Excel, or Communication.")
    .max(20, "Maximum 20 skills allowed"),
  interests: z
    .array(
      z.string().min(1).max(100, "Interest must be less than 100 characters")
    )
    .min(1, "Please add at least one interest.")
    .max(20, "Maximum 20 interests allowed"),
  name: z.string().max(100).optional(),
  goal: z.string().max(500).optional(),
});

export type DiscoveryInput = z.infer<typeof discoveryInputSchema>;

export function validateDiscoveryInput(input: {
  education?: string;
  skills?: string[];
  interests?: string[];
  name?: string;
  goal?: string;
}): { valid: boolean; message?: string } {
  try {
    discoveryInputSchema.parse(input);
    return { valid: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { valid: false, message: err.issues[0]?.message || "Invalid input" };
    }
    return { valid: false, message: "Invalid input" };
  }
}

export function sanitizeInput(input: string): string {
  // More comprehensive sanitization:
  // 1. Trim whitespace
  // 2. Remove potentially dangerous characters for SQL/XSS
  // 3. Limit length to prevent buffer overflow
  return input
    .trim()
    .replace(/[<>"'`${}\\]/g, "")
    .slice(0, 1000);
}

export function sanitizeArray(arr: string[]): string[] {
  return arr
    .map((item) => sanitizeInput(item))
    .filter((item) => item.length > 0 && item.length < 100)
    .slice(0, 20); // Limit array size to prevent DoS
}
