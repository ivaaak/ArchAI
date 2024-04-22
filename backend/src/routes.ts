import express from 'express';
import employeeService from './services/employeeService';
import stableDiffusionController from './services/stableDiffusionController';

const router = express.Router();

// Register your services
router.use('/employees', employeeService);
router.use('/stableDiffusion', stableDiffusionController);



export default router;
