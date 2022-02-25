<template>
	<div class="container marginTop indexNav">


		<div class="box">
			<!-- <div class="left"> -->
			<!-- <IndexMenu /> -->
			<!-- </div> -->
			<div class="center">
				<!-- 帖子 -->
				<div class="post">
					<!-- 标签 -->
					<div class="post-tips">HOT</div>
					<!-- 背景 -->
					<div class="post-bg">
						<img src="@/assets/images/img_10.png" alt="" />
					</div>
					<!-- 标题 -->
					<h2>{{ details.subject }}</h2>
					<div class="post-text">
						<div class="post-text-val" :class="details.more ? 'post-text-all' : ''" ref="lineHeight" v-html="details.content"></div>
						<div class="post-text-more hands" @click.stop="details.more = !details.more" v-if="postValMore">
							{{ details.more ? "收起" : "查看更多" }}<i class="el-icon-d-arrow-right"></i>
						</div>
					</div>
					<!-- 文件列表 -->
					<div class="post-file post-scroll" v-if="details.file_type == 3 && details.pictures.length != 0">
						<div class="post-file-item hands blockfile" v-for="(item, index) in details.pictures" :key="item + index" @click="showFile(item.abs_url, item.ext)">
							<div class="post-file-item-icon">
								<!-- <img v-if="item.ext=='doc'||item.ext=='docx'" src="@/assets/images/word.png" alt="" />
                <img v-if="item.ext=='pdf'" src="@/assets/images/pdf.png" alt="" />
                <img  v-if="item.ext=='xlsx'" src="@/assets/images/exl.png" alt="" /> -->
								<img :src="item.icon" />
							</div>
							<h2>{{ item.name }}</h2>
						</div>
					</div>
					<!-- 图片列表 -->
					<div class="post-img post-scroll image-scroll" v-if="details.file_type == 1 && details.pictures.length != 0">
						<div class="post-img-item hands" v-for="(item, index) in details.pictures" :key="item + index" @click="showImg()">
							<el-image style="width: 100%; height: 100%" :src="item.abs_url" fit="cover" :preview-src-list="imagelist"></el-image>
						</div>
					</div>
				</div>
				<!-- 编辑 回答 -->
				<div class="edit">
					<IndexEdit placeholder="点击进行回答..." status="2" :ids="this.questions_id" :centerDialogVisible="centerDialogVisible"
					 @changeEditPopupState="changeIndexEdit" />
					<!-- 编辑弹窗 -->
					<IndexEditPopup :centerDialogVisible="centerDialogVisible" @popupStatus="changeIndexEditPopup" status="2"
					 :questions_id="questions_id" />
				</div>
				<!-- 导航 -->
				<div class="nav">
					<el-tabs v-model="sort_by" @tab-click="handleClick">
						<el-tab-pane :label="item.name" :name="item.type" v-for="(item, index) in list_nav" :key="item + index">{{ item.name }}</el-tab-pane>
					</el-tabs>
				</div>
				<!-- 回复列表 -->
				<div class="list">
					<IndexDetailReply v-for="(item, index) in answer_list" :key="item + index" :index="index" :item="item" :type="1"
					 @answerHandel="answerHandel" />
				</div>
			</div>
			<!-- <div class="right"></div> -->
		</div>
	</div>
</template>

