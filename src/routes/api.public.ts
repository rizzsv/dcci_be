import { Router } from 'express';
import { ReportController } from '../modules/report/report.controller'

const publicApi = Router();

publicApi.post('/reports', ReportController.create)  

export default publicApi;