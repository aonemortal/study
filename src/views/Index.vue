<template>
  <div class="container marginTop index indexNav">
    <HeaderNav @search="bindSearch" :keyword="keyword" />
    
    <div class="index-content">
      <!-- <el-col :span="8"> -->
      <div class="left">
        <IndexMenu
          @menuChange="menuChange"
          :menu_status="menu_status"
          ref="indexmenu"
        />
      </div>
      <!-- </el-col>
    <el-col :span="12"> -->
      <!-- 百科 -->
      <div class="center" v-show="menu_status == 'encyc'">
        <!-- 编辑 -->
        <div class="center-edit">
          <IndexEdit
            placeholder="点击进行提问..."
            status="1"
            :centerDialogVisible="centerDialogVisible"
            @changeEditPopupState="changeIndexEdit"
          />
          <!-- 编辑弹窗 -->
          <IndexEditPopup
            :centerDialogVisible="centerDialogVisible"
            :is_official="is_official"
            @popupStatus="changeIndexEditPopup"
            status="1"
						:title="title"
						:content="content"
          />
        </div>
        <!-- 导航 -->
        <div class="center-nav">
          <!-- <IndexListNav
          :list_nav="encyc_nav"
          :default="encyc_nav_default"
          @NavIndex="ChangeSortBy"
          status="1"
        /> -->
          <el-tabs v-model="encyc_nav_default" @tab-click="handleClickEncyc">
            <el-tab-pane
              :label="item.name"
              :name="item.type"
              v-for="(item, index) in encyc_nav"
              :key="item + index"
              >{{ item.name }}</el-tab-pane
            >
          </el-tabs>
        </div>
        <!-- 列表 -->
        <div class="center-list">
          <IndexListItem
            v-for="(item, index) in encyclopedias_list"
            :key="item + index"
            :index="index"
            :item="item"
            @encylHandel="encylHandel"
          />
        </div>
      </div>
      
      <!-- 加入的星球 -->
      <div class="center" v-show="menu_status == 'join'">
        <!-- 编辑 -->
        <div class="center-edit">
          <IndexEdit
            placeholder="点击发表主题..."
            status="3"
            :ids="star_id"
            :centerDialogVisible="join_centerDialogVisible"
            @changeEditPopupState="changeIndexEdit"
          />
          <!-- 编辑弹窗 -->
          <IndexEditPopup
            :centerDialogVisible="join_centerDialogVisible"
            :star_id="star_id"
            @popupStatus="changeIndexEditPopup"
            status="3"
          />
        </div>
        <!-- 导航 -->
        <div class="center-nav">
          <el-tabs v-model="join_nav_default" @tab-click="handleClickJoin">
            <el-tab-pane
              :label="item.name"
              :name="item.type"
              v-for="(item, index) in join_nav"
              :key="item + index"
              >{{ item.name }}</el-tab-pane
            >
          </el-tabs>
        </div>
        <!-- 列表 -->
        <div class="center-list">
          <StarItem
            v-for="(item, index) in starList"
            :key="item + index"
            :index="index"
            :item="item"
            :status="join_nav_default"
            @starHandel="starHandel"
          ></StarItem>
        </div>
      </div>
      <!-- 我的收藏 -->
      <div
        class="center"
        v-show="menu_status == 'collect' && collect_list.length != 0"
      >
        <IndexDetailReply
          v-for="(item, index) in collect_list"
          :key="item + index"
          :index="index"
          :item="item"
          :type="2"
        />
      </div>
      <!-- 与我相关 -->
      <div class="center" v-show="menu_status == 'about'">
        <div class="allread" @click="allread">全部已读</div>
        <AboutMe
          v-for="(item, index) in messageList"
          :key="item + index"
          :item="item"
          :index="index"
          @aboutDetail="bindAboutDetail"
        />
      </div>
      <!-- 草稿箱 -->
      <div class="center" v-show="menu_status == 'drawing'">
        <Drafts
          v-for="(item, index) in drawingList"
          :key="item + index"
          :item="item"
          :index="index"
          @delDrawing="delDrawing"
        />
      </div>
      <!-- </el-col>
    <el-col :span="4"> -->
      <!-- <div class="right"></div> -->
      <!-- </el-col> -->
    </div>
  </div>
</template>

