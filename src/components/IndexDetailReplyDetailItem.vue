<template>
  <div class="container IndexDetailReplyDetailItem" v-show="item">
    <div class="content-list-item">
      <!-- 用户 -->
      <div class="content-list-item-user">
        <div class="content-list-item-user-left">
          <User
            :nickname="item.nickname"
            :tx_url="item.member_cover"
            :create_time="item.create_time"
          />
        </div>
        <!-- 回复 -->
        <div class="content-list-item-user-right" v-if="$store.state.member_id!=item.member_id">
          <i
            class="el-icon-chat-dot-round hands"
            @click="item.reply_one = !item.reply_one"
          ></i>
        </div>
        <!-- 删除 -->
        <div class="content-list-item-user-right" v-else>
          <i
            class="el-icon-delete hands"
            @click="delReply(item.replys_id)"
          ></i>
        </div>
      </div>
      <!-- 回复内容 -->
      <p v-html="item.content"></p>
      <!-- 评论图片 只有一级评论有图片 -->
      <div class="content-list-item-img" v-if="item.pictures.length">
        <div class="content-list-item-img-nr content-list-item-img-scroll">
          <div
            class="content-list-item-img-nr-item hands"
            v-for="(itemImg, indexImg) in item.pictures"
            :key="indexImg"
            @click="showImg(itemImg.abs_url)"
          >
            <el-image
              style="width: 100%; height: 100%"
              :src="itemImg.abs_url"
              fit="cover"
            ></el-image>
          </div>
        </div>
      </div>
      <!-- 盖楼 -->
      <div class="content-list-item-box" v-if="item.replys.length != 0">
        <div class="content-list-item-box-nr">
          <div
            class="content-list-item-box-nr-item"
            v-for="(item_reply, index_reply) in item.replys"
            :key="item_reply + index_reply"
          >
            <p style="font-size: 15px">
              <i>{{ item_reply.nickname }}</i>
              {{ item_reply.repm_name ? "回复" : "" }}
              <i style="color: #8590a6">{{ item_reply.repm_name }}</i
              >：<i
                style="color: #666666; font-size: 15px"
                v-html="item_reply.content"
              ></i>
            </p>
            <div class="content-list-item-box-nr-item-btn">
              <b
                class="hands"
                @click="
                  showTwoReply(
                    item_reply.nickname,
                    item.replys_id,
                    item_reply.member_id
                  )
                "
                v-if="$store.state.member_id!=item_reply.member_id"
                >回复</b
              >
              <b
                class="hands"
                @click="delReply(item_reply.replys_id)"
                v-else
                >删除</b
              >
            </div>
          </div>
          <!-- 回复 二级评论 输入框 -->
          <div class="content-list-item-box-nr-reply" v-show="item.reply_two">
            <div class="content-list-item-box-nr-reply-inp">
              <div class="content-list-item-box-nr-reply-inp-tips">
                回复 <i>{{ item.reply_name }}</i
                >：
              </div>
              <div class="content-list-item-box-nr-reply-inp-nr">
                <el-input
                  type="textarea"
                  autosize
                  placeholder="请输入内容"
                  resize="none"
                  v-model="reply_val_two"
                >
                </el-input>
              </div>
            </div>
            <div
              class="content-list-item-box-nr-reply-btn hands"
              @click="bindReplyThree"
            >
              回复
            </div>
          </div>
        </div>
      </div>
      <!-- 回复 一级评论 输入框 -->
      <div class="content-list-item-inp" v-show="item.reply_one">
        <div class="content-list-item-inp-reply">
          <div class="content-list-item-inp-reply-inp">
            <div class="content-list-item-inp-reply-inp-tips">
              回复 <i>{{ item.nickname }}</i
              >：
            </div>
            <div class="content-list-item-inp-reply-inp-nr">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入内容"
                resize="none"
                v-model="reply_val_one"
              >
              </el-input>
            </div>
          </div>
          <div
            class="content-list-item-inp-reply-btn hands"
            @click="bindTwoReply(item.member_id, item.replys_id)"
          >
            回复
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/components/User.vue";
export default {
  data() {
    return {
      reply_two_id: '',//回复二级评论id
      reply_two_userID: '',//被回复的二级评论 用户id
      reply_val_two: '',//回复二级评论内容
      reply_val_one: '',//回复一级评论内容
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: [Number, String]
    }
  },
  components: {
    User,
  },
  methods: {
    // 删除评论
    delReply(replys_id) {
      this.$emit('delReply',replys_id)
    },
    // 回复一级评论 生成二级评论
    bindTwoReply(repm_id, layer_id) {
      this.$emit('bindTwoReply', repm_id, layer_id, this.reply_val_one)
    },
    // 出现/隐藏 评论 二级评论 输入框
    showTwoReply(nickname, replys_id, member_id) {
      /*
        @nickname 被评论的人昵称
        @replys_id 被评论的评论id
        @member_id 被评论的人用户id
        @reply_two 控制回复二级评论输入框 出现/隐藏 状态
        @reply_two_id 保存的被评论的评论id 用于用户继续点击评论二级按钮时判断是否点击的同一个二级评论，以此判断输入框出现隐藏
      */
      if (!this.item.reply_two) {
        // 说明回复首次同一条一级评论下的二级评论
        this.reply_two_id = replys_id
        this.item.reply_two = true
      } else {
        // 非首次 比较保存的reply_two_id 如果相同则关闭评论输入框
        if (this.reply_two_id == replys_id) {
          this.item.reply_two = false
          this.reply_two_id = ''
        } else {
          this.reply_two_id = replys_id
          this.item.reply_two = true
        }
      }
      this.item.reply_name = nickname
      this.reply_two_userID = member_id
    },
    // 回复 二级评论 生成假的三级评论（实际也是一个二级评论）
    bindReplyThree() {
      this.$emit('bindTwoReply', this.reply_two_userID, this.reply_two_id, this.reply_val_two)
    },
    // 预览图片
    showImg(url) {
      window.open(
        url,
        "_blank"
      )
    },
  }
};
</script>

