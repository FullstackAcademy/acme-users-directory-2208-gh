const { User, conn } = require('./db');
const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');


app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await User.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/users', async(req, res, next)=> {
  try {
    res.send(await User.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/users/:id', async(req, res, next)=> {
  try {
    const user = await User.findByPk(req.params.id);
    res.send(await user.update(req.body));
  }
  catch(ex){
    next(ex);
  }
});

const start = async()=> {
  try {
    await conn.sync({ force: true });
    await Promise.all([
      User.create({ name: 'moe' }),
      User.create({ name: 'lucy', isAdmin: true }),
      User.create({ name: 'larry', isAdmin: true }),
    ]);
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

start();
