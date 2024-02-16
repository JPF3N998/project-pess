import { Sequelize } from "sequelize"

if (!process.env.DATABASE_URL) {
  throw Error('No connection string to database')
}

const sequelize = new Sequelize(process.env.DATABASE_URL)

/**
 * Gets instance of Sequelize client
 * @returns Sequelize client
 */
export function useSequelize() {
  return sequelize
}

/**
 * Used to test connection to DB with Sequelize
 */
export async function ping() {
  try {
    await sequelize.authenticate()
    console.log('Sequelize ready :white_check_mark:')
  } catch (e) {
    throw Error('Ping failed to DB')
  }
}