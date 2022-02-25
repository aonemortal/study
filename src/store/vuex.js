import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  /*
    nickname 用户昵称
    member_id 用户id
    abs_url 用户头像
    token 登录 token
    menu_status 首页组件 IndexMenu 选中的菜单
    messageCount 消息 未读 数量
  */
  state: {
    nickname: '',
    member_id: '',
    abs_url: '',
    token: '',
    menu_status:'encyc',
    messageCount:0
  },
  mutations: {
    changeNickName(state, val) {
      state.nickname = val
    },
    changeMemberId(state, val) {
      state.member_id = val
    },
    changeAbsUrl(state, val) {
      state.abs_url = val
    },
    changeToken(state, val) {
      state.token = val
    },
    changeMenu(state, val){
      state.menu_status = val
    },
    changeMessageCount(state, val){
      state.messageCount = val
    }
  }
})