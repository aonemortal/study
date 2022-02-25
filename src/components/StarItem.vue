<template>
  <div class="container">
    <div
      class="item hands"
      @click="toDetail"
      :style="index == 0 ? 'border-radius: 0 0 10px 10px' : ''"
    >
      <!-- 用户 -->
      <div class="item-user">
        <User
          :nickname="item.nickname"
          :tx_url="item.member_cover"
          :create_time="item.create_time"
        />
        <div class="item-user-else" @click.stop v-if="item.is_mine == 1">
          <el-dropdown trigger="click" @command="handelCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" style="font-size: 22px; color: #999"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="del">删除</el-dropdown-item>
							<el-dropdown-item command="update">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 所有主题 星主分享 -->
      <div class="item-all" v-if="type == 0 || type == 1">
        <h2>{{ item.subject }}</h2>
        <p style="max-width: 100%">
          <textShow
            :content="item.content"
            :content_fu="item.content_wap"
            :more="item.more"
            :index="index"
          ></textShow>
        </p>
      </div>
      <!-- 问题主题 -->
      <div class="item-problem" v-if="type == 3">
        <div class="item-problem-title">
          <div class="item-problem-title-icon">
            <img src="@/assets/images/img_18.png" alt="" />
          </div>
          <p>{{ item.content_view}}</p>
        </div>
        <div class="item-problem-content">
          <div class="item-problem-content-icon">
            <img src="@/assets/images/img_19.png" alt="" />
          </div>
          <p>
            <textShow
              :content="item.answers.content_view"
              :content_fu="item.answers.content_wap"
              :more="item.answers.more"
            ></textShow>
          </p>
        </div>
      </div>
      <!-- 热门主题 -->
      <div class="item-hot" v-if="type == 2">
        <div class="item-hot-title">
          <i>HOT</i>
          <p>{{ item.subject }}</p>
        </div>
        <p style="max-width: 100%">
          <textShow
            :content="item.content"
            :content_fu="item.content_wap"
            :more="item.more"
            :index="index"
          ></textShow>
        </p>
      </div>
      <!-- 文件列表 -->
	  <!-- item-scroll item-file -->
      <div
        class="" 
        v-if="item.file_type == 3 && item.pictures.length != 0"
      >
        <div
          class="item-file-item hands"
          v-for="(item_file, index_file) in item.pictures"
          :key="item_file + index_file"
          @click.stop="showFile(item_file.abs_url, item_file.ext)"
        >
          <div class="item-file-item-icon">
            <img :src="item_file.icon" alt="" />  <!-- //@/assets/images/img_16.png -->
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
          @click.stop="showImg(item.pictures)"
        >
				<!-- @click.stop="showImg(item_pic.abs_url)" -->
          <el-image
            style="width: 100%; height: 100%"
            :src="item_pic.abs_url"
            fit="cover" 
						:preview-src-list="imagelist"
          ></el-image>
        </div>
      </div>
      <!-- 查看更多 -->
      <!-- <div class="item-more" v-show="LineHeightFunc">
        <p class="hands">查看更多<i class="el-icon-d-arrow-right"></i></p>
      </div> -->
      <!-- 点赞人数 评论 -->
      <div class="item-else" style="margin-top: 20px">
        <StarItemElse
          :like="type == 3 ? item.answers.like : item.like"
          :layer="type == 3 ? item.answers.layer : item.layer"
          :is_like="type == 3 ? item.answers.is_like : item.is_like"
          :is_collect="type == 3 ? item.answers.is_collect : item.is_collect"
          @bindLike="bindLike"
          @bindCollect="bindCollect"
        ></StarItemElse>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/components/User.vue"
