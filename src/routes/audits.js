import express from 'express';
import {
  getAllAudits,
  getAuditById,
  createAudit,
  updateAudit,
  submitAudit,
  deleteAudit
} from '../controllers/auditController.js';

const router = express.Router();

router.get('/', getAllAudits);
router.get('/:id', getAuditById);
router.post('/', createAudit);
router.put('/:id', updateAudit);
router.post('/:id/submit', submitAudit);
router.delete('/:id', deleteAudit);

export default router;
