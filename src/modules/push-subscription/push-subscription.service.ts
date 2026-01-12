import prisma from "../../config/prisma.config";

export class PushSubscriptionService {

  static async subscribe(data: any) {
    // Validasi p256dh (harus 65 bytes = 87 karakter base64)
    if (!data.keys?.p256dh || data.keys.p256dh.length < 80) {
      throw new Error('Invalid p256dh key. Please use real subscription from browser, not dummy data.');
    }

    // Validasi auth key
    if (!data.keys?.auth || data.keys.auth.length < 20) {
      throw new Error('Invalid auth key. Please use real subscription from browser.');
    }

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
