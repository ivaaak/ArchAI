import express from 'express';
import userController from './controllers/userController';
import imageController from './controllers/imageController';
import leadController from './controllers/leadController';
import checkoutController from './controllers/stripe/checkoutController';
import stableDiffusionController from './controllers/stableDiffusionController';

const router = express.Router();

// Register your controllers
router.use('/users', userController);
router.use('/image', imageController);
router.use('/lead', leadController);

router.use('/stableDiffusion', stableDiffusionController);
router.use('/checkout', checkoutController);


export default router;
