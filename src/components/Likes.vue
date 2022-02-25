<template>
  <div class="container">
    <div class="likes" @click="bindLikes">
      <img src="@/assets/images/img_12.png" alt="" v-show="is_like != 1" />
      <img src="@/assets/images/img_11.png" alt="" v-show="is_like == 1" />
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
    // type 1 说说详情 2 加入的星球(全部主题)/加入的星球(星主分享)/加入的星球(热门主题) 3 加入的星球(问题主题)
    type: {
      type: [String, Number]
    },
    // 是否已经点赞状态
    is_like: {
      type: [String, Number]
    }
  },
  methods: {
    // 点赞
    bindLikes() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        rele_id: this.rele_id,
        type: this.type == 1 ? '1' : this.type == 2 ? '3' : '2'
      }
      this.$api.api.Like(data).then((res) => {
        this.$Message({
          message: res.data.message,
          type: 'success'
        })
        // type 1 说说详情 2 加入的星球(全部主题)/加入的星球(星主分享)/加入的星球(热门主题) 3 加入的星球(问题主题)
        switch (this.type) {
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
.likes {
  width: 100%;
  height: 100%;
  > img {
    width: 100%;
    height: 100%;
  }
}
</style>