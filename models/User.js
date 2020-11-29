const mongoose = require('mongoose');
const bcrypt = require('Bcrypt'); //Bcrypt
const saltRounds = 10; //10자리
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength: 50
    },

    email : {
        type: String,
        trim: true,
        unique: true
    },

    password : {
        type:String,
        maxlength: 100
    },

    lastname: {
        type:String,
        maxlength:50
    },

    role: {
        type: Number,
        default: 0
    },

    image: String,

    token: {
        type: String
    },

    tokenExp: {
        type: Number
    }
    
});

//개인정보를 저장하기 전에 암호화하는 메서드
userSchema.pre('save', function(next){

    var user = this;//내가 저장한 개인정보를 가져온다.

    if(user.isModified("password")){
    //next 인자는 index.js의 user.save부분이다.
    bcrypt.genSalt(saltRounds,function(err,salt){
        if(err) return next(err);
        //bcrypt.hash는 plane 정보를 암호화해준다.
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err);
            user.password=hash;
            //비밀번호에 암호화된 비밀번호를 넣어준다.
            next();
        });
    })
    }else{
        next();
        //다른 정보를 바꿀때는 그냥 index.js의 user.save를 불러준다.
    }
    
});

/**comparePassword function */
userSchema.methods.comparePassword = function(plainPassword, callback){
    //plainPassword를 암호화하여 데이터베이스의 비밀번호와 같은지 확인해 주는 작업을 한다.
    //암호화된 비밀번호를 복호화할 수는 없다.
    bcrypt.compare(plainPassword,this.password,(err,isMatch)=>{
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

/**토큰을 생성해 준다. */
userSchema.methods.generateToken = function(callback){

    const user = this;
    //token을 생성해 준다 id + 'secreToken'
    //'secretToken'으로 id값을 가져와 값을 찾아낼 수도 있다.
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    //유저에 생성한 토큰 전달
    user.token=token;
    user.save(function(err,user) {
        if(err) return callback(err);
        callback(null,user);
    });

}

/**토큰으로 권한 찾기 */
userSchema.statics.findByToken = function(token, callback) {
    var user = this;

    //token을 복호화(decode)해준다.
    jwt.verify(token, 'secretToken', function(err, decode) {
        //decode는 token을 복호화한 값
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decode, "token": token}, function(err, user){
            if(err) return callback(err);
            callback(null,user);
        })
    });
}

const User = mongoose.model("User", userSchema);
module.exports = {User}
//model을 다른 곳에서도 쓸 수 있게 exports한다.