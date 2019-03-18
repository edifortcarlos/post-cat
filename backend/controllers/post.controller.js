const PostModel = require('../models/post.model');

exports.newPost = (req, res, next) => {
  console.log(`\n\n Incoming request from POST Authorizaded`);

  const url = `${req.protocol}://${req.get('host')}`;
  const post = new PostModel({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      success: true,
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      success: false,
      error
    });
  });

};

exports.listPosts = (req, res, next) => {

  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  const postQuery = PostModel.find();

  let fetchdPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(posts => {
      fetchdPosts = posts;
      return PostModel.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        maxPosts: count,
        posts: fetchdPosts
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Can not fetch the data!'
      });
    });

};

exports.getPost = (req, res, next) => {
  PostModel.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!'
      });
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Can not fetch the data!'
    });
  });

};

exports.updatePost = (req, res, next) => {
  let image = req.body.imagePath;
  // Verify if exists a new image file to update 
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    image = `${url}/images/${req.file.filename}`;
  }
  const post = {
    title: req.body.title,
    content: req.body.content,
    imagePath: image,
    creator: req.userData.userId
  };
  PostModel.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, post)
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          success: true,
          message: 'Post updated'
        });
      } else {
        res.status(401).json({
          message: 'Not Authorized'
        });
      }

    })
    .catch(err => {
      res.status(500).json({
        message: 'Can not update the data'
      });
    });
};

exports.deletPost = (req, res, next) => {
  console.warn(`id: ${req.params.id}`);
  PostModel.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(
    result => {
      if (result.n > 0) {
        res.status(200).json({
          success: true,
          message: 'Post deleted'
        });
      } else {
        res.status(401).json({
          message: 'Not Authorized to perform this action'
        });
      }
    }
  ).catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'The delection fail'
    });
  });
};
