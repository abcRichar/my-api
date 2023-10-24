const express = require('express')

const router = express.Router()

//引入处理函数
const user_handler =  require('../router_handler/user')
//导入需要验证数据的中间件
const expressJoi =  require('@escook/express-joi')

//导入需要验证的对象
const {login_schema} = require('../router_schema/user')

//登录
router.post('/login',expressJoi(login_schema),user_handler.login)

//注册新用户
router.post('/reguser',expressJoi(login_schema),user_handler.regUser)

module.exports = router