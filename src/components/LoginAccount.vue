<template>
  <div class="container">
    <div class="box">
      <div class="box-left">
        <div class="box-left-logo">
          <img src="@/assets/images/img_2.png" alt="" />
        </div>
        <h2>答学百科</h2>
      </div>
      <div class="box-right" @click="changeRegister" v-show="!register">
        <i>还没有账号？</i>
        <b class="hands">去注册</b>
      </div>
      <div class="box-right" @click="changeRegister" v-show="register">
        <i>已有账号？</i>
        <b class="hands">去登录</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      register: this.register_f, //切换登录/注册 false注册 true登录
    };
  },
  props: {
    register_f: {
      type: [String, Boolean]
    }
  },
  watch: {
    register_f: {
      handler(newValue, oldValue) {
        // console.log(newValue,oldValue)
        this.register = newValue
      }
    }
  },
  methods: {
    // 切换登录/注册 false注册 true登录
    changeRegister() {
      this.register = !this.register;
      // console.log(this.register, "this.register");
      this.$emit("register", this.register);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-left {
    display: flex;
    align-items: center;
    &-logo {
      width: 70px;
      height: 70px;
      >img{
        width: 100%;
        height: 100%;
      }
    }
    > h2 {
      font-size: 30px;
      color: #333;
      font-weight: 600;
      margin-left: 25px;
      margin-bottom: 0;
    }
  }
  &-right {
    > i {
      font-size: 26px;
      color: #666;
      font-weight: 600;
      font-style: normal;
    }
    > b {
      margin-left: 15px;
      font-size: 26px;
      color: #fbaa00;
      font-weight: 600;
    }
  }
}
</style>