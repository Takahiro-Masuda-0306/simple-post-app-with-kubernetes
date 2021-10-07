const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  if(type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] }
    console.log('post is created at query!')
  } 

  if(type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({id, content, status});
    console.log('comment is created at query!')
  }

  if(type === 'CommentModerated') {
    const { id, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id
    })
    comment.status = status;
    console.log('comment is moderated at query!')
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
})

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvents(type, data);

  res.send({});
})

app.listen(4002, async () => {
  console.log('listening on 4002');

  const res = await axios.get('http://event-bus-srv:4005/events');

  for (let event of res.data) {
    console.log('proccessing events : ' + event.type);
    handleEvents(event.type, event.data);
  }
});