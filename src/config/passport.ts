import { NextFunction, Request, Response } from "express"
import passport from "passport"
import passportGithub from "passport-github2"
import passportGoogle from "passport-google-oauth20"
import oauth2 from "passport-oauth2"
import passportTwitter from "passport-twitter"
import { findByProvider, save, User } from "../models/user"
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
} from "../util/env"

passport.serializeUser<User, string>((user, done) => {
  const cookie = `${user.provider}--${user.providerId}`
  done(undefined, cookie)
})

passport.deserializeUser<User, string>(async (cookie, done) => {
  try {
    const parts = cookie.split("--")
    const user = await findByProvider(parts[0], parts[1])
    done(undefined, user)
  } catch (e) {
    done(e)
  }
})

passport.use(
  "github",
  new passportGithub.Strategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    },
    async (
      _: string,
      __: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile: any,
      done: oauth2.VerifyCallback,
    ) => {
      try {
        let user: User = {
          provider: "github",
          providerId: profile.id,
          email: profile._json.email,
        }
        const existingUser = await findByProvider("github", profile.id)
        if (existingUser) {
          user = { ...existingUser, ...user }
        }
        await save(user)
        return done(undefined, user)
      } catch (e) {
        done(e)
      }
    },
  ),
)

passport.use(
  "google",
  new passportGoogle.Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (_: string, __: string, profile: any, done: any) => {
      try {
        let user: User = {
          provider: "google",
          providerId: profile.id,
          email: profile._json.email,
        }
        const existingUser = await findByProvider("google", profile.id)
        if (existingUser) {
          user = { ...existingUser, ...user }
        }
        await save(user)
        return done(undefined, user)
      } catch (e) {
        done(e)
      }
    },
  ),
)

passport.use(
  "twitter",
  new passportTwitter.Strategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
    },
    async (
      _: string,
      __: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile: any,
      done: oauth2.VerifyCallback,
    ) => {
      try {
        let user: User = {
          provider: "twitter",
          providerId: profile.id,
          email: profile._json.email,
        }
        const existingUser = await findByProvider("twitter", profile.id)
        if (existingUser) {
          user = { ...existingUser, ...user }
        }
        await save(user)
        return done(undefined, user)
      } catch (e) {
        done(e)
      }
    },
  ),
)

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/auth/github")
}
