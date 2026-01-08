import prisma from "../../config/prisma.config";
import { DisasterRepository } from "./disaster.repository";

export class DisasterService {
    static async create(payload: any, userId: string) {
        return prisma.$transaction(async (tx) => {
            const disaster = await tx.disaster.create({
                data: {
                    ...payload,
                    status: 'ACTIVE',
                },
            });

            await tx.report.update({
                where: { id: payload.reportId },
                data: { status: 'VERIFIED' }
            });

            await tx.transactionLog.create({
                data: {
                    entity: 'DISASTER',
                    entityId: disaster.id,
                    action: 'CREATE',
                    userId,
                    after: disaster
                },
            });

            return disaster;
        });
    }

    static async resolve(id: string, userId: string) {
        return prisma.$transaction(async (tx) => {
            const disaster = await tx.disaster.update({
                where: { id },
                data: {
                    status: 'RESOLVED',
                    resolvedAt: new Date()
                },
            });

            await tx.transactionLog.create({
                data: {
                    entity: 'DISASTER',
                    entityId: disaster.id,
                    action: 'RESOLVE',
                    userId,
                    after: disaster
                },
            });

            return disaster;
        })
    }

    static getActive() {
        return DisasterRepository.findAllactive();
    }
}