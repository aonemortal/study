<template>
  <div class="container DetaileditPopup" v-if="details">
    <!-- header -->
    <div class="nav">
      <HeaderNotLogo />
    </div>
    <!-- 内容 -->
    <div class="content">
      <!-- title -->
      <!-- <div class="content-title">
        <Breadcrumb @toback="bindBack" title="详情" />
      </div> -->
      <!-- 内容 -->
      <div class="content-box">
        <!-- 用户 -->
        <div class="content-box-user">
          <User
            :nickname="details.nickname"
            :tx_url="details.member_cover"
            :create_time="details.create_time"
          />
          <img class="imgts" src="@/assets/images/dian.png" alt="" />

        </div>
        <!-- 加入的星球 主题详情 -->
        <div class="content-box-hot" v-if="details.is_hot == 1 && type == 2">
          <div class="content-box-hot-title">
            <i>HOT</i>
            <p>{{ details.subject }}</p>
          </div>
        </div>
        <!-- 加入的星球 问题详情 -->
        <div class="content-box-problem" v-if="type == 3">
          <div class="content-box-problem-title">
            <div class="content-box-problem-title-icon">
              <img src="@/assets/images/img_18.png" alt="" />
            </div>
            <p>{{ details.content }}</p>
          </div>
          <div class="content-box-problem-content">
            <div class="content-box-problem-content-icon">
              <img src="@/assets/images/img_19.png" alt="" />
            </div>
            <p v-html="details.answers.content_view"></p>
          </div>
        </div>
        <!-- 文本 -->
        <div class="content-box-text" @click="tohuati" v-if="type != 3"  v-html="details.content">
          <!-- <i>#消费主义骗局 </i> -->
          <!-- {{ details.content }} -->
        </div>
        <!-- 图片列表 -->
        <div
          class="content-box-img content-box-scroll"
          v-if="details.file_type == 1 && details.pictures.length != 0"
        >
          <div
            class="content-box-img-item hands"
            v-for="(item, index) in details.pictures"
            :key="item + index"
            @click="showImg(details.pictures)"
          >
            <el-image
              style="width: 100%; height: 100%"
              :src="item.abs_url"
              fit="cover"
							:preview-src-list="imagelist"
            ></el-image>
          </div>
        </div>
        <!-- 文件列表  content-box-scroll content-box-file-->
        <div
          class=" "
          v-if="details.file_type == 3 && details.pictures.length != 0"
        >
          <div
            class="content-box-file-item hands"
            v-for="(item, index) in details.pictures"
            :key="item + index"
            @click="showFile(item.abs_url, item.ext)"
          >
            <div class="content-box-file-item-icon">
              <img src="@/assets/images/img_16.png" alt="" />
            </div>
            <h2>{{ item.name }}</h2>
          </div>
        </div>
        <!-- 图标 -->
        <div class="content-box-icon">
          <div class="content-box-icon-item hands">
            <Likes
              :rele_id="type == 3 ? details.rele_id : ids"
              :type="type"
              :is_like="type == 3 ? details.answers.is_like : details.is_like"
            ></Likes>
          </div>
          <div class="content-box-icon-item hands" @click="popupStatus = true">
            <img src="@/assets/images/img_13.png" alt="" />
          </div>
          <div class="content-box-icon-item hands" >
            <Collect
              :rele_id="type == 3 ? details.rele_id : ids"
              :status="type"
              :type="details.type"
              :is_collect="
                type == 3 ? details.answers.is_collect : details.is_collect
              "
            ></Collect>
          </div>
        </div>
        <!-- 点赞人数 -->
        <div class="content-box-nums">
          <div
            class="content-box-nums-pic"
            v-if="type == 3 ? details.answers.like : details.like != 0"
          >
            <div
              class="content-box-nums-pic-item"
              v-for="(item_like, index_like) in type == 3
                ? details.answers.like_member
                : details.like_member"
              :key="item_like + index_like"
            >
              <el-image
                style="width: 100%; height: 100%"
                :src="item_like.url"
                fit="cover"
              ></el-image>
            </div>
          </div>
          <p>{{ type == 3 ? details.answers.like : details.like }} 人赞过</p>
        </div>
      </div>
      <!-- 回复列表 -->
      <div class="content-list" v-show="layerList.length != 0">
        <div class="content-list-title">评论</div>
        <IndexDetailReplyDetailItem
          ref="IndexDetailReplyDetailItem"
          v-for="(item, index) in layerList"
          :key="item + index"
          :index="index"
          :item="item"
          @bindTwoReply="bindTwoReply"
          @delReply="delReply"
        />
      </div>
    </div>
    <!-- 发布 一级评论 弹窗 -->
    <el-dialog
      title="发布评论"
      :visible.sync="popupStatus"
      width="930px"
      center
      :close-on-click-modal="false"
      @close="popupStatus = false"
      :lock-scroll="false"
    >
      <div class="box">
        <!-- 编辑 -->
        <div class="box-content">
          <!-- 编辑框 -->
          <div class="box-content-edit">
            <el-input
              type="textarea"
              placeholder="请输入内容..."
              v-model="textarea_val"
              resize="none"
              maxlength="10000"
            >
            </el-input>
          </div>
          <!-- 图片 -->
          <div class="box-content-img box-content-scroll" v-if="imgList.length">
            <div
              class="box-content-img-item hands"
              v-for="(items, indexs) in imgList"
              :key="indexs"
              @click="showImg(items.abs_url)"
            >
              <el-image
                style="width: 100%; height: 100%"
                :src="items.abs_url"
                fit="cover"
              ></el-image>
              <div
                class="box-content-img-item-del hands"
                @click.stop="bindDel(indexs)"
              >
                <i class="el-icon-delete" style="color: #fff"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部操作栏 -->
        <div class="box-bottom">
          <div class="box-bottom-left">
            <!-- 表情 -->
            <div class="box-bottom-left-item hands" v-if="false">
              <el-popover
                placement="bottom"
                width="200"
                trigger="manual"
                popper-class="elPopover"
                v-model="emojiShow"
              >
                <div
                  class="box-bottom-left-item-icon"
                  slot="reference"
                  @click="emojiShow = !emojiShow"
                >
                  <img src="@/assets/images/img_4.png" alt="" />
                </div>
                <!-- 表情 -->
                <div class="browBox">
                  <ul>
                    <li
                      v-for="(item, index) in faceList"
                      :key="index"
                      @click="getBrow(index)"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </el-popover>
            </div>
            <!-- 传图 -->
            <div class="box-bottom-left-item hands">
              <el-upload
                class="upload-demo"
                :action="upload_URL"
                :on-success="handleSuccessImg"
                :on-progress="handelProgressImg"
                :show-file-list="false"
                list-type="picture"
                accept="image/*"
              >
                <div class="box-bottom-left-item-icon">
                  <img src="@/assets/images/img_5.png" alt="" />
                </div>
              </el-upload>
            </div>
          </div>
          <div class="box-bottom-right">
            <p>( {{ textarea_val.length }}~10000 )</p>
            <div class="box-bottom-right-btn hands" @click="bindSubmit">
              发布
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HeaderNotLogo from "@/components/HeaderNotLogo.vue"
import Breadcrumb from "@/components/Breadcrumb.vue"
import User from "@/components/User.vue"
import IndexDetailReplyDetailItem from "@/components/IndexDetailReplyDetailItem.vue"
import Likes from "@/components/Likes.vue"
import Collect from "@/components/Collect.vue"
import baseurl from '@/network/baseURL.js'
export default {
  data() {
    return {
      popupStatus: false,//一级评论 弹窗 是否出现
      textarea_val: '',//一级评论 内容
      ids: '',//说说id
      details: '',//说说详情
      page: 1,//分页
      layerList: [],//评论列表
      rele_id: '',//问答 内容id  只有问答详情有
      type: '1',//1 说说详情 2加入的星球(全部主题)/加入的星球(星主分享)/加入的星球(热门主题) 3加入的星球(问题主题)
      imgList: [],//上传图片数据
      upload_URL: baseurl.upload_URL,//上传地址
			imagelist:[],
    };
  },
  components: {
    HeaderNotLogo,
    Breadcrumb,
    User,
    IndexDetailReplyDetailItem,
    Likes,
    Collect
  },
  mounted() {
    this.ids = this.$route.query.ids
    this.type = this.$route.query.type
    switch (this.type) {
      // type  1 说说详情 2加入的星球(全部主题)/加入的星球(星主分享)/加入的星球(热门主题) 3加入的星球(问题主题)
      case '1':
        console.log('说说详情')
        // 获取说说详情
        this.getAnswersDetail()
        // 获取说说评论列表
        this.getLayerList()
        break;
      case '2':
        console.log('全部主题')
        // 获取主题详情
        this.getPostsDetail()
        // 获取一级评论列表
        this.getLayerListOne()
        break;
      case '3':
        console.log('问题主题')
        // 获取问题详情
        this.getQuestionsDetail()
        // 获取一级评论列表
        this.getLayerListOne()
        break;
    }
  },
  methods: {
		gaishuju(value){ //处理数据
			var findArray=value.match(/#.+?#/)
			if(null==findArray||0==findArray.length)return value
			// var result=value.substr(0,findArray.index) +"<router-link style='color:#fbaa00' to={name:'huati',params:{name:'"+value.substr(findArray.index,findArray[0].length)+"}'}>" +value.substr(findArray.index,findArray[0].length)+"</router-link>"
			var result=value.substr(0,findArray.index) +"<asdasd style='color:#fbaa00;display: inline-block;cursor: pointer; margin-bottom:30px; ' value="+value.substr(findArray.index,findArray[0].length)+" >" +value.substr(findArray.index,findArray[0].length)+"</asdasd>"
			if(value.length>findArray.index+findArray[0].length){
				result=result+this.gaishuju(value.substr(findArray.index+findArray[0].length))
				// console.log(result)
			}
			return result
		},
		tohuati(e) {
			// console.log(e)
			if(e.target.localName=="asdasd"){
				this.$router.push({
				  path: '/huati',
				  query: {
						name:e.target.innerHTML
				    // ids: this.type == 3 ? this.item.questions_id : this.item.answers_id,
				    // type: this.type == 3 ? this.item.answers.pc_type : this.item.pc_type
				  }
				})
			}
		 
		},
    // 获取说说详情
    getAnswersDetail() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        answers_id: this.ids
      }
      this.$api.api.AnswersDetail(data).then((res) => {
        this.details = res.data.data
				this.details.pictures.map(item=>{
					this.imagelist.push(item.abs_url)
				})
      })
    },
    // 获取说说评论列表
    getLayerList() {
      let data = {
        answers_id: this.ids,
        p: this.page
      }
      this.$api.api.LayerList(data).then((res) => {
        this.layerList = res.data.data.list
      })
    },
    // 获取 加入的星球 主题详情
    getPostsDetail() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        answers_id: this.ids
      }
      this.$api.api.PostsDetail(data).then((res) => {
        this.details = res.data.data
				this.details.content=this.gaishuju(this.details.content)
				this.details.pictures.map(item=>{
					this.imagelist.push(item.abs_url)
				})
      })
    },
    // 获取 加入的星球 问答详情
    getQuestionsDetail() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        questions_id: this.ids
      }
      this.$api.api.QuestionsDetail(data).then((res) => {
        this.details = res.data.data
        this.rele_id = res.data.data.rele_id
        this.getLayerListOne(res.data.data.rele_id)
      })
    },
    // 获取 加入的星球 一级评论列表
    getLayerListOne(rele_id) {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        rele_id: this.type == 3 ? rele_id : this.ids,
        type: this.type == 3 ? '2' : '3'
      }
      this.$api.api.LayerListOne(data).then((res) => {
        this.layerList = res.data.data.list
      })
    },
    // 返回上一页
    bindBack() {
      this.$router.go(-1);
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
    // 预览图片
    showImg(url) {
			// console.log(url)
			// url.map(item=>{
			// 	this.imagelist.push(item.abs_url)
			// })
      // window.open(
      //   url,
      //   "_blank"
      // )
    },
    // 删除评论
    delReply(replys_id) {
      this.$api.api.ReplysDelete({
        member_id: localStorage.getItem('member_id') || '',
        replys_id: replys_id
      }).then(res => {
        this.$Message({
          message: res.data.message,
          type: 'success'
        })
        if (this.type == 1) {
          // 说说
          this.getLayerList()
        } else {
          // 主题
          this.getLayerListOne(this.rele_id)
        }
      })
    },
    // 评论一级评论 生成 二级评论
    bindTwoReply(repm_id, layer_id, content) {
      if (this.type == 1) {
        // 说说
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          content: content,
          rele_id: this.ids,
          repm_id: repm_id,
          layer_id: layer_id
        }
        this.$api.api.EncycDoReply(data).then((res) => {
          this.$Message({
            message: res.data.message,
            type: 'success'
          })
          this.getLayerList()
          this.$refs.IndexDetailReplyDetailItem.reply_val_one = ''
          this.$refs.IndexDetailReplyDetailItem.reply_val_two = ''
        })
      } else {
        // 主题
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          content: content,
          rele_id: this.type == 3 ? this.rele_id : this.ids,
          repm_id: repm_id,
          layer_id: layer_id
        }
        this.$api.api.DoReply(data).then((res) => {
          this.$Message({
            message: res.data.message,
            type: 'success'
          })
          this.getLayerListOne(this.rele_id)
          this.$refs.IndexDetailReplyDetailItem.reply_val_one = ''
          this.$refs.IndexDetailReplyDetailItem.reply_val_two = ''
        })
      }
    },
    // 生成 一级评论
    bindSubmit() {
      let pictures = this.imgList.length ? [].concat(this.imgList.map((item) => { return item.id })).join(',') : ''
      if (this.type == 1) {
        // 说说
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          content: this.textarea_val,
          rele_id: this.ids,
          pictures: pictures
        }
        this.$api.api.EncycDoReply(data).then((res) => {
          this.$Message({
            message: res.data.message,
            type: 'success'
          })
          this.getLayerList()
          this.textarea_val = ''
          this.popupStatus = false
        })
      } else {
        // 主题
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          content: this.textarea_val,
          rele_id: this.type == 3 ? this.rele_id : this.ids,
          pictures: pictures
        }
        this.$api.api.DoReply(data).then((res) => {
          this.$Message({
            message: res.data.message,
            type: 'success'
          })
          this.getLayerListOne(this.rele_id)
          this.textarea_val = ''
          this.popupStatus = false
        })
      }
    },
    // 图片正在上传
    handelProgressImg(res) {
      this.loading = true
      console.log(res, '图片正在上传')
    },
    // 图片上传成功
    handleSuccessImg(res) {
      console.log(res, '图片上传成功')
      this.loading = false
      if (res.flag == 'success') {
        this.imgList = this.imgList.concat(res.data)
        console.log(this.imgList, 'imgList')
      } else {
        this.$Message({
          message: res.message,
          type: 'error'
        })
      }
    },
    // 上传图片 预览
    // showImg(url) {
    //   window.open(
    //     url,
    //     "_blank"
    //   )
    // },
    // 删除 上传 图片
    bindDel(index) {
      this.imgList.splice(index, 1)
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}
.imgts{
  height:10px;
  width: 30px;
}
.content {
  width: 730px;
  min-width: 730px;
  background-color: #fff;
  border-radius: 10px;
  padding: 0 40px;
  margin: 100px auto;
  &-title {
    width: 100%;
    border-bottom: 2px solid #f6f4f4;
  }
  &-box {
    width: 100%;
    padding: 30px 0;
    &-user {
      width: 100%;
      display: flex;
    }
    &-hot {
      width: 100%;
      &-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        > i {
          display: block;
          width: 44px;
          height: 26px;
          background: #fbaa00;
          border-radius: 4px;
          text-align: center;
          line-height: 26px;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
          font-style: normal;
        }
        > p {
          width: 95%;
          text-align: justify;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          font-size: 20px;
          color: #333;
          font-weight: 600;
          margin-bottom: 0;
        }
      }
    }
    &-problem {
      width: 100%;
      &-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        &-icon {
          width: 26px;
          height: 26px;
        }
        > p {
          width: 97%;
          font-size: 20px;
          color: #333;
          font-weight: 400;
          text-align: justify;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all;
          margin-bottom: 0;
        }
      }
      &-content {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 10px;
        &-icon {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          > img {
            width: 20px;
            height: 20px;
          }
        }
        > p {
          width: 97%;
          font-size: 15px;
          color: #121212;
          font-weight: 400;
          text-align: justify;
          // display: -webkit-box;
          // -webkit-box-orient: vertical;
          // -webkit-line-clamp: 3;
          // overflow: hidden;
          margin-bottom: 0;
        }
      }
    }
    &-text {
      width: 100%;
      text-align: justify;
      font-size: 15px;
      color: #121212 ; //FBAA00;
      font-weight: 400;
      line-height: 1.8;
      margin-top: 20px;
      word-break: break-all;
      > i {
        color: #0088f0;
        font-style: normal;
      }
    }
    &-img {
      width: 100%;
      margin-top: 5px;
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
    &-file {
      width: 100%;
      margin-top: 5px;
      display: flex;
      align-items: center;
      &-item {
        flex-shrink: 0;
        // margin-left: 40px;
        max-width: 440px;
        padding: 30px;
		padding-left: 0;
        // background: #f6f4f4;
        // border: 2px solid #f6f4f4;
        border-radius: 10px;
        display: flex;
        align-items: center;
        &-icon {
          width: 48px;
          height: 48px;
          margin-right: 20px;
          > img {
            width: 100%;
            height: 100%;
			border-radius: 10px;
          }
        }
        > h2 {
          max-width: 260px;
          font-size: 20px;
          color: #333;
          font-weight: 600;
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
      height: 160px;
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
    &-icon {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 30px;
      &-item {
        width: 26px;
        height: 26px;
        margin-right: 30px;
      }
    }
    &-nums {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 30px;
      &-pic {
        display: flex;
        align-items: center;
        margin-right: 20px;
        &-item {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-left: -15px;
        }
        &-item:first-child {
          margin-left: 0;
        }
      }
      > p {
        font-size: 20px;
        color: #666;
        font-weight: 400;
        margin-bottom: 0;
      }
    }
  }
  &-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-top: 2px solid #f6f4f4;
    &-title {
      width: 100%;
      text-align: left;
      font-size: 20px;
      color: #333;
      font-weight: 600;
      padding: 25px 0;
    }
  }
}
.box {
  width: 100%;
  &-content {
    width: 100%;
    padding: 35px 0 25px 0;
    border-top: 2px solid #f6f4f4;
    &-edit {
      width: 100%;
    }
    &-img {
      width: 100%;
      display: flex;
      align-items: center;
      &-item {
        flex-shrink: 0;
        width: 135px;
        height: 135px;
        margin-left: 30px;
        position: relative;
        z-index: 5;
        &-del {
          position: absolute;
          z-index: 6;
          right: -10px;
          top: -10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      &-item:first-child {
        margin-left: 0;
      }
    }
    &-scroll {
      height: 160px;
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
  &-bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 25px;
    border-top: 2px solid #f6f4f4;
    &-left {
      display: flex;
      align-items: center;
      &-item {
        margin-right: 30px;
        width: 26px;
        height: 26px;
        overflow: hidden;
        &-icon {
          width: 26px;
          height: 26px;
        }
      }
    }
    &-right {
      display: flex;
      align-items: center;
      > p {
        font-size: 18px;
        color: #999999;
        font-weight: 600;
      }
      &-btn {
        width: 92px;
        height: 34px;
        background: #fbaa00;
        border-radius: 4px;
        text-align: center;
        line-height: 34px;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        margin-left: 20px;
      }
    }
  }
}
</style>