<script>
import IndexMenu from "@/components/IndexMenu.vue"
import IndexEdit from "@/components/IndexEdit.vue"
import IndexEditPopup from "@/components/IndexEditPopup.vue"
import IndexListItem from "@/components/IndexListItem.vue"
import AboutMe from "@/components/AboutMe.vue"
import Drafts from "@/components/Drafts.vue"
import IndexDetailReply from "@/components/IndexDetailReply.vue"
import loadMore from '@/assets/js/loadMore.js'
import StarItem from '@/components/StarItem.vue'
import HeaderNav from "@/components/HeaderNav.vue"
export default {
  name: 'index',
  data() {
    return {
      // placeholderVal:'搜索百科或内容',//头部 搜索框 提示语
      keyword: '',//搜索关键词
      encyclopedias_list: [], //列表
      encyc_nav: [
        {
          name: "热榜",
          type: "hot",
        },
        {
          name: "百科",
          type: "section",
        },
        {
          name: "最新",
          type: "news",
        }
      ], //百科 列表导航
      encyc_nav_default: 'hot',//百科 列表导航 默认选中
      is_official: '0',//百科 列表导航 选中的导航下标
      join_nav: [
        {
          name: "全部主题",
          type: "0",
        },
        {
          name: "星主分享",
          type: "1",
        },
        {
          name: "问题问答",
          type: "3",
        },
        {
          name: "热门主题",
          type: "2",
        },
      ], //加入的星球 列表导航
      join_nav_default: '0',//加入的星球 列表导航 默认选中
      star_id: '',//加入的星球 选中的星球
      menu_status: 'encyc', //menu选中的导航
      encycPage: 1,//百科列表分页
      centerDialogVisible: false, //百科 编辑弹窗 是否出现
      join_centerDialogVisible: false,//加入到星球 编辑弹窗 是否出现
      messagePage: 1,//与我相关消息 分页
      messageList: [],//与我相关消息列表
      collect_list: [], //收藏列表
      collectPage: 1,//收藏列表分页
      drawingList: [],//草稿箱列表
      drawingPage: 1,//草稿箱列表分页
      starList: [],//加入的星球 主题列表
      starPage: 1,//加入的星球 主题列表 分页
      menu: [
        {
          menu_id: "encyc",
          name: "百科",
          star_id: '-1',
          children: [],
        },
        {
          menu_id: "join",
          name: "加入的星球",
          star_id: '-1',
          children: [],
        },
        {
          menu_id: "collect",
          name: "我的收藏",
          star_id: '-1',
          children: [],
        },
        {
          menu_id: "about",
          name: "与我相关消息",
          star_id: '-1',
          children: [],
        },
        {
          menu_id: "drawing",
          name: "草稿箱",
          star_id: '-1',
          children: [],
        },
      ],
			title:"",
			content:"",
			imagelist:[]
    };
  },
  computed: {
    vuexMenuStatus() {
      return this.$store.state.menu_status
    }
  },
  watch: {
    // 监听 vuex 里 选中的 菜单
    vuexMenuStatus: {
      handler(newValue, oldValue) {
        this.menu_status = newValue
        if (newValue === 'collect' || newValue === 'about') {
          this.menuChange(this.menu_status)
        }
      }
    }
  },
  components: {
    IndexMenu,
    IndexEdit,
    IndexListItem,
    AboutMe,
    Drafts,
    IndexDetailReply,
    IndexEditPopup,
    StarItem,
    HeaderNav
  },
  mounted() {
    // 获取 百科列表
    this.getEncyclopediasList(this.is_official, this.keyword)
    // 获得 加入的星球
    this.getMyStar()
		if (location.href.indexOf("#reloaded") == -1) {
      location.href = location.href + "#reloaded";
			location.reload();
	  }
  },
  activated() {
    // 启动 回到顶部 滚动监听
    window.addEventListener('scroll', this.scrollToTop)
    // 启动 触底加载 百科列表
    loadMore.start(this.getEncyclopediasListMore)
  },
  deactivated() {
    // 卸载 滚动监听 触底加载
    loadMore.uninstall()
    // 卸载 回到顶部 滚动监听
    window.removeEventListener('scroll', this.scrollToTop);
  },
  methods: {
    //全部已读
    allread(){
       let data = {
        member_id: localStorage.getItem('member_id') || ''
      }
      this.$api.api.allread(data).then((res) => {
       
        this.$router.go(0);
      })
    },
    // 与我相关消息 进入对应的消息详情
    bindAboutDetail(target_rule, rele_id, index, msg_id) {
      // 2私信 3问答详情 4星主问答回答 5主题详情 6说说详情 7系统消息详情
      let data = {
        msg_id: msg_id
      }
      this.$api.api.SetRead(data).then((res) => {
        switch (Number(target_rule)) {
          case 3:
            this.$router.push({
              path: '/indexdetailreplydetail',
              query: {
                ids: rele_id,
                type: 3
              }
            })
            break;
          case 5:
            this.$router.push({
              path: '/indexdetailreplydetail',
              query: {
                ids: rele_id,
                type: 2
              }
            })
            break;
          case 6:
            this.$router.push({
              path: '/indexdetailreplydetail',
              query: {
                ids: rele_id,
                type: 1
              }
            })
            break;
        }
        if(this.messageList[index].status!=1){
          // 改变 消息 未读 数
          this.$store.commit('changeMessageCount',this.$store.state.messageCount-1)
          // 前端临时设置消息已读
          this.$set(this.messageList[index], 'status', 1)
        }
      })

    },
    // 搜索 百科/星球主题/星球问答
    bindSearch(keyword) {
      if (keyword) {
        this.keyword = keyword
        switch (this.menu_status) {
          case 'encyc':
            // 百科

            // this.getEncyclopediasList(this.is_official, keyword)

            let data = {
              is_official: this.is_official,
              p: 1,
              keyword: keyword || ''
            }
            this.$api.api.EncycList(data).then((res) => {
              if (res.data.data.list.length != 0) {
                this.encycPage = 1
                loadMore.start(this.getEncyclopediasListMore)
                this.encyclopedias_list = res.data.data.list
              } else {
                this.$Message({
                  message: '没有搜索结果',
                  type: 'success',
                  duration: 1500
                })
              }
            })
            break;
          case 'join':
            // 星球
            // this.getStarList()

            // 0 全部 1星主分享 2热门主题 3问题主题
            if (this.join_nav_default == 3) {
              // 问题主题
              let data = {
                member_id: localStorage.getItem('member_id') || '',
                star_id: this.star_id || '',
                p: 1,
                keyword: this.keyword
              }
              this.$api.api.QuestionsList(data).then((res) => {
                if (res.data.data.list.length != 0) {
                  this.starPage = 1
                  loadMore.start(this.getStarListMore)
                  this.starList = res.data.data.list
                } else {
                  this.$Message({
                    message: '没有搜索结果',
                    type: 'success',
                    duration: 1500
                  })
                }
              })
            } else {
              // 全部 星主分享 热门主题
              let data = {
                member_id: localStorage.getItem('member_id') || '',
                star_id: this.star_id || '',
                is_share: this.join_nav_default || '',
                p: 1,
                keyword: this.keyword
              }
              this.$api.api.PostsList(data).then((res) => {
                if (res.data.data.list.length != 0) {
                  this.starPage = 1
                  loadMore.start(this.getStarListMore)
                  this.starList = res.data.data.list
									this.starList.map(item=>{
										item.content=this.gaishuju(item.content)
										
									})
                } else {
                  this.$Message({
                    message: '没有搜索结果',
                    type: 'success',
                    duration: 1500
                  })
                }
              })
            }
            break;
          default:
            console.log('只能搜索百科和星球相关内容')
            break;
        }
      } else {
        this.$Message({
          message: '关键词不能为空',
          type: 'warning',
          duration: 1500
        })
      }
    },
    // 获得 加入的星球
    getMyStar() {
	  let id =localStorage.getItem('member_id') || ''
      let data = {
        member_id: id
      }
      this.$api.api.MyStar(data).then((res) => {
        // this.$refs.indexmenu.menu[1].children = res.data.data.list
        this.$set(this.$refs.indexmenu.menu[1], 'children', res.data.data.list)
        console.log(res.data.data.list,"获得 加入的星球")
      })
    },
    // 获得 百科列表
    getEncyclopediasList(is_official, keyword) {
      this.encycPage = 1
      let data = {
        member_id: localStorage.getItem('member_id'),
        is_official: is_official,
        p: this.encycPage,
        keyword: keyword || ''
      }
      this.$api.api.EncycList(data).then((res) => {
        this.encyclopedias_list = res.data.data.list
      })
    },
    // 获取 更多 百科列表
    getEncyclopediasListMore() {
      let data = {
        member_id: localStorage.getItem('member_id'),
        is_official: this.is_official,
        p: this.encycPage + 1,
        keyword: this.keyword || ''
      }
      this.$api.api.EncycList(data).then((res) => {
        if (res.data.data.list.length != 0) {
          this.encyclopedias_list = this.encyclopedias_list.concat(res.data.data.list)
          this.encycPage += 1
        } else {
          loadMore.end()
          this.$Message({
            message: '没有更多了',
            type: 'success'
          })
        }
      })
    },
    // 处理 百科
    encylHandel(index, questions_id, command) {
      switch (command) {
        case 'del':
          // 删除百科
          let data = {
            member_id: localStorage.getItem('member_id'),
            questions_id: questions_id
          }
          this.$api.api.EncyDelete(data).then((res) => {
            this.$Message({
              message: '删除成功',
              type: 'success'
            })
            this.encyclopedias_list.splice(index, 1)
          })
          break;
      }
    },
    // 获取 与我相关消息
    getMessages() {
      this.messagePage = 1
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        p: this.messagePage
      }
      this.$api.api.Messages(data).then((res) => {
        this.messageList = res.data.data.list
      })
    },
    // 获取 更多 与我相关消息
    getMessagesMore() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        p: this.messagePage + 1
      }
      this.$api.api.Messages(data).then((res) => {
        if (res.data.data.list.length != 0) {
          this.messageList = this.messageList.concat(res.data.data.list)
          this.messagePage += 1
        } else {
          loadMore.end()
          this.$Message({
            message: '没有更多了',
            type: 'success'
          })
        }
      })
    },
    // 获取 我的收藏
    getMyCollect() {
      this.collectPage = 1
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        p: this.collectPage
      }
      this.$api.api.MyCollect(data).then((res) => {
        this.collect_list = res.data.data.list
      })
    },
    // 获取 更多 我的收藏
    getMyCollectMore() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        p: this.collectPage + 1
      }
      this.$api.api.MyCollect(data).then((res) => {
        if (res.data.data.list.length != 0) {
          this.collect_list = this.collect_list.concat(res.data.data.list)
          this.collectPage += 1
        } else {
          loadMore.end()
          this.$Message({
            message: '没有更多了',
            type: 'success'
          })
        }
      })
    },
    // 获取 草稿箱
    getDrawingList() {
      this.drawingPage = 1
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        p: this.drawingPage
      }
      this.$api.api.DrawingList(data).then((res) => {
        this.drawingList = res.data.data.list
      })
    },
    // 获取 更多 草稿箱
    getDrawingListMore() {
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        p: this.drawingPage + 1
      }
      this.$api.api.DrawingList(data).then((res) => {
        if (res.data.data.list.length != 0) {
          this.drawingList = this.drawingList.concat(res.data.data.list)
          this.drawingPage += 1
        } else {
          loadMore.end()
          this.$Message({
            message: '没有更多了',
            type: 'success'
          })
        }
      })
    },
    // 删除 草稿
    delDrawing(draft_id, index) {
      // console.log(draft_id, index)
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        draft_id: draft_id
      }
      this.$api.api.DeleteDrawing(data).then((res) => {
        this.$Message({
          message: res.data.message,
          type: 'success'
        })
        this.drawingList.splice(index, 1)
      })
    },
    // 获取 加入的星球 主题列表
    getStarList() {
      // join_nav_default 0 全部 1星主分享 2热门主题 3问题主题
      this.starPage = 1
      if (this.join_nav_default == 3) {
        // 问题主题
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          star_id: this.star_id || '',
          p: this.starPage,
          keyword: this.keyword
        }
        this.$api.api.QuestionsList(data).then((res) => {
          this.starList = res.data.data.list
        })
      } else {
        // 全部 星主分享 热门主题
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          star_id: this.star_id || '',
          is_share: this.join_nav_default || '',
          p: this.starPage,
          keyword: this.keyword
        }
        this.$api.api.PostsList(data).then((res) => {
          this.starList = res.data.data.list
					this.starList.map(item=>{
						item.content=this.gaishuju(item.content)
					})
        })
      }
    },
    // 获得 更多 加入的星球 主题列表
    getStarListMore() {
      if (this.join_nav_default == 3) {
        // 问题主题
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          star_id: this.star_id || '',
          p: this.starPage + 1,
          keyword: this.keyword
        }
        this.$api.api.QuestionsList(data).then((res) => {
          if (res.data.data.list.length != 0) {
            this.starList = this.starList.concat(res.data.data.list)
						this.starList.map(item=>{
							item.content=this.gaishuju(item.content)
							console.log(1111)
						})
            this.starPage += 1
          } else {
            loadMore.end()
            this.$Message({
              message: '没有更多了',
              type: 'success'
            })
          }
        })
      } else {
        // 全部 星主分享 热门主题
        let data = {
          member_id: localStorage.getItem('member_id') || '',
          star_id: this.star_id || '',
          is_share: this.join_nav_default || '',
          p: this.starPage + 1,
          keyword: this.keyword
        }
        this.$api.api.PostsList(data).then((res) => {
          if (res.data.data.list.length != 0) {
            this.starList = this.starList.concat(res.data.data.list)
						this.starList.map(item=>{
							item.content=this.gaishuju(item.content)
						})
            this.starPage += 1
          } else {
            loadMore.end()
            this.$Message({
              message: '没有更多了',
              type: 'success'
            })
          }
        })
      }
    },
    // 处理 星球 列表
    starHandel(index,status,ids, command) {
      // join_nav_default 0 全部 1星主分享 2热门主题 3问题主题
      if (this.join_nav_default == 3) {
        switch (command) {
          case 'del':
            // 删除 问答
            let data = {
              member_id: localStorage.getItem('member_id'),
              questions_id: ids
            }
            this.$api.api.QuestionsDelete(data).then((res) => {
              this.$Message({
                message: '删除成功',
                type: 'success'
              })
              this.starList.splice(index, 1)
            })
            break;
					case 'update':
						// 编辑 问答
						let dataa = {
							member_id: localStorage.getItem('member_id'),
							answers_id: ids
						}
						console.log(dataa,"data1111")
						this.$api.api.PostsDetail(dataa).then((res) => {
						  console.log(res)
						})
						break;
        }
      } else {
        switch (command) {
          case 'del':
            // 删除主题
            let data = {
              member_id: localStorage.getItem('member_id'),
              answers_id: ids
            }
            this.$api.api.PostsDelete(data).then((res) => {
              this.$Message({
                message: '删除成功',
                type: 'success'
              })
              this.starList.splice(index, 1)
            })
            break;
					case 'update':
					  // 编辑主题
					  let dataa = {
					    member_id: localStorage.getItem('member_id'),
					    answers_id: ids
					  }
					  this.$api.api.PostsDetail(dataa).then((res) => {
					    console.log(res)
							if(res.data.data.text_type==1){
								this.join_centerDialogVisible = true
								this.content=res.data.data.content
								this.title=res.data.data.subject
								this.imagelist=res.data.data.pictures
							}
							else{
								console.log(2222)
								console.log(status)
								this.$router.push({
								  path: '/editor', query: {
								    type: status,
								    ids: this.ids,
										title:res.data.data.subjec,
										content:res.data.data.content,
								    mode: 'add'
								  }
								})
							}
					  })
					  break;
        }
      }
    },
    // menu 组件 切换导航
    menuChange(e, menuTwoId) {
      // e => menu 选中的导航
      // menuTwoId => menu 选中的导航内的二级导航id
      // 导航切换 卸载其他导航的上拉加载 启动当前导航的上拉加载
      this.keyword = ''//切换菜单 清空搜索关键词
      switch (e) {
        case 'encyc':
          // 滚动条回到顶部
          this.backTop()
          // 选中的 menu 导航
          this.menu_status = e
          this.$store.commit('changeMenu', e)
          loadMore.uninstall()
          this.getEncyclopediasList(this.is_official, this.keyword)
          loadMore.start(this.getEncyclopediasListMore)
          break;
        case 'join':
          // console.log(menuTwoId, 'menuTwoId')
          if (menuTwoId != '-1') {
            // menuTwoId != -1 说明点击了 二级菜单
            // 滚动条回到顶部
            this.backTop()
            // 选中的 menu 导航
            this.menu_status = e
            this.$store.commit('changeMenu', e)
            loadMore.uninstall()
            this.star_id = menuTwoId
						localStorage.setItem("starid",menuTwoId)
            this.getStarList()
            loadMore.start(this.getStarListMore)
          }
          break;
        case 'collect':
          // 选中的 menu 导航
          // 滚动条回到顶部
          this.backTop()
          this.menu_status = e
          this.$store.commit('changeMenu', e)
          loadMore.uninstall()
          this.getMyCollect()
          loadMore.start(this.getMyCollectMore)
          break;
        case 'about':
          // 选中的 menu 导航
          // 滚动条回到顶部
          this.backTop()
          this.menu_status = e
          this.$store.commit('changeMenu', e)
          loadMore.uninstall()
          this.getMessages()
          loadMore.start(this.getMessagesMore)
          break;
        case 'drawing':
          // 选中的 menu 导航
          // 滚动条回到顶部
          this.backTop()
          this.menu_status = e
          this.$store.commit('changeMenu', e)
          loadMore.uninstall()
          this.getDrawingList()
          loadMore.start(this.getDrawingListMore)
          break;
      }
    },
    // IndexEdit 组件 改变 编辑弹窗出现/隐藏
    changeIndexEdit(showIFhide, status) {
      // status 1 百科 3加入的星球
      if (status == 1) {
        this.centerDialogVisible = showIFhide
      } else if (status == 3) {
        this.join_centerDialogVisible = showIFhide
      }
    },
    // IndexEditPopup 组件 编辑弹窗改变 他自身 出现/隐藏
    changeIndexEditPopup(showIFhide, status) {
      // status 1 百科 3加入的星球
      if (status == 1) {
        this.centerDialogVisible = showIFhide
      } else if (status == 3) {
        this.join_centerDialogVisible = showIFhide
      }
    },
    // 百科列表 导航 切换
    handleClickEncyc(e) {
      this.keyword = ''// 清空搜索关键词
      // console.log(e,'百科列表 导航切换')
      this.is_official = e.index
      this.encyc_nav_default = this.encyc_nav[e.index].type
      this.encycPage = 1
      // 分页每次归1，再次启动上拉加载
      loadMore.again()
      this.getEncyclopediasList(this.is_official, this.keyword)
    },
    // 加入的星球 列表导航 切换
    handleClickJoin(e) {
      this.keyword = ''// 清空搜索关键词
      // console.log(e,'加入的星球 导航切换')
      this.join_nav_default = this.join_nav[e.index].type
      // 分页每次归1，再次启动上拉加载
      loadMore.again()
      this.getStarList(this.join_nav_default, this.star_id)
    },
    //返回顶部
    backTop() {
      let timer = setInterval(function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        var speed = top / 4;
        if (document.body.scrollTop != 0) {
          document.body.scrollTop -= speed;
        } else {
          document.documentElement.scrollTop -= speed;
        }
        if (top == 0) {
          clearInterval(timer);
        }
      }, 30);
    },
		gaishuju(value){ //处理数据
			var findArray=value.match(/#.+?#/)
			if(null==findArray||0==findArray.length)return value          //router-link to='{name:'huati',params:{name:'"+value.substr(findArray.index,findArray[0].length)+"'}'  router-link
			var result=value.substr(0,findArray.index) +"<asdasd style='color:#fbaa00;'>" +value.substr(findArray.index,findArray[0].length)+"</asdasd>"
			if(value.length>findArray.index+findArray[0].length){
				result=result+this.gaishuju(value.substr(findArray.index+findArray[0].length))
			}
			return result
		},
		sadf(){
			console.log(111111)
		}
  },
};
</script>

<style lang="scss">
.allread{
  margin-bottom: 10px;
  text-align: right;
  color: #000;
  font-size: 18px;
	cursor: pointer;
}
.allread:hover{
  margin-bottom: 10px;
  text-align: right;
  color: #FBAA00;
  font-size: 18px;
	cursor: pointer;
}
.index {
  width: 100%;

  &-content {
    width: 1050px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}
.left {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 80px;
}
.center {
  width: 730px;
  min-width: 730px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px 0;
  > div {
    width: 100%;
  }
  &-nav {
    margin-top: 20px;
  }
  &-list {
    margin-top: 4px;
  }
}
.right {
  width: 16.67%;
}
</style>
