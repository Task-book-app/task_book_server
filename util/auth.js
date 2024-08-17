import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config.js";
import User from "../models/User.js";
// import { errorName } from "./errorConstants.js";

export const createJWToken = (userId) => {
  return jwt.sign({ _id: userId }, config.secretKey, {
    expiresIn: "2d",
  });
};

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 9);
};

export const passwordIsValid = (inputPassword, userPassword) => {
  return bcrypt.compareSync(inputPassword, userPassword);
};

export const initialUsername = (email) => {
  return email.split("@")[0];
};

export const findByToken = async (token) => {
  let decoded = jwt.verify(token, config.secretKey);

  const authorized = await User.findOne({ _id: decoded._id });
  // if (!authorized) throw new Error("USER_NOT_FOUND");
  return authorized;
};

export const existingEmail = async (email) => {
  const exist = await User.findOne({ email });
  return exist ? true : false;
};

export const trimed = (email) => email.trim().toLowerCase();

export const isValidEmail = (email) => {
  const emailExpression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const testEmail = emailExpression.test(String(email).toLowerCase());

  return testEmail;
};

export const isValidPassword = (password) => {
  // Validate lowercase letters
  const lowerCaseLetters = /[a-z]/g;
  if (!password.match(lowerCaseLetters))
    throw new Error("INVALID_PASSWORD_LOWERCASE");

  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if (!password.match(upperCaseLetters))
    throw new Error("INVALID_PASSWORD_UPPERCASE");

  // Validate numbers
  const numbers = /[0-9]/g;
  if (!password.match(numbers)) throw new Error("INVALID_PASSWORD_NUMBER");

  // Validate simbols
  const simbols = /[^A-Za-z0-9]/;
  if (!password.match(simbols)) throw new Error("INVALID_PASSWORD_SIMBOL");

  if (password.length <= 8) throw new Error("INVALID_PASSWORD_LENGTH");
};
