var express = require("express");
var router = express.Router();
var dbquery = require("../config/connect_db.js")
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