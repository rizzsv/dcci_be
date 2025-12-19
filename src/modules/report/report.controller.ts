import {Request, Response, NextFunction} from 'express';
import { createReportSchema, updateReportStatusSchema } from './report.schema';
import { ReportService } from './report.service';
import { ReportStatus } from './report.types';
import { success } from 'zod';

export class ReportController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = createReportSchema.parse(req.body)

            const report = await ReportService.create(
                payload,
                (req as any).user?.id
            )

            res.status(201).json({
                success: true,
                data: report
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAllReports(req: Request, res: Response, next: NextFunction) {
        try {
            const report = await ReportService.getAllReports();

            res.json({
                success: true,
                data: report,
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyReport(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const adminId = (req as any).user.id;

            const report = await ReportService.updateStatus(
                id,
                ReportStatus.VERIFIED,
                adminId
            );

            res.json({
                success: true,
                message: 'Report verified successfully',
                data: report
            });
        } catch (error) {
            next(error);
        }
    }

    static async rejectReport(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const adminId = (req as any).user.id;

            const report = await ReportService.updateStatus(
                id,
                ReportStatus.REJECTED,
                adminId
            );

            res.json({
                success: true,
                message: 'Report rejected successfully',
                data: report
            });
        } catch (error) {
            next(error);
        }
    }
}