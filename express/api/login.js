var express = require('express');
router = express.Router();
var dbquery = require("../config/connect_db")
var generateUUID = require('common/Unique')
var creatTime = require('common/creatTime')
const {
    readHandel,
    sqlHandel,
    query,
    searchHandle
} = dbquery

router.pose('/create', (req, res, next) => {
    let privilege = req.body.privilege || 0;
    const name = `select * from user where name='${req.body.name}'`
    const user = `insert info user(id,name,password,privilege) values('${generateUUID()}','${req.body.password}','${privilege}')`
    const getLogin = async function () {
        const a = await searchHandle(names)
        await sqlHandel(user)
        return 'ok'
    }
    getLogin(user).then((data) => {
        res.send({
            code: 0001,
            message: '用户创建成功'
        })
    }).catch((err) => {
        res.send({
            code: 0002,
            message: '用户创建失败'
        })
    })
})

router.post('/login', (req, res, next) => {
    const sql = `select * from user where name = '${req.body.name}'`
    query(sql).then((data) => {
        if (data.length == 0) {
            res.send({
                code: 0006,
                message: '用户不存在'
            })
        }
        if (data[0].password === req.body.password) {
            res.send({
                code: 0003,
                message: '用户登录成功',
                id: data[0].id
            })
        } else {
            res.send({
                code: 0004,
                message: '用户和密码不符'
            })
        }
    }).catch((err) => {
        res.send({
            code: 0005,
            message: '中断',
            err
        })
    })
})

router.post('/findid', (req, res, next) => {
    const sql = `select * from user where id = '${req.body.id}'`
    query(sql).then((data) => {
        if(data.length>0){
            res.send({
                code: 0007,
                message:'用户存在'
            })
        }else{
            res.send({
                code: 0007,
                message: '用户不存在'
            })
        }
    }).catch((err)=>{
        res.send({
            code: 0005,
            message:'中断',
            err
        })
    })
})

module.exports = router;