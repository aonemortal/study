<template>
  <div class="container">
    <!-- header -->
    <div class="content">
      <div class="nav">
        <div class="nav-left">
          <div class="nav-left-box hands" @click="toIndex">
            <div class="nav-left-box-logo">
              <img src="@/assets/images/img_2.png" alt="" />
            </div>
            <h2>答学百科</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 跳转到首页
    toIndex() {
      this.$router.replace({ path: '/' })
    },
  }
};
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  background-color: #fff;
}
.nav {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
  // padding: 0 66px;
  background-color: #fff;
  &-left {
    display: flex;
    align-items: center;
    padding: 16px 0;
    &-box {
      display: flex;
      align-items: center;
      &-logo {
        width: 48px;
        height: 48px;
        margin-right: 15px;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      > h2 {
        font-size: 22px;
        color: #333;
        font-weight: 600;
        margin-bottom: 0;
      }
    }
  }
}
</style>