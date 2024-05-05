import express from 'express';
import employeeService from './services/employeeService';
import stableDiffusionController from './services/stableDiffusionController';
import imageService from './services/imageService';
import leadService from './services/leadService';

const router = express.Router();

// Register your services
router.use('/employees', employeeService);
router.use('/image', imageService);
router.use('/stableDiffusion', stableDiffusionController);
router.use('/lead', leadService);



export default router;
