import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);
        
        res.status(200).json({
            success: true,
            data: result
        });
    }

    static async me(req: Request, res: Response) {
        const userId = (req as any).user.id;
        const user = await AuthService.getProfile(userId);
        
        res.status(200).json({
            success: true,
            data: user
        });
    }
}
