<template>
  <div class="container login">
    <div class="box">
      <h2>注册答学百科</h2>
      <!-- 手机号 -->
      <div class="box-menu">
        <h3>手机号</h3>
        <div class="box-menu-item">
          <el-col :span="6">
            <div class="box-menu-item-left">
              <el-select v-model="area">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="box-menu-item-right">
              <el-input v-model="phone" placeholder="请输入手机号"></el-input>
            </div>
          </el-col>
        </div>
      </div>
      <!-- 验证码 -->
      <div class="box-menu">
        <h3>验证码</h3>
        <div class="box-menu-item">
          <el-col :span="16">
            <div class="box-menu-item-left">
              <el-input v-model="code" placeholder="请输入验证码"></el-input>
            </div>
          </el-col>
          <el-col :span="1">|</el-col>
          <el-col :span="7">
            <div
              class="box-menu-item-right hands"
              v-show="!countDownIf"
              @click="bindGetCode"
            >
              <i>获取验证码</i>
            </div>
            <div
              class="box-menu-item-right hands"
              v-show="countDownIf"
              @click="GetCodeTips"
            >
              <i>（{{ time }}）s</i>
            </div>
          </el-col>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="box-btn hands" @click="bindRegister">注册</div>
      <!-- 用户协议 -->
      <div class="box-user">
        登录注册即表示同意<i class="hands" @click="showUserAgreement"
          >《用户协议》</i
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "+86",
        },
        {
          value: "2",
          label: "+852",
        },
        {
          value: "3",
          label: "+023",
        },
        {
          value: "4",
          label: "+853",
        },
      ],
      area: "+86",
      phone: "",
      code: "",
      countDownIf: false,//倒计时是否进行
      time: 59,//短信倒计时 时间
      timer: '',//定时器
    };
  },
  props: {
    // 用户微信注册的openid
    openid: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 展示 用户协议
    showUserAgreement() {
      this.$emit('showUserAgreement', true)
    },
    // 注册
    bindRegister() {
      if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone) && this.code != '') {
        if (!this.openid) {
          // 手机号注册
          let data = {
            account: this.phone,
            verify: this.code
          }
          this.$api.api.Register(data).then((res) => {
            this.$Message({
              message: '注册成功!',
              type: 'warning',
              duration: 1500
            })
            this.countDownIf = false
            this.time = 59
            clearInterval(this.timer)
            this.$emit('RegisterSuccess', false)

            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('nickname', res.data.data.nickname)
            localStorage.setItem('member_id', res.data.data.member_id)
            localStorage.setItem('abs_url', res.data.data.abs_url)

            this.$store.commit('changeNickName', res.data.data.nickname)
            this.$store.commit('changeMemberId', res.data.data.member_id)
            this.$store.commit('changeAbsUrl', res.data.data.abs_url)
            this.$store.commit('changeToken', res.data.data.token)

            this.$router.replace({ path: '/' })
          })
        } else {
          // 微信注册 绑定手机号
          this.$api.api.WapLogin({
            openid: this.openid,
            account: this.phone,
            verify: this.code
          }).then(res => {
            this.countDownIf = false
            this.time = 59
            clearInterval(this.timer)
            this.$emit('RegisterSuccess', false)
            // 登录成功
            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('nickname', res.data.data.nickname)
            localStorage.setItem('member_id', res.data.data.member_id)
            localStorage.setItem('abs_url', res.data.data.abs_url)

            this.$store.commit('changeNickName', res.data.data.nickname)
            this.$store.commit('changeMemberId', res.data.data.member_id)
            this.$store.commit('changeAbsUrl', res.data.data.abs_url)
            this.$store.commit('changeToken', res.data.data.token)
            this.$router.replace({ path: '/' })
          })
        }
      } else {
        this.$Message({
          message: '手机号和验证码不能为空',
          type: 'warning',
          duration: 1500
        })
      }
    },
    // 获得验证码
    bindGetCode() {
      if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone)) {
        let data = {
          account: this.phone,
          unique_code: this.openid ? 'bindNewAccount' : 'register'
        }
        this.$api.api.GetSmsVerify(data).then((res) => {
          this.$Message({
            message: res.data.message,
            type: 'success',
            duration: 1500
          })
          this.countDownIf = true
          this.CountDown()
        })
      } else {
        this.$Message({
          message: '请输入正确的手机号',
          type: 'warning',
          duration: 1500
        })
      }
    },
    // 重复获取验证码提示消息
    GetCodeTips() {
      this.$Message({
        message: '请不要重复获取验证码',
        type: 'warning',
        duration: 1500
      })
    },
    // 获取验证码 定时器
    CountDown() {
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time -= 1
        } else {
          // 清除定时器
          this.countDownIf = false
          this.time = 59
          clearInterval(this.timer)
        }
      }, 1000)
    }
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-user {
    display: flex;
    align-items: center;
    font-size: 22px;
    color: #b8b8b8;
    margin-top: 10px;
    > i {
      color: #333333;
      font-style: normal;
    }
  }
  &-btn {
    width: 45%;
    height: 56px;
    background: #fbaa00;
    border-radius: 10px;
    text-align: center;
    line-height: 56px;
    font-size: 24px;
    color: #fff;
    font-weight: 600;
    margin-top: 60px;
  }
  > h2 {
    font-size: 40px;
    color: #333;
    font-weight: 600;
    margin-bottom: 0;
  }
  &-menu {
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 35px;
    > h3 {
      font-size: 24px;
      color: #333;
      font-weight: 400;
    }
    &-item {
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 2px solid #f6f4f4;
      &-right {
        > i {
          color: #fbaa00;
          font-size: 22px;
          font-weight: 400;
          font-style: normal;
        }
      }
    }
  }
}
</style>