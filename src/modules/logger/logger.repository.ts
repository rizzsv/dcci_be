import prisma from "../../config/prisma.config";

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