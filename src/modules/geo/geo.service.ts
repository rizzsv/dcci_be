import geocoder from "../../integrations/geocoder";
import { haversineDistance } from "./geo.utils";

export class GeoService {
    static async resolveLocation(place: string) {
        const result = await geocoder.geocode(place)
        if (!result || result.length === 0) return null

        return {
            latitude: result[0].latitude!,
            longitude: result[0].longitude!
        }
    }

    static isWithinRadius(
        center: { latitude: number; longitude: number },
        target: { latitude: number; longitude: number },
        radiusKm: number
    ): boolean {
        const distance = haversineDistance(
            center.latitude,
            center.longitude,
            target.latitude,
            target.longitude
        )
        return distance <= radiusKm;
    }
}