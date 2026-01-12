import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    const result = await AuthService.Login(req.body);

    res.json({
      success: true,
      data: result,
    });
  }
}
