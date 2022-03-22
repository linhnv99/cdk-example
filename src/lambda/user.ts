
   
// import { ProxyHandler } from 'aws-lambda'
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL,
//     },
//   },
// })

// export const userHandler: ProxyHandler = async () => {
//   let users = await prisma.user.findMany()

//   return {
//     statusCode: 200,
//     body: JSON.stringify({ users }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   }
// }
