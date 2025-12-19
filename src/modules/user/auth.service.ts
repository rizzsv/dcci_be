import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from './user.repository';

export class AuthService {
    static async login(email: string, password: string) {
        const user = await UserRepository.findByEmail(email);

        if (!user) {
            const error: any = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error: any = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        };
    }

    static async getProfile(userId: string) {
        const user = await UserRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
