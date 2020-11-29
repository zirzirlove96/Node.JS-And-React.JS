const express = require('express') //express 객체를 가져온다.
const app = express() //function을 이용하여 새로운 express 앱을 만들고
const port = 5000
//model에 있는 User를 가져온다.
const { User } = require('./models/User')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/key')
const cookieParser = require('cookie-parser');

//client에서 오는 정보들을 분석해서 가져오게 한다.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!!! Nice meet you!')
})

/**회원가입**/
app.post('/register', (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  //bodyparser로 인해 json형식으로 데이터를 가져온다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    //error일 경우 error 메시지와 함께 보낸다.
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

/**로그인 */
app.post('/login', (req, res) => {
  //이메일 정보 데이터 베이스에 있는지 확인하는 작업
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {//user가 비어 있다면 없는 것이다.
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    //비밀번호가 맞는지 확인
    //User모델의 메서드 comaprePassword를 생성해 사용해 준다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      //isMatch라는 변수를 사용하여 입력한 비밀번호와 데이터베이스에 있는
      //비밀번호가 같은지 확인
      if (!isMatch) {
        //isMatch==false
        res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
      }

      //비밀번호와 이메일 정보가 맞다면 token생성
      user.generateToken((err, token) => {

        if (err) return res.status(400).send(err);

        //토큰을 쿠키에 저장한다.
        res.cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });

      });
    });
  });

  
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) //앱 실행