import { Router } from 'express';
import { ReportController } from '../modules/report/report.controller';
import { AuthController } from '../modules/user/auth.controller';
import { DisasterController } from '../modules/disaster/disaster.controller';

const publicApi = Router();

// Admin & Volunteer Auth Routes
publicApi.post('/auth/login', AuthController.login);

// Public Report Routes
publicApi.post('/reports', ReportController.create);  

// Public Disaster Routes
publicApi.get('/disasters', DisasterController.getActive);

export default publicApi;