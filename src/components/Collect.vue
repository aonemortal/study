<template>
  <div class="container">
    <div class="collect" @click="bindCollect">
      <img src="@/assets/images/img_14.png" alt="" v-show="is_collect != 1" />
      <img src="@/assets/images/img_15.png" alt="" v-show="is_collect == 1" />
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
    //说说ID/星球回答ID/星球主题ID/星球主题或回答的评论ID
    rele_id: {
      type: [String, Number]
    },
    // status 1 说说详情 2 加入的星球(全部主题)/加入的星球(星主分享)/加入的星球(热门主题) 3 加入的星球(问题主题)
    status: {
      type: [String, Number]
    },
    // 是否已经收藏状态
    is_collect: {
      type: [String, Number]
    },
    type: {
      type: [String, Number]
    }
  },
  methods: {
    // 收藏
    bindCollect() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        answers_id: this.rele_id,
        type: this.type
      }
      this.$api.api.Collect(data).then((res) => {
        this.$Message({
          message: res.data.message,
          type: 'success'
        })
        // status 1 说说详情 2 加入的星球(全部主题)/加入的星球(星主分享)/加入的星球(热门主题) 3 加入的星球(问题主题)
        switch (this.status) {
          case '1':
            this.$parent.getAnswersDetail()
            break;
          case '2':
            this.$parent.getPostsDetail()
            break;
          case '3':
            this.$parent.getQuestionsDetail()
            break;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.collect {
  width: 100%;
  height: 100%;
  > img {
    width: 100%;
    height: 100%;
  }
}
</style>