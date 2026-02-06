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
