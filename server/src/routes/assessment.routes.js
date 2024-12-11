import Router from 'express'
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
    addAssessment,
    updateAssessment
} from "../controllers/assessment.controller.js"

const router = Router();
// 6759c9ad43fb6f5e83ed9c85
router.route("/add").post(verifyJWT, addAssessment);

router.route("/update").patch(verifyJWT, updateAssessment);

export default router;
