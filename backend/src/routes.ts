import express from 'express';
import userController from './controllers/userController';
import imageController from './controllers/imageController';
import leadController from './controllers/leadController';
import projectController from './controllers/projectController';
import checkoutController from './controllers/stripe/checkoutController';
import stableDiffusionController from './controllers/stableDiffusionController';
import cloudinaryController from './controllers/cloudinaryController';

const router = express.Router();

router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// Register your controllers
router.use('/users', userController);
router.use('/image', imageController);
router.use('/lead', leadController);
router.use('/projects', projectController);

router.use('/stableDiffusion', stableDiffusionController);
router.use('/checkout', checkoutController);
router.use('/cloudinary', cloudinaryController);


export default router;
