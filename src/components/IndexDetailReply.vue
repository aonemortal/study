<template>
  <div class="container" v-if="item">
    <div
      class="item hands"
      :style="index === 0 ? 'border-radius: 0 0 10px 10px;' : ''"
      @click="toDetail(item.answers_id, item.pc_type)"
    >
      <!-- 用户 -->
      <div class="item-user">
        <User
          :nickname="item.nickname"
          :tx_url="item.member_cover"
          :create_time="item.create_time"
        />
        <div
          class="item-user-else"
          @click.stop
          v-if="type == 1 && item.is_mine == 1"
        >
          <el-dropdown trigger="click" @command="handelCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" style="font-size: 22px; color: #999"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 标题 -->
      <h2 v-if="item.subject">{{ item.subject }}</h2>
      <!-- 内容 -->
      <p style="max-width: 100%">
        <textShow
          :content="item.content"
          :content_fu="item.content_wap"
          :more="item.more"
          :index="index"
        ></textShow>
      </p>
      <!-- 文件列表 -->
      <div
        class="item-file item-scroll"
        v-if="item.file_type == 3 && item.pictures.length != 0"
      >
        <div
          class="item-file-item hands"
          v-for="(item_file, index_file) in item.pictures"
          :key="item_file + index_file"
          @click.stop="showFile(item_file.abs_url, item_file.ext)"
        >
          <div class="item-file-item-icon">
            <img src="@/assets/images/img_16.png" alt="" />
          </div>
          <h2>{{ item_file.name }}</h2>
        </div>
      </div>
      <!-- 图片列表 -->
      <div
        class="item-img item-scroll"
        v-if="item.file_type == 1 && item.pictures.length != 0"
      >
        <div
          class="item-img-item hands"
          v-for="(item_pic, index_pic) in item.pictures"
          :key="item_pic + index_pic"
          @click.stop="showImg(item_pic.abs_url)"
        >
          <el-image
            style="width: 100%; height: 100%"
            :src="item_pic.abs_url"
            fit="cover"
          ></el-image>
        </div>
      </div>
      <!-- 查看更多 -->
      <!-- <div class="item-more">
        <p class="hands" @click="toDetail(item.answers_id,item.pc_type)">
          查看更多<i class="el-icon-d-arrow-right"></i>
        </p>
      </div> -->
      <!-- 点赞 -->
      <div class="item-btn" style="margin-top: 20px">
        <div class="item-btn-item" v-if="type == 1" @click.stop="bindLike">
          <div class="item-btn-item-icon" title="点赞">
            <img
              v-if="item.is_like == 1"
              src="@/assets/images/img_11.png"
              alt=""
            />
            <img v-else src="@/assets/images/img_12.png" alt="" />
          </div>
          <i>{{ item.like }}人</i>
          <b>点赞</b>
        </div>
        <div class="item-btn-item" v-if="type == 2">
          <div class="item-btn-item-icon" title="点赞">
            <img
              v-if="item.is_like == 1"
              src="@/assets/images/img_11.png"
              alt=""
            />
            <img v-else src="@/assets/images/img_12.png" alt="" />
          </div>
          <i>{{ item.like }}人</i>
          <b>点赞</b>
        </div>
        <div class="item-btn-item" title="评论">
          <div class="item-btn-item-icon">
            <img src="@/assets/images/img_13.png" alt="" />
          </div>
          <b>评论</b>
        </div>
        <div class="item-btn-item"  title="收藏">
          <div class="item-btn-item-icon">
            <!-- <img src="@/assets/images/img_15.png" alt="" /> -->
             <img src="@/assets/images/cang.png" alt="" />
          </div>
          <b>收藏</b>
        </div>
         
      </div>
      <!-- 回复 -->
      <div class="item-reply" v-if="item.layer.length != 0">
        <div
          class="item-reply-content"
          v-for="(item_reply, index_reply) in item.layer"
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
            >{{ item_reply.nickname }}{{ item_reply.repm_name ? "" : "：" }}</i
          >
          {{ item_reply.repm_name ? "回复" : "" }}
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
      <div class="item-reply-more" v-if="item.layer.length != 0">
        <!-- <p class="hands">查看全部评论<i class="el-icon-d-arrow-right"></i></p> -->
        <p class="hands">查看全部评论&gt;&gt;</p>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/components/User.vue"
