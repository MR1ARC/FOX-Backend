import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role } from '../../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma, Role }

let isShuttingDown = false

const shutdown = async()=>{
    if(isShuttingDown) return;
    isShuttingDown = true
    console.log("shutting down the db connection...");
    await prisma.$disconnect();
   
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown)