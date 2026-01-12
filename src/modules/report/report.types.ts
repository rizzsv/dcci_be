export enum ReportStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED'
}

export type CreateReportPayload = {
    title: string
    description: string
    location: string
    latitude?: number
    longitude?: number
}