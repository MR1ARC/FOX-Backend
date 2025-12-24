import { prisma, Role } from "./db/prisma";
import "dotenv/config";

const users = async () => {
  return await prisma.user.findMany({
    where: { role: Role.ADMIN },
    include: {
      profile: true
    }
  })
}

console.log(await users())


