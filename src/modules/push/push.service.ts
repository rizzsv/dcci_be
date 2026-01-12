import webPush from 'web-push'
import prisma from '../../config/prisma.config'
import { GeoService } from '../geo/geo.service'

webPush.setVapidDetails(
  'mailto:admin@dcci.id',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export class PushService {
  static async notifyNearbyDisaster(disaster: any) {
    const subscriptions = await prisma.pushSubscription.findMany()

    for (const sub of subscriptions) {
      const isInRange = GeoService.isWithinRadius(
        { latitude: disaster.latitude, longitude: disaster.longitude },
        { latitude: sub.latitude, longitude: sub.longitude },
        sub.radiusKm
      )

      if (!isInRange) continue

      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        },
        JSON.stringify({
          title: '⚠️ PERINGATAN BENCANA',
          body: `${disaster.type} terdeteksi di sekitar Anda`,
          url: '/disasters/active'
        })
      )
    }
  }
}
