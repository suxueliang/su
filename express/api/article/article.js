var express = require("express");
var router = express.Router();
var dbquery = require('../../config/mysqlconnect')
var generateUUID = require('../common/Unique')
var creatTime = require('../common/creatTime')
const {
    readHandel,
    sqlHandel,
    query,
    searchHandle
} = dbquery

//一二级分类的读取
router.get('/getDataClass', (req, res, next) => {
    const onesql = 'select * from one_class'
    const twosql = 'select * from two_class'
    const getData = async function () {
        const sqlsdataOne = await readHandel(onesql)
        const sqlsdataTwo = await readHandel(twosql)
        return {
            sqlsdataOne,
            sqlsdataTwo
        }
    }
    getData().then((data) => {
        res.send({
            code: 1211,
            message: '插入文章成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1212,
            message: '插入文章失败',
            err
        })
    })
})
//文章接口
router.post('/insert', (req, res, next) => {
    var sql = `insert into ${req.body.enname_one}(id,oneId,twoId,article_name,editer,content,time,visitors,daodu,imgsrc,recommend,art_show) values('${generateUUID()}','${req.body.oneId}','${req.body.twoId}','${req.body.article_name}','${req.body.editer}','${req.body.content}','${req.body.time}',0,'${req.body.daodu}','${req.body.imgsrc}','${req.body.recommend}','${req.body.art_show}')`
    const updataArtival = `update two_class set article_num=article_num+1 where id='${req.body.twoId}'`
    const getData = async function () {
        await sqlHandel(sql)
        await sqlHandel(updataArtival)
        return 'ok'
    }
    getData().then((data) => {
        res.send({
            code: 1213,
            message: '获取类名成功'
        })
    }).catch((err) => {
        res.send({
            code: 1214,
            message: '获取类名失败',
            err
        })
    })
})
//文章查询
router.get('/getList', (req, res, next) => {
    const sqlone = `select * from one_class`
    const getData = async function () {
        const onedata = await readHandel(sqlone)
        var selectArtSql = `select * from (`
        onedata.forEach(function (i, index) {
            if (index < (onedata.length - 1)) {
                selectArtSql += `select * from ${i.enname} UNION ALL `
            } else {
                selectArtSql += ` select * from ${i.enname})as tabel_all order by time desc`
            }

        }, this);
        return await readHandel(selectArtSql)
    }
    getData().then((data) => {
        res.send({
            code: 1213,
            message: '文章数据成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1214,
            message: '文章数据失败',
            err
        })
    })
})
//修改文章内容
router.post('/updategetList', (req, res, next) => {
    var sql = `update ${req.body.enname_one} set article_name='${req.body.article_name}',editer='${req.body.editer}',content='${req.body.content}',time='${req.body.time}',visitors=${req.body.visitors},daodu='${req.body.daodu}',imgsrc='${req.body.imgsrc}',recommend='${req.body.recommend}',art_show='${req.body.art_show}' where id='${req.body.id}'`
    sqlHandel(sql).then((data) => {
        res.send({
            code: 1223,
            message: '文章数据修改成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1224,
            message: '文章数据修改失败',
            err
        })
    })
})
//删除文章
router.post('/deletegetList', (req, res, next) => {
    let deleteSql = `delete from ${req.body.enname_one} where id='${req.body.id}'`
    var updata = `update two_class set article_num=article_num-1 where id = '${req.body.twoId}'`
    const deletes = async function () {
        await sqlHandel(deleteSql)
        await sqlHandel(updata)
        return
    }
    deletes().then((data) => {
        res.send({
            code: 1225,
            message: '删除文章成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1226,
            message: '删除文章失败',
            err
        })
    })
})
module.exports = router;