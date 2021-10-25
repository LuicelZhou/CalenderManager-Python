// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
  exports.main = async (event, context) => {
  return await db.collection('list').add({
    data: {
      _openid: 'ob72m5DCIexIPV-QV8NSF3CmlVT',
      _id: event.id,
      //date: event.date,
      year: event.year,
      month: event.month,
      date: event.date,
      title: event.title,
      detail: event.detail,
      level: event.level
    }
  })
}