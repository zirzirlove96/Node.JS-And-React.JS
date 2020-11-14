const express = require('express') //express 객체를 가져온다.
const app = express() //function을 이용하여 새로운 express 앱을 만들고
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://root:<password>@cluster1.txo16.mongodb.net/<dbname>?retryWrites=true&w=majority',{
  useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) //앱 실행