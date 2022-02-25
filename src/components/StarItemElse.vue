<template>
  <div class="container">
    <div class="item">
      <div class="item-btn">
        <!-- 点赞 -->
        <div class="item-btn-item" title="点赞" @click.stop="bindLike">
          <div class="item-btn-item-icon">
            <img v-if="is_like == 1" src="@/assets/images/img_11.png" alt="" />
            <img v-else src="@/assets/images/img_12.png" alt="" />
          </div>
          <i>{{ like }}人</i>
          <b>点赞</b>
        </div>
        <!-- 评论 -->
        <div class="item-btn-item" title="评论">
          <div class="item-btn-item-icon">
            <img src="@/assets/images/img_13.png" alt="" />
          </div>
          <b>评论</b>
        </div>
        <!-- 收藏 -->
        <div class="item-btn-item" title="收藏" @click.stop="bindCollect">
          <div class="item-btn-item-icon">
            <img
              src="@/assets/images/img_14.png"
              alt=""
              v-show="is_collect != 1"
            />
            <img
              src="@/assets/images/img_15.png"
              alt=""
              v-show="is_collect == 1"
            />
          </div>
          <b>收藏</b>
        </div>
      </div>
      <!-- 回复 -->
      <div
        class="item-reply"
        style="margin-top: 15px"
        v-show="layer.length != 0"
      >
        <div
          class="item-reply-content"
          v-for="(item_reply, index_reply) in layer"
          :key="item_reply + index_reply"
        >
          <i
            class="el-icon-chat-dot-round"
            style="color: #00aaff; font-size: 22px; margin-right: 5px"
          ></i>
          <!-- <img style="width:26px;height:26px;display:inline-block;margin-right:10px;" src="@/assets/images/img_22.png" alt=""> -->
          <i
            style="
              color: #333;
              font-size: 16px;
              font-weight: 500;
              font-style: normal;
            "
            >{{ item_reply.nickname }}{{item_reply.repm_name?'':'：'}}</i
          >
           {{item_reply.repm_name?'回复':''}}
          <i
            style="
              color: #8590a6;
              font-size: 16px;
              <!-- font-weight: 500; -->
              font-style: normal;
            "
            v-if="item_reply.repm_name"
            >{{ item_reply.repm_name }}：</i
          >
          <i
            style="color: #666666; font-size: 16px"
            v-html="item_reply.content"
          ></i>
        </div>
        <div class="item-reply-content" v-show="false">
          <i
            style="
              color: #333;
              font-size: 18px;
              font-weight: 600;
              font-style: normal;
            "
            >陈晓文</i
          >
          回复
          <i
            style="
              color: #333;
              font-size: 18px;
              font-weight: 600;
              font-style: normal;
            "
            >陈晓文：</i
          >我不玩空间就只剩下朋友圈了
        </div>
        <!-- <div class="item-reply-list">
          <div class="item-reply-list-item">
            <i>{{ item.nickname }}</i> 回复
            <i>铁憨憨{{ index_reply + 1 }}号：</i
            >我不玩空间就只剩下朋友圈了我不玩空间就只剩下朋友圈了我不玩空间就只剩下朋友圈了我不玩空间就只剩下朋友圈了我不玩空间就只剩下朋友圈了
          </div>
          <div class="item-reply-list-item">
            <i>{{ item.nickname }}</i> 回复
            <i>铁憨憨{{ index_reply + 1 }}号：</i>我不玩空间就只剩下朋友圈了
          </div>
        </div> -->
      </div>
      <!-- 查看更多回复 -->
      <div class="item-reply-more" v-show="layer.length != 0">
        <!-- <p class="hands">查看全部评论<i class="el-icon-d-arrow-right"></i></p> -->
        <p class="hands">查看全部评论&gt;&gt;</p>
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
    like: {
      type: [Number, String]
    },
    layer: {
      type: Array
    },
    is_like: {
      type: [Number, String]
    },
    // 是否已经收藏状态
    is_collect: {
      type: [String, Number]
    },
  },
  methods: {
    // 点赞
    bindLike() {
      this.$emit('bindLike')
    },
    //  收藏
    bindCollect() {
      this.$emit('bindCollect')
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;

  &-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &-item {
      display: flex;
      align-items: center;
      margin-right: 30px;
      &-icon {
        width: 22px;
        height: 22px;
        margin-right: 10px;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      > i {
        font-size: 15px;
        color: #fbaa00;
        font-weight: 600;
        font-style: normal;
      }
      > b {
        font-size: 15px;
        color: #666;
        font-weight: 600;
      }
    }
  }
  &-reply {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // margin-top: 10px;
    &-content {
      width: 100%;
      margin-top: 10px;
      text-align: justify;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
      font-size: 16px;
      color: #666666;
      font-weight: 500;
    }
    &-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      &-item {
        width: 100%;
        text-align: justify;
        font-size: 18px;
        color: #666666;
        font-weight: 400;
        margin-top: 10px;
        > i {
          font-size: 18px;
          color: #333333;
          font-weight: 600;
          font-style: normal;
        }
      }
    }
  }
  &-reply-more {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    > p {
      font-size: 18px;
      color: #999999;
      font-weight: 400;
      margin-bottom: 0;
    }
  }
}
</style>