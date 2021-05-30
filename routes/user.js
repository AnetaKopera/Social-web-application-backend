const express = require('express');
const router = express.Router();
let multer = require('multer');

const userController = require('../controllers/user');

const storage = multer.diskStorage({
	destination: (req, file, callBack) => {
		callBack(null, 'C:/xampp/htdocs/social-app/images/users')
	},
	filename: (req, file, callBack) => {
		let extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
		let timestamp = Date.now();
		callBack(null, 'user_photo_' + timestamp + extension)
	}
});

const upload = multer({ storage: storage });

router.get('/information/:id', userController.userInformation);

router.get('/getFriends/:id', userController.userFriends);

router.post('/get_matching_strangers', userController.getMatchingStrangers);

router.post('/update_description', userController.updateDescription);

router.post('/delete_description', userController.deleteDescription);

router.post('/update_password', userController.updatePassword);

router.post('/update_name', userController.updateName);

router.post('/update_surname', userController.updateSurname);

router.post('/update_name_surname', userController.updateNameSurname);

router.post('/update_email', userController.updateEmail);

router.post('/update_picture', upload.single('file'), userController.updatePicture);

router.post('/delete_picture', userController.deletePicture);

router.post('/invite', userController.inviteFriend);

router.post('/invited_me_list', userController.invitedMeList);

router.post('/i_invited_list', userController.iInvitedList);

router.post('/accept_invitation', userController.acceptInvitation);

router.post('/decline_invitation', userController.declineInvitation);

router.post('/delete_friend', userController.deleteFriend);

router.post('/delete_account', userController.deleteAccount);

router.post('/invitations_readed/', userController.markAsReaded);

router.post('/invitation_readed/', userController.markOneInvitationAsReaded);

module.exports = router;