const express = require('express')
const app = express()

const joi = require('joi')

//解决跨域
const cors = require('cors')
app.use(cors())

//解析前端传来的数据
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//配置中间件
app.use(express.urlencoded({extended:false}))

//处理错误消息的中间件
//一定要在路由之前封装res.cc函数 否则访问不到
app.use((req,res,next)=>{
    res.cc = function(err,code = 401){
        res.status(code).send({
            code,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

//一定要在路由之前配置解析token中间件
const expressJWT = require('express-jwt')

// 引入全局数据
const config = require('./config')

app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api/]}))

//导入用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)

// //导入用户信息路由模块
// const userinfoRouter = require('./router/userinfo')
// app.use('/my',userinfoRouter)

// //导入文章信息路由模块
// const artCateRouter = require('./router/artcate')
// app.use('/my/article',artCateRouter)

// const articleRouter = require('./router/article')
// app.use('/my/article',articleRouter)

//定义错误级别的中间件
app.use((err,req,res,next)=>{
    //成立就是验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)

    //token认证错误的失败
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    //未知的错误
    res.cc(err)
})

app.listen(4000,()=>{
    console.log('api server runing at http://127.0.0.1:4000');
})