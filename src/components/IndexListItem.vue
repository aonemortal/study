<template>
  <div class="container">
    <div
      class="item hands"
      :style="index === 0 ? 'border-radius: 0 0 10px 10px;' : ''"
      @click="toIndexDetail(item.questions_id)"
    >
      <div class="item-left" :style="!item.view_pic?'width:100%;height:150px;':'height:148px'">
        <div class="item-left-title">
          <div class="item-left-title-icon" v-if="index === 0">
            <img src="@/assets/images/img_7.png" alt="" />
          </div>
          <div class="item-left-title-icon" v-else-if="index === 1">
            <img src="@/assets/images/img_8.png" alt="" />
          </div>
          <div class="item-left-title-icon" v-else-if="index === 2">
            <img src="@/assets/images/img_9.png" alt="" />
          </div>
          <div class="item-left-title-icon" v-else>
            <i>{{index+1}}</i>
          </div>
          <p :style="index > 2 ? 'width:100%;' : ''">{{ item.subject }}</p>
        </div>
        <p v-html="item.content"></p>
        <i>{{ item.view }}万热度</i>
      </div>
      <div class="item-right" v-if="item.view_pic">
        <el-image
          style="width: 100%; height: 100%;"
          :src="item.view_pic"
          lazy
          fit="cover"
        ></el-image>
      </div>
      <!-- <div class="item-more" @click.stop v-if="item.is_mine==1">
        <el-dropdown trigger="click" @command="handelCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" style="font-size: 22px; color: #999"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    item: {
      type: Object,
    },
  },
  methods: {
    // 点击 跳转到 详情
    toIndexDetail(questions_id) {
      this.$router.push({
        path: '/indexdetail',
        query: {
          questions_id: questions_id
        }
      })
    },
    // 处理 百科
    handelCommand(command) {
      this.$emit('encylHandel',this.index,this.item.questions_id,command)
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 30px 40px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  &-left {
    width: 73%;
    // height: 148px;
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
		margin-right: 30px;
    > i {
      // position: absolute;
      // z-index: 6;
      // left: 0;
      // bottom: 5px;
      font-size: 14px;
      color: #8590a6;
      font-weight: 600;
      font-style: normal;
      padding-left: 35px;
    }
    > p {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
      font-size: 16px;
      color: #444;
      font-weight: 500;
      line-height: 1.5;
      text-align: justify;
      // margin-top: 10px;
      padding-left: 35px;
    }
    &-title {
      width: 100%;
      display: flex;
      align-items: flex-start;
      // justify-content: space-between;
      &-icon {
        width: 26px;
        height: 28px;
        margin-right: 10px;
        margin-top: 1px;
        text-align: center;
        line-height: 28px;
        >i{
          font-size: 20px;
          color: #999;
          font-weight: 600;
        }
      }
      > p {
        width: 95%;
        text-align: justify;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-size: 18px;
        color: #121212;
        font-weight: 600;
        margin-bottom: 0;
      }
    }
  }
  &-right {
    width: 216px;
    height: 148px;
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>
