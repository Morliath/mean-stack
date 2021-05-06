const Post = require('../models/Post');

exports.fetchPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let documents;

  if (pageSize && !(currentPage == undefined)) {
    postQuery
      .skip(pageSize * (currentPage))
      .limit(pageSize);
  }

  postQuery.then(docs => {
    console.log("Read from DB: " + docs.length);
    documents = docs;

    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'Fetched succesfully',
      data: documents,
      totalPosts: count
    });
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetched failed'
      })
    });
}

exports.fetchPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      //console.log(post);
      if (post) {
        res.status(200).json({
          message: 'Fetched succesfully',
          post: post
        });
      } else {
        res.status(404).json({
          message: 'Data not found'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Read post failed'
      })
    });
}

exports.savePost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file.filename,
    createdBy: req.userData.userId
  });

  //console.log(post);

  post.save().then(createdPost => {
    console.log('Posted: ' + createdPost);

    res.status(201).json({
      message: 'Post saved succesfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: 'Persisting post failed'
      })
    });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    id: req.userData.userId
  });

  Post.updateOne({ _id: req.params.id, createdBy: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(201).json({
          message: 'Post updated succesfully'
        });
      } else {
        res.status(401).json({
          message: 'User not authorized'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Update failed'
      })
    });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, createdBy: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: 'Post deleted!'
        });
      } else {
        res.status(401).json({
          message: 'User not authorized'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Delete process failed'
      })
    });
}
