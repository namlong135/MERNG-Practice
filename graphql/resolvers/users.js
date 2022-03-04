const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET_KEY } = require("../../config.js");
const User = require("../../models/User");
const { validateRegisterInput, validateLoginInput } = require("../../util/validator");

function generateToken(val) {
  return jwt.sign({
    id: val.id,
    email: val.email,
    username: val.username
  }, SECRET_KEY, { expiresIn: "1h" });
}

module.exports = {
  Mutation: {
    async register(source, { registerInput: { username, email, password, confirmPassword } }) {
      // Validate user input
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError("Errors", { errors })
      }
      // Check existing user with username and email
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("user taken", {
          errors: {
            username: "user taken"
          }
        })
      }
      // Hashing password
      password = await bcrypt.hash(password, 8);

      const newUser = new User({
        email,
        password,
        username,
        createdAt: new Date().toISOString()
      })

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      }
    },
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });
      const match = await bcrypt.compare(password, user.password);
      const token = generateToken(user);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
  }
}