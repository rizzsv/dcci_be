import { Request, Response } from 'express';
import { DisasterService } from './disaster.service';

export class DisasterController {
    static async create(req: any, res: Response) {
        const disaster = await DisasterService.create(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            data: disaster
        })
    }

     static async getActive(req: Request, res: Response) {
    const disasters = await DisasterService.getActive();

    res.json({
      success: true,
      data: disasters,
    });
  }

    static async resolve(req: any, res: Response) {
        const disaster = await DisasterService.resolve(
            req.params.id,
            req.user.id
        );

        res.json({
            success: true,
            data: disaster
        })
    }
}