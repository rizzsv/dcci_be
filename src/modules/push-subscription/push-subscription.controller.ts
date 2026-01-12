
import {Request, Response} from 'express';
import { PushSubscriptionService } from './push-subscription.service';
import { subscribeSchema } from './push-subscription.schema';

export class PushSubscriptionController {
    static async subscribe(req: Request, res: Response) {
        const payload = subscribeSchema.parse(req.body);

        const subscription = await PushSubscriptionService.subscribe(payload);

        res.status(201).json({
            success: true,
            data: subscription
        });
    }

    static async unsubscribe(req: Request, res: Response) {
    const { endpoint } = req.body;

    await PushSubscriptionService.unsubscribe(endpoint);

    res.json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  }
}