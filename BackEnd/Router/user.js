import { Router } from 'express';
import { loginUser, userUpdate, userDelete, userRegister, userInfo, getUserbyId, getAllUsers, userLogout } from '../Controller/user.js';

const router = Router();

router.post('/login',loginUser)
router.route('/:id').put(userUpdate).delete(userDelete).get(getUserbyId)
router.post('/register',userRegister)
router.get('/info', userInfo)
router.get('/all', getAllUsers)
router.post('/logout', userLogout)






export default router;