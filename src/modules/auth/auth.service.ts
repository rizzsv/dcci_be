import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { LoginPayload } from './auth.types';

export class AuthService {
    static async Login(payload: LoginPayload) {
        const user = await AuthRepository.findByEmail(payload.email);

        if(!user) {
            throw new Error('Invalid email or password');
        }

        const isMatchPassword = await bcrypt.compare(payload.password, user.password);
        if(!isMatchPassword) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET as string,
            {expiresIn: '8h'}
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }
}