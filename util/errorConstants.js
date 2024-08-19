export const errorName = {
  EXISTEMAIL: "EXISTEMAIL",
  NOTEXISTEMAIL: "NOTEXISTEMAIL",
  ISVALIDEMAIL: "ISVALIDEMAIL",
  ISVALIDPASSWORDLOWERCASE: "ISVALIDPASSWORDLOWERCASE",
  ISVALIDPASSWORDUPPERCASE: "ISVALIDPASSWORDUPPERCASE",
  ISVALIDPASSWORDNUMBER: "ISVALIDPASSWORDNUMBER",
  ISVALIDPASSWORDSIMBOL: "ISVALIDPASSWORDSIMBOL",
  ISVALIDPASSWORDLENGTH: "ISVALIDPASSWORDLENGTH",
  NOTUSERFOUND: "NOTUSERFOUND",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  NOTVALIDPASSWORD: "NOTVALIDPASSWORD",
  INVALIDACTION: "INVALIDACTION",
  NOTTASKFOUND: "NOTTASKFOUND",
};

export const getErrorCode = (message) => {
  switch (message) {
    case "EXISTING_EMAIL":
      return {
        message: "Email taken, try with other email",
        statusCode: 400,
      };
    case "NOT_EXIST_EMAIL":
      return {
        message: "Not user with this email found",
        statusCode: 404,
      };
    case "INVALID_EMAIL":
      return { message: "Email not in proper format", statusCode: 400 };
    case "INVALID_PASSWORD_LOWERCASE":
      return {
        message: "Password must contain a lowercase letter",
        statusCode: 400,
      };
    case "INVALID_PASSWORD_UPPERCASE":
      return {
        message: "Password must contain an uppercase letter",
        statusCode: 400,
      };
    case "INVALID_PASSWORD_NUMBER":
      return { message: "Password must contain a number", statusCode: 400 };
    case "INVALID_PASSWORD_SIMBOL":
      return {
        message:
          "Password must contain at least one special symbol (!@#$%&*...)",
        statusCode: 400,
      };
    case "INVALID_PASSWORD_LENGTH":
      return {
        message: "Password must have more then 8 characters",
        statusCode: 400,
      };
    case "USER_NOT_FOUND":
      return { message: "User not found.", statusCode: 404 };
    case "UNAUTHENTICATED":
      return {
        message: "Authentication failed, try to sign up or login again",
        statusCode: 401,
      };
    case "NOT_VALID_PASSWORD":
      return { message: "Invalid password", statusCode: 403 };
    case "INVALID_ACTION":
      return { message: "Unauthorized action, log in again", statusCode: 401 };
    case "TASK_NOT_FOUND":
      return { message: "No task found.", statusCode: 404 };
    case "INTERNAL_SERVER_ERROR":
      return { message: "Internal server error", statusCode: 500 };
    default:
      return { message: "Unknown error", statusCode: 500 };
  }
};
