import prisma from "../../config/prisma.config"

export class DisasterRepository {
    static create(data: any) {
        return prisma.disaster.create({data})
    }

    static findAllactive() {
        return prisma.disaster.findMany({
            where: {status: 'ACTIVE'},
            include: {report: true}
        })
    }

    static findById(id: string) {
        return prisma.disaster.findUnique({
            where: {id},
            include: {report: true}
        })
    }

    static resolve(id: string, resolvedAt: Date) {
        return prisma.disaster.update({
            where: {id},
            data: {
                status: 'RESOLVED',
                resolvedAt
            }
        })
    }
}