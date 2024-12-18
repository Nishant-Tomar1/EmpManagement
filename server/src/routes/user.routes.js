import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

import {
    loginUser,
    registerUser,
    logoutUser,
    verifytoken,
    verifyEmail,
    changePasswordByCode,
    changeCurrentUserPassword,
    getUsers,
    getCurrentUser,
    deleteUser,
    getBatchesUndergivenManager
}
from "../controllers/user.controller.js"
import { sendEmailHandler } from '../controllers/email.controller.js';

const router = Router();

router.route('/register').post(registerUser);

router.route("/login").post(loginUser);

router.route("/getusers").get(getUsers);

router.route("/verify-token").get(verifytoken);

router.route("/verifyemail").post(verifyEmail);

router.route("/sendemail").post(sendEmailHandler);

router.route("/change-password-by-code").post( changePasswordByCode );
//secured routes
router.route("/logout").post(verifyJWT, logoutUser); 

router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/get-batches-under-manager").get(verifyJWT, getBatchesUndergivenManager )

router.route("/change-current-user-password").post( verifyJWT, changeCurrentUserPassword );

router.route("/deleteuser").delete(verifyJWT, deleteUser);

export default router;