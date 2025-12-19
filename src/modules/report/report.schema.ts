import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  type: z.enum(["GEMPA", "BANJIR", "TANAH_LONGSOR", "KEBAKARAN"]).optional(),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photoUrl: z.string().url().optional(),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"], {
    message: "Status must be either VERIFIED or REJECTED"
  })
});
