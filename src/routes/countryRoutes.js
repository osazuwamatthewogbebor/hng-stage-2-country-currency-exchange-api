import express from 'express';
import * as controller from '../controllers/countryController.js';

const router = express.Router();

router.post('/refresh', controller.refresh);
router.get('/', controller.getAll);
router.get('/image', controller.getSummaryImage);
router.get('/:name', controller.getOne);
router.delete('/:name', controller.remove);

export default router;
