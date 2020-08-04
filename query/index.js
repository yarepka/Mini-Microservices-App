/*
  Notes on Async Communication
  + Quert Service has zero dependencies on other service!
  + Query Service will be extremely fast
  - Data duplication
  - Harder to understand
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
// QUICK EXAMPLE
// posts === {
//   'jfdf32': {
//     id: 'jfdf32',
//     title: 'post title',
//     comments: [
//       {id: 'ksd3fr', content: 'comment!'}
//       {id: 'asc35e', content: 'second comment'}
//     ]
//   }
// }

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = {
      id, title, comments: []
    }
  }

  if (type === 'CommentCreated') {
    const { id, postId, content, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments
      .find(comment => {
        return comment.id === id
      });

    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listen on 4002');

  // getting missing events
  const res = await axios.get('http://localhost:4005/events');

  for (let event of res.data) {
    console.log('Processing event:', event.type);
    handleEvent(event.type, event.data);
  }

});