import { Router } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

// Contoh: User routes (profile, update, dll)
// router.use('/user', userRoutes);

// Contoh: Report routes (create, update, delete)
// router.use('/reports', reportRoutes);

// Contoh: Admin routes
// router.use('/admin', adminRoutes);

// Contoh endpoint private
router.get('/profile', (req, res) => {
  const authReq = req as AuthRequest;
  
  res.json({
    success: true,
    message: 'Private API is working',
    user: authReq.user,
  });
});

export default router;