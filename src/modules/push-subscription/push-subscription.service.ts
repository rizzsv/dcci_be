import prisma from "../../config/prisma.config";

export class PushSubscriptionService {

  static async subscribe(data: any) {
    return prisma.pushSubscription.upsert({
      where: { endpoint: data.endpoint },
      update: {
        latitude: data.latitude,
        longitude: data.longitude,
        radiusKm: data.radiusKm ?? 50
      },
      create: {
        endpoint: data.endpoint,
        p256dh: data.keys.p256dh,
        auth: data.keys.auth,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusKm: data.radiusKm ?? 50
      }
    });
  }

  static async unsubscribe(endpoint: string) {
    return prisma.pushSubscription.delete({
      where: { endpoint }
    });
  }

  static async getAll() {
    return prisma.pushSubscription.findMany();
  }
}