import textShow from "@/components/textShow.vue"
export default {
  data() {
    return {

    };
  },
  props: {
    index: {
      type: Number,
    },
    item: {
      type: Object,
    },
    // 1 说说 2 收藏
    type: {
      type: [Number, String]
    }
  },
  components: {
    textShow,
    User
  },
  methods: {
    // 预览图片
    showImg(url) {
      window.open(
        url,
        "_blank"
      )
    },
    // 预览文件
    showFile(url, ext) {
      if (ext === 'doc' || ext === 'docx' || ext === 'word') {
        window.open(
          "https://view.officeapps.live.com/op/view.aspx?src=" + url,
          "_blank"
        )
      } else {
        window.open(
          url,
          "_blank"
        )
      }
    },
    // 跳转到详情
    toDetail(answers_id, type) {
      this.$router.push({
        path: '/indexdetailreplydetail',
        query: {
          ids: answers_id,
          type: type
        }
      })
    },
    // 处理 说说
    handelCommand(command) {
      this.$emit('answerHandel', this.index, this.item.answers_id, command)
    },
    // 说说点赞
    bindLike() {
      let data = {
        member_id: localStorage.getItem('member_id'),
        rele_id: this.item.answers_id,
        type: 1
      }
      this.$api.api.Like(data).then((res) => {
        this.$Message({
          message: res.data.message,
          type: 'success'
        })
        if (this.item.is_like == 1) {
          this.item.is_like = 2
          this.item.like = Number(this.item.like) - 1
        } else {
          this.item.is_like = 1
          this.item.like = Number(this.item.like) + 1
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 25px 40px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &-user {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  > h2 {
    width: 100%;
    text-align: justify;
    font-size: 20px;
    color: #333;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  // > p {
  //   width: 100%;
  //   text-align: justify;
  //   font-size: 20px;
  //   color: #666;
  //   font-weight: 400;
  //   margin-top: 15px;
  //   display: -webkit-box;
  //   -webkit-box-orient: vertical;
  //   -webkit-line-clamp: 3;
  //   overflow: hidden;
  //   word-break: break-all;
  //   margin-bottom: 0;
  // }
  &-more {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    > p {
      font-size: 20px;
      color: #fbaa00;
      font-weight: 400;
      margin-bottom: 0;
    }
  }
  &-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
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
        font-size: 14px;
        color: #fbaa00;
        font-weight: 500;
        font-style: normal;
      }
      > b {
        font-size: 14px;
        color: #666;
        font-weight: 500;
      }
    }
  }
  &-reply {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
    &-content {
      width: 100%;
      margin-top: 10px;
      text-align: justify;
      word-break: break-all;
      font-size: 16px;
      color: #666666;
      font-weight: 500;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
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
    margin-top: 15px;
    > p {
      font-size: 15px;
      color: #999999;
      font-weight: 400;
      margin-bottom: 0;
    }
  }
  &-img {
    width: 100%;
    margin-top: 5px;
    display: flex;
    align-items: center;
    &-item {
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      margin-left: 30px;
    }
    &-item:first-child{
      margin-left: 0;
    }
  }
  &-file {
    width: 100%;
    margin-top: 5px;
    display: flex;
    align-items: center;
    &-item {
      flex-shrink: 0;
      margin-left: 40px;
      max-width: 440px;
      padding: 15px;
      background: #f6f4f4;
      border: 2px solid #f6f4f4;
      border-radius: 10px;
      display: flex;
      align-items: center;
      &-icon {
        width: 38px;
        height: 38px;
        margin-right: 20px;
        >img{
          width: 100%;
          height: 100%;
        }
      }
      > h2 {
        max-width: 260px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-wrap: break-word;
        margin-bottom: 0;
      }
    }
    &-item:first-child {
      margin-left: 0;
    }
  }
  &-scroll {
    height: 120px;
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
</style>
