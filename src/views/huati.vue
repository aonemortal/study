<template>
	<div class="container marginTop index indexNav">
	  <HeaderNav @search="bindSearch" :keyword="keyword" />
	  <div class="index-content">
			 <div class="left">
				<div class="left-xinqiu">{{xingqiu}}</div>
				<div class="left-title">{{biaoqianname}}</div>
			 </div>
	    <!-- 列表 -->
			<div class="center">
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
		</div>
	</div>
</template>

<script>
	import loadMore from '@/assets/js/loadMore.js'
	import StarItem from '@/components/StarItem.vue'
	import HeaderNav from "@/components/HeaderNav.vue"
export default {
  data() {
    return {
			keyword: '',//标签关键词
			join_nav_default: '0',//加入的星球 列表导航 默认选中
			star_id: '',//加入的星球 选中的星球
			starList:[],
			biaoqianname:"",
			xingqiu:"",
			biaoqian:"",
			starPage:0, 
		};
  },
	computed:{
		
	},
	created() {
		// 监听 vuex 里 选中的 菜单
	},
  components: {
		StarItem,
		HeaderNav
	},
  mounted() {
		this.biaoqianname= this.$route.query.name
		this.star_id=localStorage.getItem("starid")
		this.getshuju()
		console.log(location.href.indexOf(this.biaoqianname))
	},
	activated() {
		document.body.scrollTop=0
		this.biaoqianname= this.$route.query.name
		this.star_id=localStorage.getItem("starid")
		this.getshuju()
	},
	deactivated() {

	},
  watch: {
		xingqiu:{
			handler(newValue, oldValue) {
				console.log(newValue,"新value")
			  this.xingqiu=newValue
			}
		},
		star_id:{
			handler(newValue, oldValue) {
				
			}
		}
	},
  methods: {
		getshuju(){
			document.body.scrollTo(0,0)
			let data = {
			  member_id: localStorage.getItem('member_id') || '',
			  star_id: this.star_id || '',
			  tag: this.biaoqianname
			}
			this.$api.api.Getlabelcontent(data).then((res) => {
				console.log(res.data.data.list)
			  if (res.data.data.list.length != 0) {
			    this.starPage = 1
			    loadMore.start(this.getStarListMore)
			    this.starList = res.data.data.list
					this.xingqiu=res.data.data.name
					console.log(res.data.data.name)
					this.biaoqian=res.data.data.title
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
		},
		gaishuju(value){ //处理数据
			var findArray=value.match(/#.+?#/)
			if(null==findArray||0==findArray.length)return value  // color:#fbaa00
			var result=value.substr(0,findArray.index) +"<div style=''>" +value.substr(findArray.index,findArray[0].length)+"</div>"
			if(value.length>findArray.index+findArray[0].length){
				result=result+this.gaishuju(value.substr(findArray.index+findArray[0].length))
			}
			return result
		},
		//搜索 百科/星球主题/星球问答
		bindSearch(keyword) {
		  if (keyword) {
		    this.keyword = keyword
				let menu_status="encyc"
		    switch (menu_status) {
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
						console.log(1111)
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
		starHandel(index, ids, command) {
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
		    }
		  }
		},
	}
};
</script>

<style lang="scss" scoped>
	.allread{
	  margin-bottom: 10px;
	  text-align: right;
	  color: #000;
	  font-size: 18px;
	}
	.center {
		width: 730px;
		min-width: 730px;
		display: flex;
		// justify-content: space-between;
		padding: 30px 0;
		// > div {
		// 	width: 100%;
		// }
		&-nav {
			margin-top: 20px;
		}
		&-list {
			margin-top: 4px;
			width:730px;
		}
	}
	.index {
	  width: 100%;
	  &-content {
	    width: 1050px;
	    margin: 0 auto;
	    display: flex;
	    // align-items: flex-start;
	    justify-content: space-between;
	  }
	}
	.left {
	  width: 300px;
	  display: flex;
	  flex-direction: column;
	  // align-items: flex-start;stretch
		align-items: stretch;
		margin-top: 50px;
		text-align: right;
		margin-right: 80px;
		.left-xinqiu{
			font-size: 18px;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
			margin-bottom: 20px;
		}
		.left-title{
			font-size: 18px;
			font-family: PingFang SC;
			font-weight: 600;
			color: #FBAA00;
		}
	}
	
	.right {
	  width: 16.67%;
	}
	.center-nav {
	  margin-top: 20px;
	}
	.center-list {
	  margin-top: 4px;
	}
</style>
