// 引入ali-oss
let OSS = require('ali-oss')

/**
 *  [accessKeyId] {String}：通过阿里云控制台创建的AccessKey。
 *  [accessKeySecret] {String}：通过阿里云控制台创建的AccessSecret。
 *  [bucket] {String}：通过控制台或PutBucket创建的bucket。
 *  [region] {String}：bucket所在的区域， 默认oss-cn-hangzhou。
 */
export function client(data) {
  //后端提供数据
  return new OSS({
    region: "oss-cn-qingdao",
    accessKeyId: data.AccessKeyId,
    accessKeySecret: data.AccessKeySecret,
    bucket: "daxue100-1",
    stsToken: data.SecurityToken
  })
}
// export const put = async (filename, fileUrl) => {

//   let file = filename + fileUrl.name
//   console.log(file)
//   try {
//     let result = await client.put(`${file}`, fileUrl)
//     console.log(result)
//     return result
//   } catch (e) {
//     console.log(e)
//   }
// }

/**
 * 生成随机文件名称
 * 规则八位随机字符，加下划线连接时间戳
 */
export const getFileNameUUID = () => {
  function rx() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return `${+new Date()}_`
}





