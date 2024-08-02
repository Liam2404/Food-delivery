import { Router } from 'express';
import { loginUser, userUpdate, userDelete, userRegister, userInfo, getUserbyId, getAllUsers, userSession, userLogout } from '../Controller/user.js';

const router = Router();

router.post('/login',loginUser);
router.route('/:id').put(userUpdate).delete(userDelete).get(getUserbyId);
router.post('/register',userRegister);
router.get('/info', userInfo);
router.get('/all', getAllUsers);
router.get('/session', userSession);
router.post('/logout', userLogout);






export default router;