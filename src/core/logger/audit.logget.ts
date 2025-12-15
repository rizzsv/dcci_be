import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auditLogger = async (data: {
    entity: string;
    entityId: string;
    action: string;
    userId?: string;
    before?: any
    after?: any
}) => {
    await prisma.transactionLog.create({
        data
    })
}