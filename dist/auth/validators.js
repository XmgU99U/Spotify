"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmail = isEmail;
exports.isPassword = isPassword;
exports.isUserName = isUserName;
exports.isCode = isCode;
function isEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}
function isPassword(value) {
    // At least:
    // - 8 characters
    // - one uppercase letter
    // - one lowercase letter
    // - one number
    // - one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;
    return passwordRegex.test(value);
}
function isUserName(value) {
    // 3–20 characters
    // letters, numbers, underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(value);
}
function isCode(value) {
    // Exactly 6 digits
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(value);
}
