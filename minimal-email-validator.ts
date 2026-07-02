/**
 * Lax e-mail validator. Allows many invalid emails, but never denies a valid email.
 * Only has a few checks, because a comprehensive validation would be very complicated.
 * Those regexes you see on the internet deny many valid addresses. Check out https://e-mail.wtf/
 * The best way to validate an e-mail is to try sending a mail to it.
 */
export default function validateEmail(email: string) {
    return email.length >= 3 &&
        email.includes("@") &&
        email[0] != "@" &&
        email[email.length-1] != "@";
}
