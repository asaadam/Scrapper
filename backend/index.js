const express = require('express');
const scrapper = require('./scrapper');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});

app.get('/search/:item',async (req,res)=>{
  console.log('get data ', req.params.item);
  let data = await scrapper.getData(req.params.item);
  res.json(data);
  console.log('finish get data ', req.params.item);

})

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});