import prisma from "../../config/prisma.config";

export class ReportRepository {
    static crete(data: any) {
        return prisma.report.create({data})
    }
}