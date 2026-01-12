import prisma from "../../config/prisma.config";

export class ReportRepository {
    static crete(data: any) {
        return prisma.report.create({data})
    }

    static findAllReports() {
        return prisma.report.findMany({
            include: {disaster: true}
        })
    }
}