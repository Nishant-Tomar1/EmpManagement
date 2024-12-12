import Router from 'express'
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
    addAssessment,
    deleteAssessment,
    getAssessments,
    updateAssessment
} from "../controllers/assessment.controller.js"

const router = Router();

router.route("/get").get(getAssessments); 

router.route("/add").post(verifyJWT, addAssessment);

router.route("/update").patch(verifyJWT, updateAssessment);

router.route("/delete").delete(verifyJWT, deleteAssessment);

export default router;
