const express = require('express');
const userController = require('./userController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/billing', upload.single('receipt_image'), userController.billing);
router.get('/user-info', userController.getUserInfo);
router.get('/user-withdrawinfo', userController.getUserWithDrawInfo);

router.post('/updateStatus/:userId/:billingId', userController.updateStatus);
router.post('/updateProfit/:userId/:billingId', userController.updateProfit);
router.get('/account-summary', userController.getAccountSummary);
router.post('/click-ad', userController.handleAdClick);
router.post('/withdraw', userController.WithDraw);
router.delete('/deleteBilling/:userId/:billingId', userController.DeleteWholeBilling);
// Route to delete a withdrawal
router.delete('/deleteWithdraw/:userId/:withdrawId', userController.DeleteWholeWithDraw);

module.exports = router;

