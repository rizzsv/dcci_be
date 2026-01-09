import prisma from '../../config/prisma.config'
import { LoggerService } from '../logger/logger.service'
import { ReportStatus } from './report.types'
import { LocationService } from '../location/location.service'

export class ReportService {
    static async create(payload: any, userId?: string) {
        return prisma.$transaction(async (tx) => {

            let latitude = payload.latitude
            let longitude = payload.longitude

            if (!latitude || !longitude) {
                const geo = await LocationService.resolveLocation(payload.location)
                if (geo) {
                    latitude = geo.latitude
                    longitude = geo.longitude
                }
            }
            const report = await tx.report.create({
                data: {
                    title: payload.title,
                    type: payload.type,
                    description: payload.description,
                    location: payload.location,
                    latitude: latitude,
                    longitude: longitude,
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