<template>
  <div class="container">
    <div class="item hands">
      <div class="item-left" v-if="item.view_pic" @click="toDraftsDetail(item.type,item.draft_id,item.type==3?item.star_id:item.questions_id)">
        <el-image
          style="width: 100%; height: 100%"
          :src="item.view_pic"
          fit="cover"
        ></el-image>
      </div>
      <div class="item-center" @click="toDraftsDetail(item.type,item.draft_id,item.type==3?item.star_id:item.questions_id)">
        <div class="item-center-text">
          <p v-if="item.subject" style="font-weight:600;">
            {{ item.subject }}
          </p>
          <p style="font-size: 16px; color: #999">
            {{ item.content }}
          </p>
        </div>

        <i>保存时间：{{ item.create_time }}</i>
      </div>
      <div class="item-right">
        <el-popconfirm
          title="确定删除这条草稿吗？"
          @confirm="delDrawing(item.draft_id, index)"
        >
          <i class="el-icon-delete hands" style="font-size:22px;" slot="reference"></i>
        </el-popconfirm>
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
    item: {
      type: Object
    },
    index: {
      type: [Number, String]
    }
  },
  methods: {
    // 删除 草稿箱
    delDrawing(draft_id, index) {
      this.$emit('delDrawing', draft_id, index)
    },
    // 跳转到 编辑草稿箱
    toDraftsDetail(type,draft_id,ids){
      /*
        type 2点击进行回答 3星球发布主题
        draft_id 草稿id
        ids 星球id/百科id
      */
     this.$router.push({
        path: '/editor', query: {
          type:type,
          ids:ids,
          draft_id:draft_id,
          mode:'update'
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 25px 40px;
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 20px;
  &-left {
    width: 148px;
    height: 148px;
    border-radius: 15px;
    overflow: hidden;
  }
  &-right {
    > i {
      font-size: 24px;
      color: #b5b5b5;
      font-style: normal;
    }
  }
  &-center {
    width: 75%;
    height: 148px;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    > i {
      font-size: 16px;
      color: #b8b8b8;
      // font-weight: 600;
      font-style: normal;
    }
    &-text {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      > p {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        font-size: 20px;
        color: #333;
        // font-weight: 600;
        text-align: justify;
        margin-bottom: 20px !important;
      }
    }
  }
}
</style>