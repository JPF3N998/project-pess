import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Gets instance of Prisma client
 * @returns Prisma client
 */
export function usePrisma() {
  return prisma
}