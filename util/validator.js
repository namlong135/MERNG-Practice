module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = 'username cannot be empty';
  }
  if (email.trim() === "") {
    errors.email = "email cannot be empty";
  } else {
    const EMAIL_CONDITION_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(EMAIL_CONDITION_REGEX)) {
      errors.email = "Email not correct format"
    }
  }
  if (password.trim() === "") {
    errors.password = "password cannot empty"
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "password not match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = 'username cannot empty';
  }
  if (password === "") {
    errors.password = "password cannot empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}