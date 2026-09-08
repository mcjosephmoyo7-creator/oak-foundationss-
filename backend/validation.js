function validateAttendee(attendee) {
  const errors = [];

  if (!attendee.first_name || attendee.first_name.trim() === "") {
    errors.push("First name is required");
  }

  if (!attendee.last_name || attendee.last_name.trim() === "") {
    errors.push("Last name is required");
  }

  if (!attendee.email || attendee.email.trim() === "") {
    errors.push("Email is required");
  }

  if (attendee.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(attendee.email)) {
      errors.push("Invalid email address");
    }
  }

  return errors;
}

module.exports = {
  validateAttendee
};