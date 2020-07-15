import express from "express"
import session from "express-session"
import passport from "passport"
import path from "path"
import * as passportConfig from "./config/passport"
import { EXPRESS_PORT, SESSION_SECRET } from "./util/env"

// Create Express server
const app = express()

// Express configuration
app.set("port", EXPRESS_PORT || 3000)
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }))
app.set("views", path.join(__dirname, "../views"))
app.set("view engine", "pug")
app.use(session({ resave: false, saveUninitialized: false, secret: SESSION_SECRET }))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

/**
 * Primary app routes.
 */
app.get("/", (_, res) => {
  res.render("home", {
    title: "Home",
  })
})

app.get("/user", passportConfig.isAuthenticated, (_, res) => {
  res.render("user", {
    title: "User",
  })
})

app.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

/**
 * OAuth authentication routes for GitHub. (Sign in)
 */
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }))
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (_, res) => {
    res.redirect("/user")
  },
)

/**
 * OAuth authentication routes for Google. (Sign in)
 */
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (_, res) => {
    res.redirect("/user")
  },
)

/**
 * OAuth authentication routes for Twitter. (Sign in)
 */
app.get("/auth/twitter", passport.authenticate("twitter", { scope: ["user:email"] }))
app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  (_, res) => {
    res.redirect("/user")
  },
)

export default app
