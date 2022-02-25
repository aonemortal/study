<template>
  <div class="container">
    <div class="box">
        <h2>登录答学百科</h2>
        <div class="box-code" id="wx_login_container">
            <img src="@/assets/images/img_2.png" alt="">
        </div>
        <p>请打开手机微信扫码确认登录</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  >h2{
      font-size: 40px;
      color: #333;
      font-weight: 600;
      margin-bottom: 0;
  }
  >p{
      font-size: 24px;
      color: #FBAA00;
      font-weight: 400;
      margin-top: 15px;
  }
  &-code{
      width: 380px;
      height: 380px;
      margin-top: 20px;
      >img{
        width: 100%;
        height: 100%;
      }
  }
}
</style>
