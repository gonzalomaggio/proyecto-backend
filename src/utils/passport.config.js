import { Strategy } from "passport-local";
import UsersDAO from "../daos/users.dao.js";
import { createHash, isValidPassword } from "./crypt.js";
import passport from "passport";

const initializePassport = () => {
  passport.use("register", new Strategy({ passReqToCallback: true, usernameField: "email" }, async (req, email, password, done) => {
    const { first_name, last_name, age } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return done(null, false);
    }

    const emailUsed = await UsersDAO.getUsersByEmail(email);

    if (emailUsed) {
      return done(null, false);
    } else {
      const user = await UsersDAO.insert(first_name, last_name, age, email, createHash(password));
      return done(null, user);
    }
  }));

  passport.use("login", new Strategy({ usernameField: "email" }, async (email, password, done) => {
    if (!email || !password) {
      return done(null, false);
    }

    const user = await UsersDAO.getUsersByEmail(email);

    if (!user || !isValidPassword(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UsersDAO.getUsersById(id);
    done(null, user);
  });
};

export default initializePassport;
