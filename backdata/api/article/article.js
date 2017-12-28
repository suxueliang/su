const express=require('express')
const router=express.Router()
const creatTime=require('../common/creatTime')
const generaUnique=require('../common/Unique')
const dbquery=require('../../config/connect_db')

const {sqlHandle,readHandle,searchHandle,searchHandleNormal,query}=dbquery

//一二级文件的读取
router.get('/getDatalist',(req,res,next)=>{
    const select_one='select * from one_class' //查询数据库
    const select_two='select * from two_class'
    const getData=async function(){
        const sqldataOne=await readHandle(select_one)
        const sqldataTwo=await readHandle(select_two)//读取数据
        return{
            sqldataOne,
            sqldataTwo
        }
    }
    getData().then((data)=>{
        res.send({
            code:1211,
            msg:'插入文章成功'
        })
    }).catch((err)=>{
        res.send({
            code:1212,
            msg:'插入文章失败'
        })
    })
})

//文章接口
router.post('/insert',(req,res,next)=>{ 
    let sql=`insert into jishu(id,oneId,twoId,article_name,editer,content,TIME,visitors,daodu,imgsrc,recommend,art_show) values('${generateUUID()}','${req.body.oneId}','${req.body.twoId}','${req.body.article_name}','${req.body.editer}','${req.body.content}','${req.body.time}',0,'${req.body.daodu}','${req.body.imgsrc}','${req.body.recommend}','${req.body.art_show}')`
    let updataArtival = `update two_class set article_num=article_num+1 where id='${req.body.parent_id}'`

    const getData=async function(){
        await sqlHandle(sql)
        await sqlHandle(updataArtival)
        return 'ok'
    }
    getData().then((data)=>{
        res.send({
            code:1311,
            msg:'获取类名成功'
        })
    }).catch((err)=>{
        res.send({
            code:1312,
            msg:'获取类名失败',
            err
        })
    })
})

module.exports = router