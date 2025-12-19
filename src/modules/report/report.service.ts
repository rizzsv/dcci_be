import prisma from '../../config/prisma.config'
import { ReportRepository } from './report.repository'
import { LoggerService } from '../logger/logger.service'
import { ReportStatus } from './report.types'
import { connect } from 'node:http2'

export class ReportService {
    static async create(payload: any, userId?: string) {
        return prisma.$transaction(async(tx) => {
            const report = await tx.report.create({
                data: {
                    title: payload.title,
                    type: payload.type,
                    description: payload.description,
                    location: payload.location,
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    photoUrl: payload.photoUrl,
                    status: ReportStatus.PENDING,
                    ...(userId && {
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    })
                }
            })

            await LoggerService.audit({
                entity: 'Report',
                entityId: report.id,
                action: 'CREATE',
                userId,
                after: report
            })

            return report
        })
    } 

    static getAllReports() {
        return ReportRepository.findAllReports();
    }

    static async updateStatus(reportId: string, status: ReportStatus, adminId: string) {
        return prisma.$transaction(async(tx) => {
            // Cek apakah report ada
            const existingReport = await ReportRepository.findById(reportId);
            
            if (!existingReport) {
                const error: any = new Error('Report not found');
                error.status = 404;
                throw error;
            }

            // Cek apakah report masih pending
            if (existingReport.status !== ReportStatus.PENDING) {
                const error: any = new Error(`Report already ${existingReport.status.toLowerCase()}`);
                error.status = 400;
                throw error;
            }

            // Update status report
            const updatedReport = await ReportRepository.updateStatus(
                reportId,
                status,
                adminId
            );

            // Log audit
            await LoggerService.audit({
                entity: 'Report',
                entityId: reportId,
                action: `UPDATE_STATUS_${status}`,
                userId: adminId,
                before: existingReport,
                after: updatedReport
            });

            return updatedReport;
        });
    }
}