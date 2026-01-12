import { DisasterSource, DisasterType } from "@prisma/client";

export interface CreateDisasterPayload {
    reportId: string;
    type: DisasterType;
    latitude: number;
    longitude: number;
    magnitude?: number;
    source: DisasterSource;
}

export interface ResolveDisasterPayload {
  resolvedAt?: Date;
}