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
}