<style lang="scss" scoped>
.content-list-item {
  width: 100%;
  margin-bottom: 30px;
  > p {
    width: 100%;
    box-sizing: border-box;
    padding-left: 60px;
    text-align: justify;
    word-break: break-all;
    font-size: 15px;
    color: #121212;
    font-weight: 400;
    margin-top: 25px;
    margin-bottom: 0;
  }
  &-user {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-right {
      > i {
        font-size: 26px;
        color: #999999;
        font-style: normal;
      }
    }
  }
  &-box {
    width: 100%;
    padding-left: 60px;
    margin-top: 20px;
    &-nr {
      width: 100%;
      padding: 25px 30px;
      background-color: #f6f4f4;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      &-item {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 10px;
        > p {
          width: 84%;
          text-align: justify;
          word-break: break-all;
          font-size: 20px;
          color: #666;
          font-weight: 400;
          margin-bottom: 0;
          > i {
            color: #fbaa00;
            font-style: normal;
          }
        }
        &-btn {
          display: flex;
          align-items: center;
          > b {
            font-size: 16px;
            color: #999;
            font-weight: 400;
            display: inline-block;
            padding: 0 10px;
          }
        }
      }
      &-item:first-child {
        margin-top: 0;
      }
      &-reply {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 20px;
        &-btn {
          width: 62px;
          height: 44px;
          background-color: #fbaa00;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          text-align: center;
          line-height: 44px;
        }
        &-inp {
          width: 92%;
          min-height: 44px;
          border: 2px solid #fbaa00;
          background: #fff;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 0 20px;
          &-tips {
            max-width: 20%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            word-break: break-all;
            height: 44px;
            line-height: 44px;
            font-size: 16px;
            color: #666;
            font-weight: 400;
            > i {
              color: #fbaa00;
              font-style: normal;
            }
          }
          &-nr {
            flex: 1;
            width: 78%;
            min-height: 44px;
          }
        }
      }
    }
  }
  &-inp {
    width: 100%;
    &-reply {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-top: 20px;
      &-btn {
        width: 62px;
        height: 44px;
        background-color: #fbaa00;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        line-height: 44px;
      }
      &-inp {
        width: 92%;
        min-height: 44px;
        border: 2px solid #fbaa00;
        background: #fff;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 0 20px;
        &-tips {
          max-width: 20%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all;
          height: 44px;
          line-height: 44px;
          font-size: 16px;
          color: #666;
          font-weight: 400;
          > i {
            color: #fbaa00;
            font-style: normal;
          }
        }
        &-nr {
          flex: 1;
          min-width: 78%;
          min-height: 44px;
        }
      }
    }
  }
  &-img {
    width: 100%;
    padding-left: 60px;
    &-nr {
      width: 100%;
      display: flex;
      align-items: center;
      &-item {
        flex-shrink: 0;
        width: 135px;
        height: 135px;
        margin-left: 30px;
      }
      &-item:first-child {
        margin-left: 0;
      }
    }
    &-scroll {
      height: 180px;
      overflow-x: auto;
    }
    /* 定义滚动条样式 */
    &-scroll::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &-scroll::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ededed;
      border-radius: 10px;
    }
    /*定义滑块 内阴影+圆角*/
    &-scroll::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #2877e6;
      background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
      );
    }
  }
}
</style>