import { Router } from 'express';
import { ReportController } from '../modules/report/report.controller';
import { AuthController } from '../modules/user/auth.controller';
import { DisasterController } from '../modules/disaster/disaster.controller';
import { PushSubscriptionController } from '../modules/push-subscription/push-subscription.controller';

const publicApi = Router();

// Admin & Volunteer Auth Routes
publicApi.post('/auth/login', AuthController.login);

// Public Report Routes
publicApi.post('/reports', ReportController.create);  

// Public Disaster Routes
publicApi.get('/disasters', DisasterController.getActive);

// Public Subscription Routes
publicApi.post('/push/subscribe', PushSubscriptionController.subscribe);
publicApi.post('/push/unsubscribe', PushSubscriptionController.unsubscribe);

export default publicApi;