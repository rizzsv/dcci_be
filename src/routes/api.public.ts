import { Router } from 'express';

const router = Router();

// Contoh: Auth routes (login, register, dll)
// router.use('/auth', authRoutes);

// Contoh: Public data routes
// router.use('/disasters', publicDisasterRoutes);

// Contoh endpoint public
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Public API is working',
  });
});

export default router;