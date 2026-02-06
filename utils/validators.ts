export function validateDiscoveryInput(input: {
  education?: string;
  skills?: string[];
  interests?: string[];
}): { valid: boolean; message?: string } {
  if (!input.education?.trim()) {
    return { valid: false, message: "Please select your education level." };
  }
  if (!input.skills?.length) {
    return {
      valid: false,
      message: "Please add at least one skill. You can add examples like Python, Excel, or Communication.",
    };
  }
  if (!input.interests?.length) {
    return {
      valid: false,
      message: "Please add at least one interest.",
    };
  }
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"']/g, "");
}

export function sanitizeArray(arr: string[]): string[] {
  return arr
    .map((item) => sanitizeInput(item))
    .filter((item) => item.length > 0 && item.length < 100);
}
