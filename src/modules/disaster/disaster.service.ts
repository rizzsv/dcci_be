import prisma from "../../config/prisma.config";
import { DisasterRepository } from "./disaster.repository";
import { GeoService } from "../geo/geo.service";
import { PushService } from "../push/push.service";

export class DisasterService {
  static async create(payload: any, userId?: string) {
    // 1. Resolve location jika hanya ada teks
    if ((!payload.latitude || !payload.longitude) && payload.location) {
      const coords = await GeoService.resolveLocation(payload.location)
      if (coords) {
        payload.latitude = coords.latitude
        payload.longitude = coords.longitude
      }
    }

    if (!payload.latitude || !payload.longitude) {
      throw new Error('Lokasi bencana tidak valid')
    }

    let reportId = payload.reportId;
    
    if (!reportId) {
      const report = await prisma.report.create({
        data: {
          title: payload.title || `${payload.type} - ${payload.location || 'Unknown'}`,
          type: payload.type,
          description: payload.description || `Disaster created by admin`,
          location: payload.location || `${payload.latitude}, ${payload.longitude}`,
          latitude: payload.latitude,
          longitude: payload.longitude,
          status: 'VERIFIED'
        }
      });
      reportId = report.id;
    }

    const disaster = await prisma.disaster.create({
      data: {
        reportId: reportId,
        type: payload.type,
        latitude: payload.latitude,
        longitude: payload.longitude,
        magnitude: payload.magnitude,
        source: payload.source || 'ADMIN'
      }
    })

    await PushService.notifyNearbyDisaster(disaster)

    return disaster
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