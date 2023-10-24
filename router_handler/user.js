//导入密码加密
const bcrypt = require('bcryptjs')

//导入数据库
const db = require('../db/index')

//生产token的包
const jwt = require('jsonwebtoken')

//导入全局配置文件
const config = require('../config')

//注册
exports.regUser = (req,res)=>{
  //获取提交到服务器的信息
  const userinfo = req.body
  //数据进行校验
  if(!userinfo.username || !userinfo.password){
      return res.cc('用户名或密码不合法！')
  }
  //定义sql语句
  const sqlStr = 'select * from admin_user where username=?';
  db.query(sqlStr,userinfo.username,(err,result)=>{
      //执行sql语句失败
      if(err){
          return res.cc(err)
      }
      //判断是否被占用
      if(result.length > 0){
          return res.cc('用户名被占用，请更换其他用户名！')
      }
      //条用bcrypt.hashSync对密码进行加密
      userinfo.password = bcrypt.hashSync(userinfo.password,10)
      //定义插入新用户的sql语句
      const sql = `insert into admin_user set ?`
      //调用db.query()执行sql语句
      db.query(sql,{username:userinfo.username,password:userinfo.password},(err,result)=>{
          //判断sql是否成功
          if(err) return res.cc(err)
          //判断影响行数是否为1
          if(result.affectedRows !== 1) return res.send({code:401,message:'注册用户失败，请稍后重试！'})
          res.cc('注册成功！',200)
      })
  })

}

exports.login = (req,res) =>{
  const userinfo = req.body
  const sql = 'select * from admin_user where username=?';
  db.query(sql,userinfo.username,(err,result)=>{
      //执行sql语句
      if(err) return res.cc(err)
      //获取不到数据
      if(result.length !== 1) return res.cc('登录失败！')
      //判断密码 解密
      const compareResult = bcrypt.compareSync(userinfo.password,result[0].password)
      if(!compareResult) return res.cc('登录失败！')
      const user = {...result[0],password:'',avatar:'',role:'',menu:'',status:''}
      //对用户的信息进行加密，生成token字符串
      const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
      res.send({
          code:200,
          message:'登录成功',
          token:'Bearer ' + tokenStr
      })        
  })
}

