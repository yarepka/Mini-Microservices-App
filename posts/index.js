const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  }

  // emit "PostCreated" event
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  })

  // 201 - created resource
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Reveiced Event: ', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('v1000');
  console.log('Listening on 4000');
});