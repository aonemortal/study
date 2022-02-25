<template>
  <div class="container">
    <div class="user">
      <div class="user-tx">
        <!-- <img :src="tx_url" alt=""> -->
        <el-image
          style="width: 100%; height: 100%"
          :src="tx_url"
          fit="cover"
        ></el-image>
      </div>
      <div class="user-text">
        <p>{{ nickname }}</p>
        <i>{{ create_time }}</i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    nickname: {
      type: String
    },
    tx_url: {
      type: String
    },
    create_time: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  width: 100%;
  display: flex;
  align-items: center;
  &-tx {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  &-text {
    height: 44px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin-left: 10px;
    > p {
      font-size: 15px;
      color: #444;
      font-weight: 500;
      margin-bottom: 0;
    }
    > i {
      font-size: 13px;
      color: #999999;
      // font-weight: 600;
      // transform: scale(0.8);
      // margin-left: -12px;
      font-style: normal;
    }
  }
}
</style>