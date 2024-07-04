import { Router } from 'express';
import { getWallet, loginUser, userUpdate, userDelete, userRegister, userInfo, getUserbyId, getAllUsers, userLogout, updateWalletBalance } from '../Controller/user.js';

const router = Router();

router.route('/wallet').post(getWallet).patch(updateWalletBalance)
router.post('/login',loginUser)
router.route('/:id').put(userUpdate).delete(userDelete).get(getUserbyId)
router.post('/register',userRegister)
router.post('/', userInfo)
router.get('/all', getAllUsers)
router.post('/logout', userLogout)

export default router;