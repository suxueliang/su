const config = require('./config.js')
const mysql = require('mysql')
var moment = require('moment')

// const query = (sql, callback) => {
//   let connect = mysql.createConnection(config.dev_sql_config)
//   connect.on('err',(err) => {console.log(err)})
//   connect.query(sql, (err, rows, fields) => {
//       if(err) {
//         console.log(err)
//         return 
//       }
//      callback(rows)
//      connect.end()
//   })
// }

 
//promise
let connection = mysql.createPool(config.dev_sql_config)
const query = (sql) => {
  return new Promise((resolve, reject) => {
    connection.getConnection((err, connect) => {
      console.log(connect)
      connect.query(sql, (sqlerr, rows, fileds) => {
        if(sqlerr) {
          reject(sqlerr)
          return 
        }
        resolve(rows)
        connect.release()
      })
    })
  })
}
const readHandel = (sql) => {
  return new Promise((resolve, reject) => {
      query(sql).then((data) => {
          data = data.map((i) => {
              i.time = moment(i.time).format('YYYY-MM-DD HH:mm:ss')
              return i
          })
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
  })
}
//其他文件
const sqlHandel = (sql) => {
  return new Promise((resolve, reject) => {
      query(sql).then((data) => {
          if(data.affectedRows>0){
            resolve('ok')
          }else {
              reject(err)
              console.log(err)
          }
        }).catch((err) => {
          reject(err)
        })
  })
}

//检索判断数据库是否有此值
const searchHandle = (sql) => {
  return new Promise((resolve, reject) => {
      query(sql).then((data) => {
          if (data.length > 0) {
              reject('已存在')
          } else {
              resolve('无值')
          }
      }).catch((err) => {
          reject(err)
      })
  })
}
module.exports = {
  readHandel,
  sqlHandel,
  query,
  searchHandle
}