var express = require("express");
var router = express.Router();
var generateUUID = require('common/Unique')
var creatTime = require('common/creatTime')
var dbquery = require("../config/connect_db")
const {
    redHandel,
    sqlHandel,
    query,
    searchHandle
} = dbquery

//一级分类
router.post('/insertone', function (req, res, next) {
    const ids = generateUUID();
    const sqllist1 = `select id from one_class where enname = '${req.body.enname_one}'`
    const sqllist2 = `select id from two_class where ename = '${req.body.enname_two}'`
    let sql = `insert info one_class(id,enname,cnname,time) values('${ids}','${req.body.enname_one}','${req.body.cnname_two}',0,'${creatTime()}')`;
    let sqls = `insert info two_class(id,parent_id,enname,cnname,article_num,time) value('${generateUUID()}','${ids}','${req.body.enname_two}','${req.body.cname_two}',0,'${creatTime()}')`;
    const createTable = `CREATE TABLE ${req.body.enname_one} (LIST INT(11) UNIQUE NOT NULL AUTO_INCREMENT, id VARCHAR(255) UNIQUE PRIMARY KEY, oneId VARCHAR(255), twoId VARCHAR(255), article_name VARCHAR(255), editer VARCHAR(255), content LONGTEXT, TIME DATETIME, visitors INT, daodu VARCHAR(255), imgsrc VARCHAR(255), recomment TINYINT, art_show TINYINT);`
    const insterDataBase = async function () {
        await searchHandle(sqllist1)
        await searchHandle(sqllist2)
        await searchHandle(sql)
        await searchHandle(sqls)
        await query(createTable)
        return 'ok'
    }
    insterDateBase().then((data) => {
        res.end({
            code: 1011,
            message: '数据插入成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1012,
            message: '数据插入失败',
            err
        })
    })
})
//获取一级数据成功
router.get('/getOneclass', (req, res, next) => {
    const sql = `select enname,cnname,id from one_class`
    readHandel(sql).then((data) => {
        res.send({
            code: 1021,
            message: '获取一级数据成功',
            data
        })
    }).catch((err) => {
        res.end({
            code: 1022,
            message: '获取一级数据失败',
            err
        })
    })
})

//插入二级数据成功
router.post("/insetTwoclass", (req, res, next) => {
    let sqldata = `select id from two_class where enname = '${req.body.enname_two}'`
    let sqls = `insert into two_class(id,parent_id,enname,cnname,article_num,time) values('${generateUUID()}','${req.body.oneid}','${req.body.enname_two}','${req.body.cnname_two}',0,'${creatTime()}')`;
    const selectInsert = async function () {
        await searchHandle(sqldata)
        await sqlHandel(sqls)
        return 'ok'
    }
    selectInsert().then((data) => {
        res.send({
            code: 1023,
            message: '二级数据插入成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1024,
            message: '二级数据插入失败',
            err: err.message
        })
    })
})

//获取二级类名数据
router.get('/getTwoclass', (req, res, next) => {
    const sql = `select enname,cnname,id,parent_id from two_class`
    readHandel(sql).then((data) => {
        res.send({
            code: 1031,
            message: '获取二级数据成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1032,
            message: '获取二级数据失败',
            err
        })
    })
})

//获取输转结构的分类数据
//获取树状、类名列表
router.get('/getListClass', (req, res, next) => {
    const sql1 = 'select * from one_class'
    const sql2 = 'select * from two_class'
    const getClassList = async function () {
        const classOneList = await query(sql1)
        const classTwoList = await query(sql2)
        retrun {
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

//修改一级类名
router.post('/updateclassList', (req, res, next) => {
    //修改一级类名
    var updatesql = ` update one_class set enname='${req.body.enname_one}',cnname='${req.body.cnname_one}',time='${creatTime()}' where id='${req.body.id}'`;
    //修改文章表
    var amendTable = `alter table ${req.body.oldenname_one} rename ${req.body.enname_one}`

    const synceGet = async function () {
        const sql1 = await sqlHandel(updatesql)
        const sql2 = await query(amendTable)
        return 'ok'
    }
    synceGet().then((data) => {
        res.send({
            code: 1023,
            message: '一级修改成功',
            data
        })
    }).catch((err) => {
        res.end({
            code: 1024,
            message: '一级数据插入失败',
            err: err.message
        })
    })
})
//修改二级类名
router.post("/updateTwoclass", (req, res, next) => {
    //修改二级分类
    var updatesql = `update two class set enname = '${req.body.enname}',cnname='${req.body.cnname}',time='${creatTime()}' where id='${req.body.id}'`
    sqlHandel((updatesql), then(data) => {
        res.send({
            code: 1023,
            message: '二级分类修改成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1024,
            message: '二级分类修改失败',
            err: err.message
        })
    })
})
//删除一级类名
router.post('/deleteclassList', (req, res, next) => {
    //删除一级类名
    var sqlone = `delete from one_class where id='${req.body.id}'`
    //删除二级类名的父级id
    var sqltwo = `delete from two_class where parent_id='${req.body.id}'`
    //删除表
    var sqlarticle = `DROP TABLE ${req.body.enname_one}`
    Promise.all([sqlHandel(sqlone), sqlHandel(sqltwo), query(sqlarticle)]).then((data) => {
        res.send({
            code: 1023,
            message: '删除一级成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1024,
            message: '删除一级失败',
            err: err.message
        })
    })
})

//删除二级类名
router.post('/deleteTwoclass', (req, res, next) => {
    //删除二级类名的父级id
    var sqltwo = `delete from two_class where parenet_id='${req.body.id}'`
    sqlHandel(sqltwo).then((data) => {
        res.send({
            code: 1023,
            message: '删除一级成功',
            data
        })
    }).catch((err) => {
        res.send({
            code: 1024,
            message: '删除二级失败',
            err: err.message
        })
    })
})

module.export = router;