import passport from "passport";
import GitHubStrategy from "passport-github2";
import UsersDAO from "../daos/users.dao.js";

const initializePassportGithub = () => {
  passport.use("github", new GitHubStrategy({
    clientID: "Iv1.52c847d25095117a",
    clientSecret: "24288f6a9d734d83e0989d0a24f9bec4107a3516",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      if (profile._json && typeof profile._json.email === 'string') {
        let user = await UsersDAO.getUsersByEmail(profile._json.email);
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 18,
            email: profile._json.email,
            password: ""
          }
          let result = await UsersDAO.insertOne(newUser);
          return done(null, result);
        } else {
          return done(null, user);
        }
      } else {
        console.error('Email no válido en el perfil de GitHub:', profile._json);
        return done(new Error('Email no válido en el perfil de GitHub'));
      }
    } catch (error) {
      console.error('Error al autenticar con GitHub:', error);
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UsersDAO.getUsersById(id);
    done(null, user);
  });
}

export default initializePassportGithub;
