import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { loginSchema } from "../auth/auth.schema";

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            // Validasi input
            const validatedData = loginSchema.parse(req.body);
            
            const result = await AuthService.login(validatedData.email, validatedData.password);
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors
                });
            }
            next(error);
        }
    }

    static async me(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const user = await AuthService.getProfile(userId);
            
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
}
