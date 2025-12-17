import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController{
    static async create(req: Request, res: Response) {
        const user = await UserService.create(req.body);
        res.status(201).json({
            success: true,
            data: user
        });
    }

    static async findAll(req: Request, res: Response) {
        const users = await UserService.findAll();
        res.status(200).json({
            success: true,
            data: users
        });
    }

    static async findById(req: Request, res: Response) {
        const user = await UserService.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: user
        });
    }

    static async update(req: Request, res: Response) {
        const user = await UserService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: user
        });
    }

    static async delete(req: Request, res: Response) {
        await UserService.delete(req.params.id);
        res.status(204).send();
    }
}