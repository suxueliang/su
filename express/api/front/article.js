var express = require('express')
var router = express.Router()
var dbquery = require('../../config/mysqlconnect')
var generateUUID = require('../common/Unique')
var creatTime = require('../common/creatTime')
const moment = require('moment'); //数据库时间转js时间格式

const {
    sqlHandle,
    readHandle,
    searchHandle,
    query
} = dbquery

//头部导航数据查询

router.get('/getListClass', (req, res, next) => {
    const sql1 = 'select * from one_class'
    const sql2 = 'select * from two_class'
    const getClassList = async function () {
        const classOneList = await query(sql1)
        const classTwoList = await query(sql2)
        return {
            classOneList,
            classTwoList
        }
    }
    getClassList().then((data) => {
        let resultArr = []
        data.classOneList.forEach((i) => {
            let obj = {
                oneClass: i,
                twoClass: []
            }
            data.classTwoList.forEach((k) => {
                if (i.id == k.parent_id) {
                    obj.twoClass.push(k)
                }
            })
            resultArr.push(obj)
        })
        res.send({
            code: '1121',
            msg: '数据获取成功',
            resultArr
        })
    }).catch((err) => {
        res.send({
            code: '1122',
            msg: '数据获取失败',
            err: err
        })
    })
})

//获取所有文章查询
router.get('/getArticleAll', function (req, res, next) {
    var sqlone = 'select * from one_class'
    var sqltwo = 'select * from two_class'
    //拼接查询文章的sql
    const connectSql = (oneClass) => {
        //根据一级类名拼接sql
        var selectArtSql = `select * from (`
        oneClass.froEach(function (i, index) {
            if (inex < (oneClass.length - 1)) {
                selectArtSql += `select * from ${i.enname} UNION ALL`
            } else {
                selectArtSql += `select * from ${i,enname})as tabel_all where art_show=1 order by time desc`
            }
        }, this);
        return selectArtSql
    }
    //将一二级类名的中英文表示添加入文章列表
    const connectArticle = (data) => {
        const {
            articleData,
            oneClass,
            twoClass
        } = data
        return articleData.map(function (i) {
            oneClass.forEach(function (j) {
                if (j.id == i.ondId) {
                    i.enname_one = j.enname
                    i.cnname_one = j.cnname
                }
            })
            twoClass.froEach(function (j) {
                if (j.id == i.twoId) {
                    i.enname_two = j.enname
                    i.cnname_two = j.cnname
                }
            })
            return i
        })
    }
    const asyncGetArticle = async function () {
        let oneClass = await query(sqlone)
        let twoClass = await query(sqltwo)
        let articleData = await query(connectSql(oneClass))
        return connectArticle({
            articleData,
            oneClass,
            twoClass
        })
    }
    asyncGetArticle().then((data) => {
        res.send({
            code: '6012',
            data,
            msg: '查询成功'
        })
    }).catch((err) => {
        res.send({
            code: '6013',
            msg: '查询失败',
            err: err
        })
    })
})

router.get("/getArticle", function (req, res, next) {
    var sqlone = `select * from one_class`
    // 拼接查询文章的sql
    const connectSql = (oneClass) => {
        // 根据一级类名拼接sql
        var selectArtSql = `select * from (`
        oneClass.forEach(function (i, index) {
            if (index < (oneClass.length - 1)) {
                selectArtSql += `select * from ${i.enname} UNION ALL`
            } else {
                selectArtSql += ` select * from ${i.enname})as tabel_all where id='${req.query.id}' and art_show=1 order by time desc`
            }

        }, this);
        return selectArtSql
    }
    // 更新文章读取量
    const connectUpdataSql = (oneClass) => {
        if (articleData.length > 0) {
            let sql = `CREATE VIEW all_article_table(id,visitors) AS SELECT id,visitors FROM `
            oneClass.forEach((i, index) => {
                sql += `${i.enname} `
            })

        }
    }
    const asyncGetArticle = async function () {
        let oneClass = await readHandle(sqlone)
        let articleData = await readHandle(connectSql(oneClass))
        // let articleData=await  sqlHandle(connectUpdataSql(oneClass))
        return articleData
    }

    asyncGetArticle().then((data) => {
        res.send({
            code: "6012",
            data,
            msg: "查询成功"
        })
    }).catch((err) => {
        res.send({
            code: "6013",
            data: null,
            msg: "查询失败"
        })
    })
})


module.exports = router;