import StarItemElse from "@/components/StarItemElse.vue"
import textShow from "@/components/textShow.vue"
export default {
  data() {
    return {
      type: this.status,
			imagelist:[]
    }
  },
  components: {
    User,
    StarItemElse,
    textShow
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: [String, Number]
    },
    // 当前 加入星球列表 选中的 哪个导航 status 0全部主题 1星主分享 2热门主题 3问题主题
    status: {
      type: [Number, String]
    }
  },
  asyncComputed: {
    // async LineHeightFunc() {
    //   let that = this
    //   return await new Promise((resolve, reject) => {
    //     that.$nextTick(() => {
    //       resolve(Number(`${that.$refs['lineHeight' + that.index].offsetHeight}`) > 100)
    //     })
    //   })
    // }
  },
  watch: {
    // 监听 加入的星球 选中的导航
    status: {
      handler(newValue, oldValue) {
        this.type = newValue
      }
    }
  },
	mounted(){
		
	},
	filters:{
		gaishuju(value){ //处理数据
			var findArray=value.match(/#.+?#/)
			if(null==findArray||0==findArray.length)return value
			var result=value.substr(0,findArray.index) +"<a style='color:#fbaa00' href='/index?name="+value.substr(findArray.index,findArray[0].length)+"'>" +value.substr(findArray.index,findArray[0].length)+"</a>"
			if(value.length>findArray.index+findArray[0].length){
				result=result+this.gaishuju(value.substr(findArray.index+findArray[0].length))
				console.log(result)
			}
			return result
		}
	},
  methods: {
		gaishuju(value){ //处理数据
			var findArray=value.match(/#.+?#/)
			if(null==findArray||0==findArray.length)return value
			var result=value.substr(0,findArray.index) +"<a style='color:#fbaa00'  href='/index?name="+value.substr(findArray.index,findArray[0].length)+"'>" +value.substr(findArray.index,findArray[0].length)+"</a>"
			if(value.length>findArray.index+findArray[0].length){
				result=result+this.gaishuju(value.substr(findArray.index+findArray[0].length))
				console.log(result)
			}
			return result
		},
    // 预览图片
    showImg(url) {
			console.log(url)
			// url.map(item=>{
			// 	this.imagelist.push(item.abs_url)
			// })
      // window.open(
      //   url,
      //   "_blank"
      // )
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
    // 收藏
    bindCollect() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        answers_id: this.type == 3 ? this.item.questions_id : this.item.answers_id,
        type: this.type == 3 ? this.item.answers.type : this.item.type
      }
      this.$api.api.Collect(data).then((res) => {
        this.$Message({
          message: res.data.message,
          type: 'success'
        })
        // status 2 加入的星球(全部主题)/加入的星球(星主分享)/加入的星球(热门主题) 3 加入的星球(问题主题)
        if (this.status == 3) {
          // 问答
          if (this.item.answers.is_collect == 1) {
            this.item.answers.is_collect = 2
          } else {
            this.item.answers.is_collect = 1
          }
        } else {
          // 主题
          if (this.item.is_collect == 1) {
            this.item.is_collect = 2
          } else {
            this.item.is_collect = 1
          }
        }
      })
    },
    // 点赞
    bindLike() {
      if (this.type == 3) {
        // 问答
        let data = {
          member_id: localStorage.getItem('member_id'),
          rele_id: this.item.questions_id,
          type: 2
        }
        this.$api.api.Like(data).then((res) => {
          this.$Message({
            message: res.data.message,
            type: 'success'
          })
          if (this.item.answers.is_like == 1) {
            this.item.answers.is_like = 2
            this.item.answers.like -= 1
          } else {
            this.item.answers.is_like = 1
            this.item.answers.like = Number(this.item.answers.like) + 1
          }
        })
      } else {
        // 主题
        let data = {
          member_id: localStorage.getItem('member_id'),
          rele_id: this.item.answers_id,
          type: 3
        }
        this.$api.api.Like(data).then((res) => {
          this.$Message({
            message: res.data.message,
            type: 'success'
          })
          if (this.item.is_like == 1) {
            this.item.is_like = 2
            this.item.like -= 1
          } else {
            this.item.is_like = 1
            this.item.like = Number(this.item.like) + 1
          }
        })
      }
    },
    // 跳转 主题详情
    toDetail(e) {
			if(e.target.localName=="asdasd"){
				this.$router.push({
				  path: '/huati',
				  query: {
						name:e.target.innerHTML
				  }
				})
			}
			else{
				this.$router.push({
				  path: '/indexdetailreplydetail',
				  query: {
				    ids: this.type == 3 ? this.item.questions_id : this.item.answers_id,
				    type: this.type == 3 ? this.item.answers.pc_type : this.item.pc_type
				  }
				})
			}
    },
    // 处理 星球主题 问答
    handelCommand(command) {
      this.$emit('starHandel', this.index,this.type, this.type == 3 ? this.item.questions_id : this.item.answers_id, command)
    },
		
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 25px 40px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  &-user {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-more {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    > p {
      font-size: 20px;
      color: #fbaa00;
      font-weight: 400;
    }
  }
  &-all {
    width: 100%;
    > h2 {
      width: 100%;
      margin-top: 15px;
      text-align: justify;
      font-size: 20px;
      color: #333;
      font-weight: 600;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
      margin-bottom: 0;
    }
    > p {
      // width: 100%;
      // margin-top: 10px;
      margin-bottom: 0;
      // line-height: 35px;
      // margin-top: 10px;
      // text-align: justify;
      // font-size: 20px;
      // color: #666;
      // font-weight: 400;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 3;
      // overflow: hidden;
      // word-break: break-all;
    }
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
        width: 94%;
        // margin-top: 10px;
        // margin-bottom: 0;
        text-align: justify;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        font-size: 20px;
        color: #333;
        font-weight: 600;
        word-break: break-all;
        margin-bottom: 0;
      }
    }
    > p {
      // width: 100%;
      // margin-top: 10px;
      margin-bottom: 0;
      // line-height: 35px;
      // margin-top: 10px;
      // text-align: justify;
      // font-size: 20px;
      // color: #666;
      // font-weight: 400;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 3;
      // overflow: hidden;
      // word-break: break-all;
      // margin-bottom: 0;
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
        > img {
          width: 100%;
          height: 100%;
        }
      }
      > p {
        width: 96%;
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
        width: 96%;
        margin-top: -15px;
        // width: 100%;
        // margin-top: 10px;
        margin-bottom: 0;
        // font-size: 20px;
        // color: #333;
        // font-weight: 400;
        // text-align: justify;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 3;
        // overflow: hidden;
        // margin-bottom: 0;
      }
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
      padding: 15px;
			padding-left: 0;
      // background: #f6f4f4;
      // border: 2px solid #f6f4f4;
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
					border-radius: 6px;
        }
      }
      > h2 {
        max-width: 200px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
        text-align: left;
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
  &-else {
    width: 100%;
  }
}
</style>