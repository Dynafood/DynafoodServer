import { Router } from 'express';
import passport from "passport";
import { createUserOAuth, OAuthUserObj } from '../modules/user';
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const google = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8081/user/login/google/callback",
}

passport.use(
  new GoogleStrategy(
    google,
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const obj = profile["_json"];
      const userdata: OAuthUserObj = {
          firstName: obj.given_name,
          lastName: obj.family_name,
          displayName: obj.name,
          id: profile.id,
          email: obj.email,
          imageLink: obj.picture,
          cc: obj.locale,
      }

      // createUserOAuth(userdata);

      //done(err, user) will return the user we got from fb
      //done(null, formatGoogle(profile._json));
      done(null, userdata);
    }
  )
);

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user: false | Express.User, done) => done(null, user));

const router : Router = Router();

let global_userdata: OAuthUserObj = {
  firstName: "",
          lastName: "",
          displayName: "",
          id: "",
          email: "",
          imageLink: "",
          cc: "",
};
router.get('/user/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));



router.get('/user/login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  async function(_req, res) {
      console.log("USER STUFF", _req.user);
      const token = await createUserOAuth(_req.user as OAuthUserObj);
      res.cookie('token', token, {
          httpOnly: true
      });
      res.status(200).json(token);
});

export default router;
