import baseurl from './baseURL'
import axios from './http'
// import upload from './upload'
import qs from 'qs'

const api = {
  // 获取验证码
  GetSmsVerify(params) {
    return axios.post(`${baseurl.dizhitou}/SmsVerify/getSmsVerify`, qs.stringify(params))
  },
  //全部已读
  allread(params) {
    return axios.post(`${baseurl.dizhitou}/Dynamic/allread`, qs.stringify(params))
  },
  // 获取文件图标
  getfileicon(params) {
    return axios.post(`${baseurl.dizhitou}/System/fileicon`, qs.stringify(params))
  },
  // 注册
  Register(params) {
    return axios.post(`${baseurl.dizhitou}/Login/register`, qs.stringify(params))
  },
  // 登录
  Login(params) {
    return axios.post(`${baseurl.dizhitou}/Login/login`, qs.stringify(params))
  },
  // 百科列表
  EncycList(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/encyList`, qs.stringify(params))
  },
  // 发布提问
  EncyAdd(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/encyAdd`, qs.stringify(params))
  },
  // 百科列表 百科详情
  EncycDetail(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/encyDetail`, qs.stringify(params))
  },
  // 百科列表 百科详情 说说列表
  AnswersList(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/answersList`, qs.stringify(params))
  },
  // 百科列表 百科详情 发布说说
  AnswersAdd(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/answersAdd`, qs.stringify(params))
  },
  // 百科列表 百科详情 说说详情
  AnswersDetail(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/answersDetail`, qs.stringify(params))
  },
  // 百科列表 百科详情 说说详情 评论列表
  LayerList(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/layerList`, qs.stringify(params))
  },
  // 百科列表 百科详情 说说详情 评论
  EncycDoReply(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/doReply`, qs.stringify(params))
  },
  // 点赞
  Like(params) {
    return axios.post(`${baseurl.dizhitou}/Member/like`, qs.stringify(params))
  },
  // 与我相关消息
  Messages(params) {
    return axios.post(`${baseurl.dizhitou}/Dynamic/messages`, qs.stringify(params))
  },
  // 与我相关消息 设置已读
  SetRead(params) {
    return axios.post(`${baseurl.dizhitou}/Dynamic/setRead`, qs.stringify(params))
  },
  // 加入的星球
  MyStar(params) {
    return axios.post(`${baseurl.dizhitou}/Member/myStar`, qs.stringify(params))
  },
  // 草稿箱
  DrawingList(params) {
    return axios.post(`${baseurl.dizhitou}/Member/draftList`, qs.stringify(params))
  },
  // 草稿箱 删除草稿
  DeleteDrawing(params) {
    return axios.post(`${baseurl.dizhitou}/Member/draftDelete`, qs.stringify(params))
  },
  // 我的收藏
  MyCollect(params) {
    return axios.post(`${baseurl.dizhitou}/Member/myCollect`, qs.stringify(params))
  },
  // 收藏
  Collect(params) {
    return axios.post(`${baseurl.dizhitou}/Member/collect`, qs.stringify(params))
  },
  // 星球 主题列表
  PostsList(params) {
    return axios.post(`${baseurl.dizhitou}/Star/postsList`, qs.stringify(params))
  },
  // 星球 主题列表(问题列表)
  QuestionsList(params) {
    return axios.post(`${baseurl.dizhitou}/Star/questionsList`, qs.stringify(params))
  },
  // 星球 主题列表 发布主题
  AddPosts(params) {
    return axios.post(`${baseurl.dizhitou}/Star/addPosts`, qs.stringify(params))
  },
  // 星球 主题列表 主题详情
  PostsDetail(params) {
    return axios.post(`${baseurl.dizhitou}/Star/postsDetail`, qs.stringify(params))
  },
  // 星球 主题列表 主题详情 一级评论列表
  LayerListOne(params) {
    return axios.post(`${baseurl.dizhitou}/Star/layerList`, qs.stringify(params))
  },
  // 星球 主题列表 问答详情
  QuestionsDetail(params) {
    return axios.post(`${baseurl.dizhitou}/Star/questionsDetail`, qs.stringify(params))
  },
  // 星球 主题/问答  评论
  DoReply(params) {
    return axios.post(`${baseurl.dizhitou}/Star/doReply`, qs.stringify(params))
  },
  // 上传
  Upload(params) {
    return axios.post(`${baseurl.dizhitou}/System/upload`, params)
  },
  //标签列表
  labellist(params) {
    return axios.post(`${baseurl.dizhitou}/Star/tagList`, qs.stringify(params))
  },
  //文件上传录入
  recordfile(params) {
    return axios.post(`${baseurl.dizhitou}/System/uploadLogwrite`, qs.stringify(params))
  },
  // 用户协议
  UserAgreement(params) {
    return axios.post(`${baseurl.dizhitou}/System/userAgreement`, qs.stringify(params))
  },
  // 用户协议
  AttentionList(params) {
    return axios.post(`${baseurl.dizhitou}/Member/attentionList`, qs.stringify(params))
  },
  // 星球 发布主题 标签列表
  TagList(params) {
    return axios.post(`${baseurl.dizhitou}/Star/tagList`, qs.stringify(params))
  },
  // 生成 草稿
  DraftUpdate(params) {
    return axios.post(`${baseurl.dizhitou}/Member/draftUpdate`, qs.stringify(params))
  },
  // 草稿 详情
  DraftDetail(params) {
    return axios.post(`${baseurl.dizhitou}/Member/draftDetail`, qs.stringify(params))
  },
  // 删除 百科
  EncyDelete(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/encyDelete`, qs.stringify(params))
  },
  // 删除 说说
  AnswersDelete(params) {
    return axios.post(`${baseurl.dizhitou}/Encyclopedia/answersDelete`, qs.stringify(params))
  },
  // 删除 星球 问答
  QuestionsDelete(params) {
    return axios.post(`${baseurl.dizhitou}/Star/questionsDelete`, qs.stringify(params))
  },
  // 删除 星球 主题
  PostsDelete(params) {
    return axios.post(`${baseurl.dizhitou}/Star/postsDelete`, qs.stringify(params))
  },
  //获取临时上传品证
  getalitoken(params) {
    return axios.post(`${baseurl.dizhitou}/Member/assumeRole`, qs.stringify(params))
  },
  // 消息 未读 数量
  Countm(params) {
    return axios.post(`${baseurl.dizhitou}/Member/countm`, qs.stringify(params))
  },
  // 微信授权登录
  WapLogin(params) {
    return axios.post(`${baseurl.dizhitou}/Login/wapLogin`, qs.stringify(params))
  },
  // 删除评论
  ReplysDelete(params) {
    return axios.post(`${baseurl.dizhitou}/Member/replysDelete`, qs.stringify(params))
  },
	// 获取标签内容
	Getlabelcontent(params) {
	  return axios.post(`${baseurl.dizhitou}/Star/tagsPage`, qs.stringify(params))
	}
}

export default api