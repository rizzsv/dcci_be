import prisma from "../../config/prisma.config";
import { ReportStatus } from "./report.types";

export class ReportRepository {
    static crete(data: any) {
        return prisma.report.create({data})
    }

    static findAllReports() {
        return prisma.report.findMany({
            include: {disaster: true}
        })
    }

    static findById(id: string) {
        return prisma.report.findUnique({
            where: { id },
            include: {
                disaster: true,
                handledBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })
    }

    static updateStatus(id: string, status: ReportStatus, handledById: string) {
        return prisma.report.update({
            where: { id },
            data: {
                status,
                handledById
            },
            include: {
                disaster: true,
                handledBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })
    }
}