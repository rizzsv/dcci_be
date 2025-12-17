import { Router } from 'express';
import { ReportController } from '../modules/report/report.controller';
import { AuthController } from '../modules/user/auth.controller';

const publicApi = Router();

publicApi.post('/auth/login', AuthController.login);
publicApi.post('/reports', ReportController.create);  

export default publicApi;