<template>
  <div class="container headernav">
    <div class="nav">
      <!-- <el-col :span="8"> -->
      <!-- logo -->
      <div class="nav-left">
        <div class="nav-left-box hands" @click="toIndex">
          <div class="nav-left-box-logo">
            <img src="@/assets/images/img_2.png" alt="" />
          </div>
          <h2>答学百科</h2>
        </div>
      </div>
      <!-- </el-col> -->
      <!-- 搜索 -->
      <!-- <el-col :span="12"> -->
      <div class="nav-search">
        <div class="nav-search-icon hands" @click="bindSearch">
          <i class="el-icon-search"></i>
        </div>
        <div class="nav-search-inp">
          <el-input
            size="medium"
            v-model="search_keyword"
            placeholder="搜索星球或内容"
            @keyup.enter.native="onSubmit"
          ></el-input>
        </div>
      </div>
      <!-- </el-col> -->
      <!-- 用户 -->
      <!-- <el-col :span="4"> -->
      <div class="nav-right">
        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
          popper-class="elPopover"
        >
          <!-- 退出登录按钮 -->
          <div
            class="nav-right-btn"
            @click="bindLogOut"
            v-show="this.$store.state.nickname"
          >
            退出登录
          </div>
          <div
            class="nav-right-btn"
            @click="bindLogOut"
            v-show="$store.state.nickname"
          >
            先去登录
          </div>
          <!-- 用户信息 -->
          <div class="nav-right-user hands" slot="reference">
            <!-- <p>{{ $store.state.nickname }}</p> -->
            <div class="nav-right-user-tx">
              <el-image
                style="width: 100%; height: 100%"
                :src="$store.state.abs_url"
                fit="cover"
              ></el-image>
            </div>
          </div>
        </el-popover>
        <div
          class="nav-right-icon hands"
          title="我的收藏"
          @click="changeNav('collect')"
        >
          <!-- <i class="el-icon-star-off"></i> -->
          <img src="@/assets/images/img_20.png" alt="" />
        </div>
        <div
          class="nav-right-icon hands"
          title="与我相关消息"
          @click="changeNav('about')"
        >
          <!-- <i class="el-icon-bell"></i> -->
          <img src="@/assets/images/img_21.png" alt="" />
          <div class="nav-right-icon-nums" v-if="$store.state.messageCount!=0">
            <i v-if="$store.state.messageCount<100">{{$store.state.messageCount}}</i>
            <i v-else style="transform: scale(.8);">99+</i>
          </div>
        </div>
      </div>
      <!-- </el-col> -->
    </div>
    <div style="width: 100%; height: 80px"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_keyword: this.keyword, //搜索关键字
      nickname: localStorage.getItem('nickname') || '',//昵称
      tx_url: localStorage.getItem('abs_url') || '',//头像
    };
  },
  props: {
    keyword: {}
  },
  watch: {
    nickname: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue, '昵称')
        this.nickname = newValue
      }
    },
    tx_url: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue, '头像')
        this.tx_url = newValue
      }
    },
    keyword: {
      handler(newValue, oldValue) {
        this.search_keyword = newValue
      }
    }
  },
  created() {
    this.nickname = localStorage.getItem('nickname') || ''
    this.tx_url = localStorage.getItem('abs_url') || ''
    // 获取消息 未读数
    let data  = {
      member_id:localStorage.getItem('member_id')||''
    }
    this.$api.api.Countm(data).then((res)=>{
      this.$store.commit('changeMessageCount',res.data.data.count)
    })
  },
  methods: {
    // 回车搜索
    onSubmit() {
      // console.log('回车')
      this.$emit('search', this.search_keyword)
    },
    // 搜索
    bindSearch() {
      this.$emit('search', this.search_keyword)
    },
    // 切换 导航
    changeNav(status) {
      console.log(this.$route.name)
      // 判断 如果不是在首页点击此组件，则跳转回首页
      if (this.$route.name !== 'Index') {
        this.$router.replace({ path: '/' })
      }
      this.$store.commit('changeMenu', status)
    },
    // 跳转到首页
    toIndex() {
      this.$router.replace({ path: '/' })
    },
    // 退出登录
    bindLogOut() {
      localStorage.removeItem('token')
      localStorage.removeItem('nickname')
      localStorage.removeItem('member_id')
      localStorage.removeItem('abs_url')

      this.$store.commit('changeNickName', '')
      this.$store.commit('changeMemberId', '')
      this.$store.commit('changeAbsUrl', '')
      this.$store.commit('changeToken', '')

      this.visible = false
      this.$router.replace({ path: '/login' })
    }
  }
};
</script>

<style lang="scss" scoped>
.headernav {
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.nav {
  width: 1400px;
  min-width: 1300px;
  padding: 16px 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  &-left {
    display: flex;
    align-items: center;
    // padding-left: 66px;
    &-box {
      display: flex;
      align-items: center;
      &-logo {
        width: 48px;
        height: 48px;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      > h2 {
        font-size: 22px;
        color: #333;
        font-weight: 600;
        margin-left: 15px;
        margin-bottom: 0;
      }
    }
  }
  &-search {
    width: 730px;
    height: 48px;
    border-radius: 24px;
    background-color: #fbfbfb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
		margin-left: 300px;
    &-icon {
      font-size: 22px;
    }
    &-inp {
      width: 94%;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // padding-right: 45px;
    &-btn {
      width: 100%;
      padding: 20px 30px;
      font-size: 18px;
      color: #666;
    }
    &-icon {
      // font-size: 32px;
      margin-left: 20px;
      width: 30px;
      height: 30px;
      position: relative;
      z-index: 5;
      > img {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 6;
      }
      &-nums {
        position: absolute;
        z-index: 7;
        right: -5px;
        top: -5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgb(253, 13, 13);
        display: flex;
        align-items: center;
        justify-content: center;
        > i {
          color: #fff;
          font-size: 12px;
        }
      }
    }
    &-user {
      // width: 188px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      &-tx {
        width: 40px;
        height: 40px;
        // margin-left: 20px;
        border-radius: 50%;
        overflow: hidden;
      }
      > p {
        width: 68%;
        box-sizing: border-box;
        font-size: 20px;
        color: #666666;
        font-weight: 600;
        text-align: right;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-wrap: break-word;
        margin-bottom: 0;
      }
    }
  }
}
</style>
