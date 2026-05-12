export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(value);
}

export function isPassword(value: string): boolean {
  // At least:
  // - 8 characters
  // - one uppercase letter
  // - one lowercase letter
  // - one number
  // - one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

  return passwordRegex.test(value);
}

export function isUserName(value: string): boolean {
  // 3–20 characters
  // letters, numbers, underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  return usernameRegex.test(value);
}

export function isCode(value: string): boolean {
  // Exactly 6 digits
  const codeRegex = /^\d{6}$/;

  return codeRegex.test(value);
}
