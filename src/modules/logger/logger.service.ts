import { LoggerRepository } from "./logger.repository";

export class LoggerService {
    static async audit(params: {
        entity: string;
        entityId: string;
        action: string;
        userId?: string;
        before?: any;
        after?: any;
    }) {
        return LoggerRepository.create(params);
    }
}