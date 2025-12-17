import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { UserController } from '../modules/user/user.controller';
import { authorize } from '../middlewares/role.middleware';
import { AuthController } from '../modules/user/auth.controller';
const PrivateApi = Router();

PrivateApi.use(authenticate);

// Auth Routes (authenticated users)
PrivateApi.get('/auth/me', AuthController.me);

// User Management Routes (admin only)
PrivateApi.post('/users/create', authorize('ADMIN'), UserController.create);
PrivateApi.get('/users-ShowAll', UserController.findAll);
PrivateApi.get('/users/:id', UserController.findById);
PrivateApi.put('/users/update/:id', UserController.update);
PrivateApi.delete('/users/deleted/:id', UserController.delete);


export default PrivateApi;