import prisma from "../../config/prisma.config";

export class AuthRepository {
    static findByEmail(email: string){
        return prisma.user.findUnique({where: {email}});
    }
}