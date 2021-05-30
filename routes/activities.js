const express = require('express');

const router = express.Router();

const activitiesController = require('../controllers/activities');

router.get('/', activitiesController.fetchPublicActivities);

router.get('/unlimited', activitiesController.fetchPublicActivitiesUnlimited);

router.get('/getActivityTypes', activitiesController.getActivityTypes);

router.post('/', activitiesController.postActivity);

router.post('/public_activities', activitiesController.fetchPublicActivitiesForUser);

router.post('/unlimited/public_activities', activitiesController.fetchPublicActivitiesForUserUnlimited);

router.post('/all_activities', activitiesController.fetchAllActivitiesForUser);

router.post('/unlimited/all_activities', activitiesController.fetchAllActivitiesForUserUnlimited);

router.post('/friend', activitiesController.friendActivities);

router.post('/unlimited/friend', activitiesController.friendActivitiesUnlimited);

router.post('/getDetails', activitiesController.getActivityDetails);

router.post('/comments', activitiesController.getComments);

router.post('/save_comment', activitiesController.saveComment);

router.post('/delete', activitiesController.deleteActivity);

router.post('/delete_comment', activitiesController.deleteComment);

router.post('/report_comment', activitiesController.reportComment);

router.post('/report_activity', activitiesController.reportActivity);

router.post('/edit_comment', activitiesController.editComment);

module.exports = router;