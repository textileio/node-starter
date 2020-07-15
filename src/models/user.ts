import { Database, open } from "sqlite"
import sqlite3 from "sqlite3"
import logger from "../util/logger"

let db: Database
;(async () => {
  try {
    db = await open({
      filename: ":memory:",
      driver: sqlite3.Database,
    })
    const create = `
            CREATE TABLE IF NOT EXISTS users (
                providerId TEXT NOT NULL PRIMARY KEY,
                provider TEXT,
                email TEXT
            );
        `
    await db.run(create)
  } catch (e) {
    logger.error("Unable to create database.", e)
    process.exit(1)
  }
})()

export type User = {
  provider: string
  providerId: string
  email: string
}

export const findOne = async function (where: string): Promise<User | undefined> {
  const q = `SELECT provider, providerId, email FROM users WHERE ${where}`
  const row = await db.get(q)
  if (!row) {
    return undefined
  } else {
    const user: User = {
      provider: row.provider,
      providerId: row.providerId,
      email: row.email,
    }
    return user
  }
}

export const findByProvider = async function (
  provider: string,
  providerId: string,
): Promise<User | undefined> {
  const q = "SELECT provider, providerId, email FROM users WHERE provider = ? and providerId = ?"
  const row = await db.get(q, provider, providerId)
  if (!row) {
    return undefined
  } else {
    const user: User = {
      provider: row.provider,
      providerId: row.providerId,
      email: row.email,
    }
    return user
  }
}

export const save = async function (user: User): Promise<void> {
  const existingUser = await findByProvider(user.provider, user.providerId)
  if (existingUser) {
    const sql = `
            UPDATE users
            SET email = ?
            WHERE provider = ? and providerId = ?
        `
    await db.run(sql, user.email, user.provider, user.providerId)
  } else {
    const sql = `
            INSERT INTO users(provider, providerId, email)
            VALUES
                (?, ?, ?)
        `
    await db.run(sql, user.provider, user.providerId, user.email)
  }
}

export const remove = async function (provider: string, providerId: string): Promise<void> {
  const sql = "DELETE FROM users WHERE provider = ? and providerId = ?"
  await db.run(sql, provider, providerId)
}
