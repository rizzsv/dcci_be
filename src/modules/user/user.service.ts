import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserPayload, UpdateUserPayload } from './user.types';

export class UserService {
    static async create(payload: CreateUserPayload) {
        const exist = await UserRepository.findByEmail(payload.email);

        if(exist) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(payload.password, 10)

        return UserRepository.create({
            ...payload,
            password: hashedPassword
        });
    }

    static findAll() {
        return UserRepository.findAll();
    }

    static findById(id: string) {
        return UserRepository.findById(id);
    }

    static update(id: string, payload: UpdateUserPayload) {
        return UserRepository.update(id, payload);
    }

    static delete(id: string) {
        return UserRepository.delete(id);
    }
}