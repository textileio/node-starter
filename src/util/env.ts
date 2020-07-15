import dotenv from "dotenv"
import fs from "fs"
import logger from "./logger"

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply config environment variables")
  dotenv.config({ path: ".env" })
} else {
  logger.debug("Using .env.example file to supply config environment variables")
  dotenv.config({ path: ".env.example" }) // you can delete this after you create your own .env file!
}

export const ENV = process.env.NODE_ENV
export const PROD = ENV === "production" // Anything else is treated as 'dev'

export const EXPRESS_PORT = process.env["EXPRESS_PORT"]

export const SESSION_SECRET = mustResolve("SESSION_SECRET")

export const GITHUB_CLIENT_ID = mustResolve("GITHUB_CLIENT_ID")

export const GITHUB_CLIENT_SECRET = mustResolve("GITHUB_CLIENT_SECRET")

export const GOOGLE_CLIENT_ID = mustResolve("GOOGLE_CLIENT_ID")

export const GOOGLE_CLIENT_SECRET = mustResolve("GOOGLE_CLIENT_SECRET")

export const TWITTER_CONSUMER_KEY = mustResolve("TWITTER_CONSUMER_KEY")

export const TWITTER_CONSUMER_SECRET = mustResolve("TWITTER_CONSUMER_SECRET")

function mustResolve(name: string) {
  const value = process.env[name]
  if (!value) {
    logger.error(`No value for ${name}. Set ${name} environment variable.`)
    return process.exit(1)
  }
  return value
}
