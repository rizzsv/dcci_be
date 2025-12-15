import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class LoggerRepository {
    static create(data: any) {
        return prisma.transactionLog.create({
            data
        })
    }

    static findByEntity(entity: string) {
        return prisma.transactionLog.findMany({
            where: {entity}
        })
    }
}