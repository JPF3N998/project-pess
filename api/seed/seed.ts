// Source of products: https://dummyjson.com/docs/products

import { type User, type Product, PrismaClient } from '@prisma/client'

const BASE_URL = 'https://dummyjson.com'
const PRODUCTS_URL = [BASE_URL, 'products?limit=50'].join('/')
 // Skip first two, second entry has sub and top level domain on email
const USERS_URL = [BASE_URL, 'users?limit=10&skip=2'].join('/')

interface APIProduct {
  title: string
  price: number
}

interface UsersResponse {
  users: User[]
}

interface ProductsResponse {
  products: APIProduct[]
}

// Users
const { users } = await (await fetch(USERS_URL)).json() as UsersResponse
const usersToInsert = users.map(({ email }) => ({ email }))

// Products
const { products } = await (await fetch(PRODUCTS_URL)).json() as ProductsResponse
const productsToInsert = products.map(({ title, price }) => ({ name: title, price }))

export async function seed() {
  const prisma = new PrismaClient()

  const usersCount = await prisma.user.createMany({ data: usersToInsert, skipDuplicates: true })
  const productsCount = await prisma.product.createMany({ data: productsToInsert, skipDuplicates: true })
  
  return console.log(`Insert counts`, {
    users: usersCount.count,
    products: productsCount.count
  })
}
