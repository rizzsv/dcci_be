import prisma from '../../config/prisma.config'
import { ReportRepository } from './report.repository'
import { LoggerService } from '../logger/logger.service'
import { ReportStatus } from './report.types'
import { PushService } from '../push/push.service'
import { GeoService } from '../geo/geo.service'
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

            // Jika status VERIFIED, buat disaster
            if (status === ReportStatus.VERIFIED) {
                // Validasi report punya tipe bencana
                if (!existingReport.type) {
                    const error: any = new Error('Report must have disaster type to create disaster');
                    error.status = 400;
                    throw error;
                }

                let latitude = existingReport.latitude;
                let longitude = existingReport.longitude;

                // Jika tidak ada koordinat, coba resolve dari location text
                if ((!latitude || !longitude) && existingReport.location) {
                    const coords = await GeoService.resolveLocation(existingReport.location);
                    if (coords) {
                        latitude = coords.latitude;
                        longitude = coords.longitude;

                        // Update report dengan koordinat yang di-resolve
                        await tx.report.update({
                            where: { id: reportId },
                            data: {
                                latitude: coords.latitude,
                                longitude: coords.longitude
                            }
                        });
                    }
                }

                // Validasi akhir - harus ada koordinat
                if (!latitude || !longitude) {
                    const error: any = new Error('Cannot create disaster: unable to resolve location coordinates');
                    error.status = 400;
                    throw error;
                }

                // Buat disaster baru
                const disaster = await tx.disaster.create({
                    data: {
                        reportId: reportId,
                        type: existingReport.type,
                        latitude: latitude,
                        longitude: longitude,
                        magnitude: null,
                        source: 'CITIZEN_REPORT',
                        status: 'ACTIVE'
                    }
                });

                // Kirim notifikasi push ke user terdekat
                await PushService.notifyNearbyDisaster(disaster);

                // Log audit untuk disaster
                await LoggerService.audit({
                    entity: 'Disaster',
                    entityId: disaster.id,
                    action: 'CREATE_FROM_VERIFIED_REPORT',
                    userId: adminId,
                    after: disaster
                });
            }

            // Log audit untuk report
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