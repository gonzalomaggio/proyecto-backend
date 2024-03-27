import { Strategy } from "passport-jwt";
import passport from "passport";
import UsersDAO from "../daos/users.dao.js";

passport.use("jwt", new Strategy({
  jwtFromRequest: (req) => {
    var token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  },
  secretOrKey: "secret_jwt"
}, async function (jwt_payload, done) {
  let userId = jwt_payload.id;
  try {
    let user = await UsersDAO.getUsersById(userId);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
}));


export default passport;