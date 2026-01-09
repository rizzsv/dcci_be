import geocoder from '../../integrations/geocoder'

export class LocationService {
    static async resolveLocation(place: string) {
        const result = await geocoder.geocode(place)

        if (!result || result.length === 0) return null

        return {
            latitude: result[0].latitude,
            longitude: result[0].longitude
        }
    }
}