<script>
	import IndexMenu from "@/components/IndexMenu.vue"
	import IndexEdit from "@/components/IndexEdit.vue"
	import IndexEditPopup from "@/components/IndexEditPopup.vue"
	import IndexDetailReply from "@/components/IndexDetailReply.vue"
	import loadMore from '@/assets/js/loadMore.js'
	export default {
		name: 'indexDetail',
		data() {
			return {
				list_nav: [{
						name: "最新",
						type: "new",
					},
					{
						name: "热门",
						type: "view",
					},
				], //列表导航
				sort_by: 'new', //列表导航 默认选中
				questions_id: '', //百科id
				details: '', //帖子详情
				page: 1, //分页
				centerDialogVisible: false, //编辑弹窗 是否出现
				answer_list: [], //说说列表
				postValMore: false, //帖子 内容展示
				imagelist:[] ,  //预览的图片list
			};
		},
		components: {
			IndexMenu,
			IndexEdit,
			IndexEditPopup,
			IndexDetailReply,
		},
		asyncComputed: {
			async LineHeightFunc() {
				let that = this
				return await new Promise((resolve, reject) => {
					that.$nextTick(() => {
						console.log(that.$refs.lineHeight.offsetHeight)
						resolve(Number(that.$refs.lineHeight.offsetHeight) > 100)
					})
				})
			}
		},
		watch: {
			details: {
				handler(newValue, oldValue) {
					this.$nextTick(() => {
						if (Number(this.$refs.lineHeight.offsetHeight) > 90) {
							this.postValMore = true
						} else {
							this.postValMore = false
						}
					})
				}
			}
		},
		created() {
			// 获取百科详情
			this.questions_id = this.$route.query.questions_id
			let data = {
				questions_id: this.questions_id
			}
			this.$api.api.EncycDetail(data).then((res) => {
				this.details = res.data.data
				this.details.pictures.map(item=>{
					this.imagelist.push(item.abs_url)
				})
				
			})
			// 获取说说列表
			this.getAnswerList(this.questions_id, this.sort_by)
			// 启动 触底加载 百科列表
			loadMore.start(this.getAnswerListMore)
		},
		beforeRouteEnter(to, from, next) {
			if (from.name === "Index") {
				to.meta.requireAuth = false
			} else {
				to.meta.requireAuth = true
			}
			next()
		},
		activated() {
			if (!this.$route.meta.requireAuth) {
				// 获取百科详情
				this.questions_id = this.$route.query.questions_id
				let data = {
					questions_id: this.questions_id
				}
				this.$api.api.EncycDetail(data).then((res) => {
					this.details = res.data.data
					this.details.pictures.map(item=>{
						this.imagelist.push(item.abs_url)
					})
				})
				// 获取说说列表
				this.getAnswerList(this.questions_id, this.sort_by)
				// 启动 触底加载 百科列表
				loadMore.start(this.getAnswerListMore)
			}
		},
		deactivated() {
			// 卸载 滚动监听 触底加载 百科列表
			loadMore.uninstall()
		},
		methods: {
			// 处理 说说
			answerHandel(index, answers_id, command) {
				switch (command) {
					case 'del':
						// 删除说说
						let data = {
							member_id: localStorage.getItem('member_id'),
							answers_id: answers_id
						}
						this.$api.api.AnswersDelete(data).then((res) => {
							this.$Message({
								message: '删除成功',
								type: 'success'
							})
							this.answer_list.splice(index, 1)
						})
						break;
				}
			},
			// 预览图片
			showImg(url) {
				// url.map(item=>{
				// 	this.imagelist.push(item.abs_url)
				// })
				// window.open(
				// 	url,
				// 	"_blank"
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
			// IndexEdit 组件 改变 编辑弹窗出现/隐藏
			changeIndexEdit(status) {
				this.centerDialogVisible = status
			},
			// IndexEditPopup 组件 编辑弹窗改变 他自身 出现/隐藏
			changeIndexEditPopup(status) {
				this.centerDialogVisible = status
			},
			// 列表导航 切换导航
			handleClick(e) {
				this.sort_by = this.list_nav[e.index].type
				this.getAnswerList(this.questions_id, this.sort_by)
			},
			// 获得说说列表
			getAnswerList(questions_id, sort_by) {
				// 调这个方法 说明需要更新说说列表
				this.page = 1
				// 分页每次归1，再次启动上拉加载
				loadMore.again()
				let data = {
					questions_id: questions_id || this.questions_id,
					p: this.page,
					member_id: localStorage.getItem('member_id') || '',
					sort_by: sort_by || this.sort_by
				}
				this.$api.api.AnswersList(data).then((res) => {
					this.answer_list = res.data.data.list
				})
			},
			// 获得更多说说列表
			getAnswerListMore() {
				let data = {
					questions_id: this.questions_id,
					p: this.page + 1,
					member_id: localStorage.getItem('member_id') || '',
					sort_by: this.sort_by
				}
				this.$api.api.AnswersList(data).then((res) => {
					if (res.data.data.list.length != 0) {
						this.answer_list = this.answer_list.concat(res.data.data.list)
						this.page += 1
					} else {
						// 下一页没有数据，关闭上拉加载
						loadMore.end()
					}
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.box {
		width: 100%;
		// display: flex;
		// align-items: flex-start;
		// justify-content: space-between;
	}

	.left {
		width: 33.33%;
		padding-left: 19%;
	}

	.center {
		width: 730px;
		min-width: 730px;
		margin: 0 auto;
		margin-top: 45px;
	}

	.right {
		width: 16.67%;
	}

	.post {
		width: 100%;
		border-radius: 10px;
		background-color: #fff;
		position: relative;
		z-index: 5;
		padding: 55px 40px 40px;

		>h2 {
			width: 100%;
			text-align: justify;
			font-size: 22px;
			color: #121212;
			font-weight: 600;
		}

		>p {
			width: 100%;
			text-align: justify;
			word-break: break-all;
			font-size: 16px;
			color: #666666;
			font-weight: 400;
			line-height: 1.5;
			margin-top: 15px;
		}

		&-text {
			max-width: 100%;
			margin-top: 15px;
			position: relative;
			z-index: 5;

			&-val {
				width: 100%;
				text-align: justify;
				word-break: break-all;
				font-size: 16px;
				color: #121212;
				font-weight: 400;
				line-height: 2;
				max-height: 100px;
				overflow: hidden;
			}

			&-all {
				height: auto !important;
				max-height: none;
			}

			&-more {
				font-size: 16px;
				color: #fbaa00;
				font-weight: 400;
				margin-bottom: 0;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}

			&-show {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}

		&-bg {
			width: 138px;
			height: 137px;
			position: absolute;
			z-index: 6;
			right: 0;
			top: 0;
		}

		&-tips {
			width: 88px;
			height: 44px;
			background: linear-gradient(0deg, #fbaa00, #fdd37b);
			border-radius: 4px;
			text-align: center;
			line-height: 44px;
			font-size: 26px;
			color: #fff;
			font-weight: 600;
			position: absolute;
			z-index: 6;
			left: 40px;
			top: -18px;
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

			&-item {
				flex-shrink: 0;
				max-width: 220px;
				padding: 15px 15px 15px 0px;
				display: flex;
				align-items: center;

				&-icon {
					width: 38px;
					height: 38px;
					margin-right: 20px;

					>img {
						width: 100%;
						height: 100%;
					}
				}

				>h2 {
					max-width: 260px;
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
		.image-scroll {
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
			background-image: -webkit-linear-gradient(45deg,
				rgba(255, 255, 255, 0.2) 25%,
				transparent 25%,
				transparent 50%,
				rgba(255, 255, 255, 0.2) 50%,
				rgba(255, 255, 255, 0.2) 75%,
				transparent 75%,
				transparent);
		}
	}

	.edit {
		width: 100%;
		margin-top: 20px;
	}

	.nav {
		width: 100%;
		margin-top: 20px;
	}

	.list {
		width: 100%;
		margin-top: 4px;
	}
</style>
