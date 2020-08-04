const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] && commentsByPostId[req.params.id].slice() || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  // 201 - created resource
  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});