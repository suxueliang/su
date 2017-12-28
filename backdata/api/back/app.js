var express=require('express')
var router=express.Router()
const creatTime=require('../common/creatTime')
const generaUnique=require('../common/Unique')
const dbquery=require('../../config/connect_db')
var moment = require('moment')
var querystring = require('querystring')

const {readHandle,sqlHandle,query} = dbquery
console.log(readHandle)
//插入文本
router.post('/insert',(req,res,next)=>{
    let sql=`insert into apilist(id,title,url,type,sendparams,getparams,backorfont,time) values('${generaUnique()},'${req.body.title}','${req.body.url}','${req.body.type}','${req.body.sendparams}','${req.body.getparams}','${req.body.backfont}','${creatTime()}'')`
    readHandle(sql).then((data)=>{
        res.send({
            code:1011,
            msg:'数据插入成功'
        })
    }).catch((err)=>{
        res.send({
            code:1012,
            msg:'数据插入失败'
        })
    })
})
//数据读取
router.post('/select',(req,res,next)=>{
    let sql=`select * from apilist where backorfont='${req.body.backorfont}'`
    readHandle(sql).then((data)=>{
        res.send({
            code:1021,
            msg:'数据读取成功'
        })
    }).catch((err)=>{
        res.send({
            code:1022,
            msg:'数据读取失败'
        })
    })
})
//数据更改
router.post('/update',(req,res,next)=>{
    let sql=`update apilist set title='${req.body.title}',url='${req.body.url}',type='${req.body.type}',sendparams='${req.body.sendparams}',backorfont='${req.body.backorfont}',time='${creatTime()}'`  
    query(sql).then((data)=>{
        res.send({
            code:1031,
            msg:'数据修改成功'
        })
    }).catch((err)=>{
        res.send({
            code:1032,
            msg:'数据修改失败'
        })
        console.log(err)
    })
})

//数据删除
router.post('/delete',(req,res,next)=>{
    console.log(req)
    let sql=`delete from apilist where id='${req.body.id}' and title='${req.body.title}' and url='${req.body.url}'`
    sqlHandle(sql).then((data)=>{
        console.log(111)
        res.send({
            code:1041,
            msg:'删除数据成功'
        })
    }).catch((err)=>{
        console.log(111)
        res.send({
            code:1042,
            msg:'删除数据失败'
        })
    })
})

module.exports=router