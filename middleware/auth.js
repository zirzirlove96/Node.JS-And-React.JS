const {User} = require('../models/User');

let auth = (req,res,next)=>{

    //인증처리하는 곳

    //1. 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth; //client의 cookie의 key값을 통해 가져온다.

    //2. 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err,user)=>{
        if(err) return err;

        //4. 유저가 없으면 인증 NO
        if(!user) return res.json({isAuth: false, error:true});


        //3. 유저가 있으면 인증 OK
        req.token=token;
        req.user=user;
        next();//next를 하는 이유는 index.js에서 callback함수에게 전달해야 하므로
        //꼭 사용해야 한다.
        //auth는 middleware이므로 해줘야 한다.

    });//User모델에서 findByToken()이라는 메서드를 생성

}

module.exports = {auth};