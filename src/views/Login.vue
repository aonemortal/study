<template>
  <div class="container">
    <div class="bg"></div>
    <div class="box">
      <!-- 背景 -->
      <!-- <div class="box-bg">
        <img src="@/assets/images/img_1.png" alt="" />
      </div> -->
      <div class="box-content">
        <!-- 注册账号 -->
        <div class="box-content-top">
          <LoginAccount @register="changeRegister" :register_f="register" />
        </div>
        <!-- 微信登录 -->
        <div
          class="box-content-item"
          style="margin-top: 0"
          v-show="login_mode && !register"
        >
          <LoginWechat />
        </div>
        <!-- 手机号登录 -->
        <div class="box-content-item" v-show="!login_mode && !register">
          <LoginPhone />
        </div>
        <!-- 注册 -->
        <div class="box-content-item" v-show="register">
          <LoginRegister
            :openid="openid"
            @RegisterSuccess="RegisterSuccess"
            @showUserAgreement="showUserAgreement"
          />
        </div>
        <!-- 切换登录方式 -->
        <div
          class="box-content-change hands"
          @click="changeLogin"
          v-show="!register"
        >
          {{ login_mode ? "切换至手机号登录" : "切换至微信登录" }}
        </div>
      </div>
      <!-- 切换登录方式 -->
      <!-- <div class="box-change hands" @click="changeLogin" v-show="!register">
        {{ login_mode ? "切换至手机号登录" : "切换至微信登录" }}
      </div> -->
    </div>
    <!-- 用户协议 展示 弹窗 -->
    <el-dialog
      title="用户协议"
      :visible.sync="userAgreementPopup"
      width="1200px"
    >
      <div class="popup" v-html="userAgreement"></div>
    </el-dialog>
  </div>
</template>

<script>
import LoginWechat from "@/components/LoginWechat.vue";
import LoginPhone from "@/components/LoginPhone.vue";
import LoginAccount from "@/components/LoginAccount.vue";
import LoginRegister from "@/components/LoginRegister.vue";
export default {
  data() {
    return {
      // clientHeight: 0, //浏览器可视区域高度
      login_mode: false, //登录方式 true微信 false手机号
      register: false,//是否注册
      userAgreementPopup: false,//用户协议 弹窗
      userAgreement: '',//用户协议内容
      openid: '',//微信授权登录 用户openid
    };
  },
  components: {
    LoginWechat,
    LoginPhone,
    LoginAccount,
    LoginRegister
  },
  mounted() {
    // 获取浏览器可视区域高度
    // this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    // // console.log(this.clientHeight);
    // window.onresize = function temp() {
    //   this.clientHeight = `${document.documentElement.clientHeight}`;
    // }
    // 获取用户协议
    this.$api.api.UserAgreement().then((res) => {
      this.userAgreement = res.data.data.content
    })
    // 获取微信登录 二维码
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
    const wxElement = document.body.appendChild(s)
    const uri = `${window.location.origin}/#/login`// 这里是你的回调uri
    console.log(uri)
    wxElement.onload = () => {
      const obj = new WxLogin({
        id: 'wx_login_container', // 需要显示的容器id
        appid: 'wx604045d24c4902cf', // appid wx*******
        scope: 'snsapi_login', // 网页默认即可
        redirect_uri: encodeURIComponent(uri), // 授权成功后回调的url
        state: Math.ceil(Math.random() * 1000), // 可设置为简单的随机数加session用来校验
        style: 'black', // 提供"black"、"white"可选。二维码的样式
        // href: '' // 外部css文件url，需要https
      })
      if (!obj) {
        console.error('wx-error')
      }
    }
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    // clientHeight: function () {
    //   this.changeFixed(this.clientHeight);
    // },
    // 监听路由变化
    $route(to) {
      console.log(to, '$route')
      if (to.query.code) {
        let code = to.query.code
        console.log(code, 'code')
        this.$api.api.WapLogin({
          code: code
        }).then(res => {
          console.log(res, 'WapLogin')
          if (res.data.data.errCode == 12001) {
            // 未绑定手机号 去注册页绑定手机号
            this.register = true
            this.openid = res.data.data.openid
          } else {
            // 登录成功
            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('nickname', res.data.data.nickname)
            localStorage.setItem('member_id', res.data.data.member_id)
            localStorage.setItem('abs_url', res.data.data.abs_url)

            this.$store.commit('changeNickName', res.data.data.nickname)
            this.$store.commit('changeMemberId', res.data.data.member_id)
            this.$store.commit('changeAbsUrl', res.data.data.abs_url)
            this.$store.commit('changeToken', res.data.data.token)
            this.$router.push({ path: '/' })
						//注释了 /node_modules/sockjs-client/dist/sockjs.js 在1606行，注释掉self.xhr.send(payload);
          }
        })
      }
    }
  },
  methods: {
    // 注册组件 展示用户协议
    showUserAgreement(status) {
      this.userAgreementPopup = status
    },
    // 注册成功 组件 LoginRegister 改变是否注册状态值 register
    RegisterSuccess(e) {
      // console.log(e)
      this.register = e
    },
    // 获取子组件 LoginRegiser 抛出的值register
    changeRegister(register) {
      // console.log(register,'register')
      this.register = register
    },
    // 动态修改样式
    // changeFixed(clientHeight) {
    //   //动态修改样式
    //   //   console.log(clientHeight);
    //   this.$refs.homePage.style.height = clientHeight + "px";
    // },
    // 切换登录方式
    changeLogin() {
      this.login_mode = !this.login_mode;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background-image: url("../assets/images/img_1.png");
  background-size: cover;
}
.box {
  // position: fixed;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // top: 0;
  // z-index: 5;
  position: relative;
  z-index: 6;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  // background-image: url('../assets/images/img_1.png');
  // background-size: cover;
  // &-bg {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   z-index: 6;
  //   width: 100%;
  //   height: 100%;
  // }
  &-content {
    width: 1200px;
    min-width: 1200px;
    height: 720px;
    min-height: 720px;
    position: relative;
    z-index: 7;
    background-color: #fff;
    box-shadow: 0px 2px 27px 0px rgba(0, 0, 0, 0.07);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-content: center;
    padding: 60px;
    &-item {
      margin-top: 40px;
    }
    &-change {
      // position: absolute;
      // z-index: 8;
      // bottom: 6%;
      text-decoration: underline;
      font-size: 22px;
      color: #4c708e;
      margin-top: 10px;
    }
  }
  &-change {
    // position: absolute;
    // z-index: 8;
    // bottom: 6%;
    text-decoration: underline;
    font-size: 22px;
    color: #4c708e;
    margin-top: 30px;
  }
}
.popup {
  width: 100%;
  max-height: 500px;
  overflow-y: scroll;
}
</style>
