const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [
  // {
  //   id: 1,
  //   title: 'The post title',
  //   contents: 'The post contents'
 //  },
//   {
//     id: 2,
//     title: 'Title',
//     contents: 'Contents'
//   },
//   {
//     id: 3,
//     title: 'More title',
//     contents: 'More contents'
//   }
];
let nextID = 4;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(cors());

// TODO: your code to handle requests
server.get('/', (req, res) => {
  res.send('hello');
});
// GET /posts
server.get('/posts', (req, res) => {
  // localhost:3000/posts?term=stuff
  const term = req.query.term;
  const filtered = [];
  // if (term) {
  //   for (let i = 0; i < posts.length; i++) {
  //     if (posts[i].title.includes(term) || posts[i].contents.includes(term)) {
  //       filtered.push(posts[i]);
  //     }
  //   }
  //   res.send(filtered);
  // } else {
  //   res.json(posts);
  // }
  if (term) {
    const matchingPosts = posts.filter((post) => {
      return post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.contents.includes(term);
    });
    res.json(matchingPosts);
  } else {
    res.json(posts);
  }
});

// POST /posts
server.post('/posts', (req, res) => {
  const title = req.body.title;
  const contents = req.body.contents;
  const id = req.body.id;
  if (!title) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Title Required' });
    return;
  } else if (!contents) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Contents Required' });
    return;
  }
  const post = {
    id: nextID,
    title,
    contents,
  };
  posts.push(post);
  nextID++;
  res.json(posts);
});

// PUT /posts
server.put('/posts', (req, res) => {
  // const id = req.body.id;
  const title = req.body.title;
  const contents = req.body.contents;
  const id = req.body.id;
  if (!id) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'id required' });
//   } else if (id < 0 || id >= posts.length) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'id does not correspond to a post' });
  } else if (!title) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Title Required' });
  } else if (!contents) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Contents Required' });
  }
  let foundPost = false;
  posts.forEach((post) => {
    if (post.id === id) {
      post.title = title;
      post.contents = contents;
      res.json(post);
      foundPost = true;
    }
  });
  if (!foundPost) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'post not found' });
  }
});

// DELETE /posts
server.delete('/posts', (req, res) => {
  // const id = req.body.id;
  const id = req.body.id;
  if (!id) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'id required' });
    return;
//   } else if (id < 0 || id >= posts.length) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'id does not correspond to a post' });
  }
//   posts.splice(id, 1);
//   res.json({ success: true });
  const post = posts.find(p => p.id === id);
  if (!post) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: `Could not find a post with id ${id}` });
    return;
  }
  posts = posts.filter(p => p.id !== id);
  res.json({ success: true });
});
module.exports = { posts, server };
