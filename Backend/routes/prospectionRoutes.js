import { Router } from 'express';
import { createProspection, listProspections, getProspectionStats } from '../controllers/prospectionController.js';

const router = Router();

//app.use('/form', prospectionRoutes);
router.post('/add', createProspection);
router.get('/list', listProspections);
router.get('/stats', getProspectionStats);


export default router;

