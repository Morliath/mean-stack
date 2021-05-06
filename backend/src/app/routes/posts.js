const express = require('express');

const verifyAuthentication = require('../utils/authservice').verify;
const fileService = require('../utils/fileService');

const postsController = require('../controllers/postsController');

const router = express.Router();

router.get('', postsController.fetchPosts);

router.get('/:id', postsController.fetchPost);

router.post('', verifyAuthentication, fileService, postsController.savePost );

router.put('/:id', verifyAuthentication, fileService, postsController.updatePost );

router.delete('/:id', verifyAuthentication, postsController.deletePost);

module.exports = router;
