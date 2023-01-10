import { Router } from 'express';
import passport from "passport";
import { createUserOAuth, OAuthUserObj } from '../modules/user';
import * as dotenv from 'dotenv';
dotenv.config();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


const google = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL: "http://localhost:8081/user/login/google/callback",
    callbackURL: "http://x2024dynafood545437452001.westeurope.cloudapp.azure.com:8081/user/login/google/callback",
}
const facebook = {
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    //todo: based on env, change url to localhost, dev or prod
    //callbackURL: "http://localhost:8081/user/login/facebook/callback",
    callbackURL: "http://x2024dynafood545437452001.westeurope.cloudapp.azure.com:8081/user/login/facebook/callback",
    enableProof: true, //to enable secret proof
    profileFields: ['id', 'emails', 'name'] //scope of fields
};

passport.use(
    /*

{
  id: '5759092440837279',
  username: undefined,
  displayName: undefined,
  name: { familyName: 'Taubert', givenName: 'Marcel', middleName: undefined },
  gender: undefined,
  profileUrl: undefined,
  emails: [ { value: 'rs0112358@gmail.com' } ],
  provider: 'facebook',
  _raw: '{"id":"5759092440837279","email":"rs0112358\\u0040gmail.com","last_name":"Taubert","first_name":"Marcel"}',
  _json: {
    id: '5759092440837279',
    email: 'rs0112358@gmail.com',
    last_name: 'Taubert',
    first_name: 'Marcel'
  }
}
    */
    new FacebookStrategy(
        facebook,
        async (accessToken: any, refreshToken: any, profile: any, done: any) => {
            console.log(profile);
            const userdata: OAuthUserObj = {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                displayName: profile.username || profile.displayName || profile.name.givenName + " " + profile.name.familyName,
                id: profile.id,
                email: profile._json.email,
                imageLink: profile.profileUrl,
                cc: "", // @todo figure out how to get this
            }
            done(null, userdata);
        }
    )
);

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

router.get("/user/login/facebook", passport.authenticate("facebook", { scope: ["email"] })); //define the scope to also access the email

router.get("/user/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async function(_req, res) {
      console.log("USER STUFF", _req.user);
      const token = await createUserOAuth(_req.user as OAuthUserObj);
      res.cookie('token', token, {
          httpOnly: true
      });
      res.status(200).json(token);
});

export default router;
