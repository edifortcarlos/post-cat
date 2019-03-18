const express = require('express');

const checkAuth = require('../middlewere/check-auth');
const PostController = require('../controllers/post.controller');
const extractFile = require('../middlewere/file');

const router = express.Router();




router.post('/', checkAuth, extractFile, PostController.newPost);

router.get('/', PostController.listPosts);

router.get('/:id', PostController.getPost);

router.put('/:id', checkAuth, extractFile, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletPost);

module.exports = router;
