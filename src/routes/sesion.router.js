import { getCurrentUser } from '../controllers/sesion.controller.js';
import { authJwt } from '../middlewares/authJWT.js';
import { Router } from 'express';

const router = Router();

router.get('/current', authJwt, getCurrentUser);

export default router;
