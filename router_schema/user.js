// 导入验证规则包
const joi = require('joi')

//定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10)
const password = joi.string().pattern(/^[\S]{6,12}$/)

//定义验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

//定义avtar规则
const avatar = joi.string().dataUri().required()

//定义验证数据对象
exports.login_schema ={
    body:{
        username,
        password
    }
}

//更新用户信息的验证规则
exports.update_userinfo_schema={
    body:{
        id,
        nickname,
        email
    }
}

//修改密码的验证规则
exports.update_password_schema={
    body:{
        oldPwd:password,
        newPwd:joi.not(joi.ref('oldPwd')).concat(password),
    }
}

exports.update_avatar_schema={
    body:{
        avatar
    }
}
