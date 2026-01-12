import {Request, Response, NextFunction} from 'express';
import { createReportSchema } from './report.schema';
import { ReportService } from './report.service';
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
        const report = await ReportService.getAllReports();

        res.json({
            success: true,
            data: report,
        });
    }
}