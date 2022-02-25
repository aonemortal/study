<template>
	<div class="container editPopup" v-loading.fullscreen.lock="loading">
		<el-dialog :title="
        this.status == 1 ? '进行提问' : this.status == 2 ? '写回答' : '发布主题'
      " :visible.sync="popupStatus"
		 width="730px" center :close-on-click-modal="false" @close="hideEditPopup" :lock-scroll="false">
			<div class="box">
				<!-- 编辑 -->
				<div class="box-content">
					<!-- 主题输入框 -->
					<div class="box-content-inp" @click="selecttitle" v-show="status == 1 || status == 3">
						<el-input v-model="subject" :placeholder="
                status == 1 ? '请输入问题并以问号结束' : '请输入标题'
              "></el-input>
					</div>
					<!-- 编辑框 -->
					<div class="box-content-edit" @click="selectedit">
						<a-mentions rows="10" maxLength="10000" v-model="textarea_val" :placeholder="placeholder" @change="onChange"
						 @select="onSelect" @blur="onBlur">
							<a-mentions-option v-for="(item, index) in friendsList" :key="item + index" :value="item.nickname">
								{{ item.nickname }}
							</a-mentions-option>
						</a-mentions>
					</div>
					<!-- 上传图片列表 -->
					<div class="box-content-img box-content-scroll" v-if="file_type == 1 && imgList.length != 0">
						<div class="box-content-img-item hands" v-for="(item, index) in imgList" :key="item + index">
							<el-image v-show="item.url!=''" style="width: 100%; height: 100%" :src="item.url" fit="cover">
							</el-image>
							<div class="bg" v-if="item.progress != 100">
								<el-progress class="imgprogress" v-show="item.progress!=100" color="#fbaa00" type="line" text-inside :format="format"
								 :percentage="item.progress"></el-progress>
							</div>
							<div class="box-content-img-item-del hands" @click.stop="bindDel(index, 1)">
								<img class="delimg" src="@/assets/images/close.png" />
							</div>
						</div>
					</div>
					<!-- 上传文件列表 -->
					<div :class="fileList.length >=4?'box-content-file box-content-scroll blockfile':'box-content-file blockfile'"
					 v-if="file_type == 3 && fileList.length != 0">
						<div class="box-content-file-item hands filepos" v-for="(item, index) in fileList" :key="item + index">
							<div class="files">
								<div class="box-content-file-item-icon fileitem">
									<img :src="item.icon" alt="" />
								</div>
								<h2>{{ item.name }}</h2>
							</div>
							<div class="righta">
								<el-progress v-if="item.progress != 100" class="fileprogress" v-show="showProgress" color="#fbaa00"
								 :stroke-width="10" :percentage="item.progress"></el-progress>
								<div @click.stop="bindDel(index, 3)">
									<img class="filedel" src="@/assets/images/delete.png" />
								</div>
							</div>
						</div> <!-- for  -->
					</div>
				</div>
				<!-- 底部操作栏 -->
				<div class="box-bottom">
					<div class="box-bottom-left">
						<!-- 传图 -->
						<div class="box-bottom-left-item hands">
							<el-upload class="upload-demo" action :http-request="handleUpload" multiple show-file-list :file-list="imgList"
							 accept="image/*">
								<div class="box-bottom-left-item-icon">
									<img src="@/assets/images/img_5.png" alt="" />
								</div>
							</el-upload>
						</div>
						<!-- 传文件 -->
						<div class="box-bottom-left-item hands">
							<el-upload action :http-request="handleUpload"  :on-success="handleSuccess" :on-progress="uploadProcess" :before-upload="beforeAvatarUpload" :auto-upload="true" multiple accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.pps,.ppts,.pdf,.zip,.rar,.7z,.epub,.mobi,.mp3,.wav,.m4a">
								<div class="box-bottom-left-item-icon">
									<img src="@/assets/images/img_6.png" alt="" />
								</div>
							</el-upload>
						</div>
						<!-- 表情 -->
						<div class="box-bottom-left-item hands">
							<el-popover placement="bottom" width="200" trigger="manual" popper-class="elPopover" v-model="emojiShow">
								<div class="box-bottom-left-item-icon" slot="reference" @click="
                    emojiShow = !emojiShow;
                    subjectPopup = false;
                  ">
									<img src="@/assets/images/img_4.png" alt="" />
								</div>
								<!-- 表情 -->
								<div class="browBox">
									<ul>
										<li v-for="(item, index) in faceList" :key="index" @click="getBrow(index)">
											{{ item }}
										</li>
									</ul>
								</div>
							</el-popover>
						</div>
						<div v-if="status != 2 && status != 1" class="box-bottom-left-item hands" @click="addlabel">
							<img v-if="labelshow" class="labelimg" src="@/assets/images/olabel.png" alt="" />
							<img v-else class="labelimg" src="@/assets/images/label.png" alt="" />
							<!-- 表情 -->
						</div>

						<div class="label" v-if="labelshow">
							<div class="labelbox">
								<p>添加标签</p>
								<button @click="closelabel">确认添加</button>
							</div>

							<div class="title">标签</div>
							<div class="fa">
								<div v-for="(item, index) in tagList" :key="index" @click="addtext(item.name)" class="one">
									{{ item.name }}
								</div>
							</div>
						</div>
					</div>
					<div class="box-bottom-right">
						<div class="box-bottom-right-anonymous hands" style="margin-right: 20px" v-if="status == 2">
							<el-checkbox v-model="is_ano">匿名发布</el-checkbox>
						</div>
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
	const appData = require("@/assets/json/emoji.json")
	import baseurl from '@/network/baseURL.js'
	import {
		client,
		getFileNameUUID
	} from '../assets/js/uploadoss.js'

	// import Mentions from 'ant-design-vue/lib/mentions'
	// import 'ant-design-vue/lib/mentions/style/css'
	// import Input from 'ant-design-vue/lib/input'
	// import 'ant-design-vue/lib/input/style/css'
	export default {
		data() {
			return {
				placeholder: this.status == 1 ? "对问题进行补充说明可以获得更精准的回答" : this.status == 2 ? "请发表你的观点..." : "编辑详细内容", //编辑框占位符
				textarea_val: "", //编辑框编辑文本
				popupStatus: this.centerDialogVisible, //编辑弹窗 是否出现
				showProgress: false, //进度条显示
				imgList: [], //上传图片数据
				fileList: [], //上传文件数据
				progress: 0,//上传进度
				file_type: 1, //文件类型 1图片 3文件
				emojiShow: false, //表情框是否展示
				faceList: [], //表情列表
				getBrowString: "", //表情文本
				fileidlist: '', //上传图片的id列表
				loading: false,
				subject: '', //主题
				dataObj: '', //临时凭证
				isOfficial: this.is_official, //父级 百科列表选中的 百科/热榜
				starId: this.star_id, //星球id
				friendsList: [], //@ 好友列表
				subjectPopup: false, // 话题 弹出层
				tagList: '', //标签列表
				blurAddress: 0, //输入框 失去焦点位置 发布星球主题 选择 标签使用
				upload_URL: baseurl.upload_URL, //上传地址
				is_ano: false, //是否 匿名发布
				labelshow: false,
				select: '', //区分选择主题 编辑框id
			};
		},
		components: {
			// Mentions,
			// Input
		},
		props: {
			// 编辑弹窗 是否出现
			centerDialogVisible: {
				type: Boolean,
				default: false
			},
			// 编辑弹窗类型 1提问 2回答 3星球发布主题
			status: {
				type: [Number, String]
			},
			//提问/百科 ID
			questions_id: {
				type: [Number, String]
			},
			// 1百科 0或不传 热榜
			is_official: {
				type: [Number, String]
			},
			// 星球id
			star_id: {
				type: [Number, String]
			},
			title: {  //编辑传过来的值
				type: [Number, String]
			},
			content: {  //编辑传过来的值
				type: [Number, String]
			},
		},
		watch: {
			title:{
				handler(newValue, oldValue) {
					console.log(newValue,"传过来的title")
				},
			},
			content:{
				handler(newValue, oldValue) {
					console.log(newValue,"传过来的content")
				},
			},
			// 监听 父组件传来的值 改变编辑弹窗的状态
			centerDialogVisible: {
				handler(newValue, oldValue) {
					// console.log(newValue,oldValue,'indexEditPopup')
					this.popupStatus = newValue
				},
			},
			// 监听 父组件传来的值 选中的是 热榜/百科
			is_official: {
				handler(newValue, oldValue) {
					this.isOfficial = newValue
				},
			},
			// fileList: {
			// 	handler(newValue, oldValue) {
			// 		console.log(newValue,"new FileList")
			// 		this.fileList = newValue
			// 	}
			// },
			// 监听 父组件传来的值 选中的星球
			star_id: {
				handler(newValue, oldValue) {
					this.starId = newValue
					// 获取 发布星球主题 标签列表
					let datas = {
						star_id: this.starId
					}
					this.$api.api.TagList(datas).then((res) => {
						console.log(res)
						this.tagList = res.data.data.list
					})
				},
			}
		},
		created() {
			console.log(this.title,"传title")
			this.loadEmojis();
			var m_id = localStorage.getItem('member_id');
			let data = {
				member_id: m_id
			}
			this.$api.api.getalitoken(data).then((res) => {
				this.dataObj = res.data.data.Credentials
			})

		},
		mounted() {
			// 获取 好友列表
			let data = {
				member_id: localStorage.getItem('member_id') || ''
			}
			this.$api.api.AttentionList(data).then((res) => {
				this.friendsList = res.data.data.list
			})

		},
		methods: {
			//选择主题
			selecttitle() {
				this.select = 1
			},
			//选择编辑框
			selectedit() {
				this.select = 2
			},
			//将标签加入到输入框
			addtext(text) {
				console.log(text)
				let txt = `#${text}#`
				if (this.select == 1) {
					this.subject = `${this.subject}${txt}`
				} else if (this.select == 2) {
					this.textarea_val = `${this.textarea_val}${txt}`
				}
			},
			//判断文件大小
			beforeAvatarUpload(file){
				const isLt2M = file.size / 1024 / 1024 < 50;
				if (!isLt2M) {
				  this.$message.error('上传文件大小不能超过 50MB!');
				}
				return isLt2M;
			},
			//关闭标签
			closelabel() {
				this.labelshow = !this.labelshow
			},
			//打开标签
			addlabel() {
				this.labelshow = !this.labelshow
			},
			//进度条
			format(percentage) {
				return percentage === 100 ? '' : `${percentage}%`;
			},
			//上传文件与图片
			handleUpload(file) {
				console.log(file,"选择的file")
				const isLt2M = file.file.size / 1024 / 1024 < 50;
				if (!isLt2M) {
				  this.$message.error('上传文件大小不能超过 50MB!');
					return false;
				}
				
				// that.showProgress = true
				var fileurl = file.file.name
				var index = fileurl.lastIndexOf("\.");
				var lastname = fileurl.substring(index + 1, fileurl.length);
				var that = this
				// 生成的文件名称
				let objName = getFileNameUUID()
				if (lastname === 'doc' || lastname === 'docx' || lastname === 'xlsx' || lastname === 'pdf' || lastname === 'xls' ||
					lastname === 'ppt' || lastname === 'pptx' || lastname === 'csv' || lastname === 'pps' || lastname === 'ppts' ||
					lastname === 'zip' || lastname === 'rar' || lastname === '7z' || lastname === 'epub' || lastname === 'mobi' ||
					lastname === 'mp3' || lastname === 'wav' || lastname === 'm4a') {
					console.log("进入了上传文件")
					let data = {
						ext: lastname
					}
					let progresss
					this.$api.api.getfileicon(data).then((res) => {
						var icon = res.data.data.icon
						that.fileList.push({
							icon: icon,
							name: file.file.name,
							progress:progresss,
							uid: file.file.uid,
							lastname: lastname,
							id:0,
						})
						var list =JSON.parse(JSON.stringify(that.fileList))
						console.log(that.fileList[0],"list")
						const fileName = objName + file.file.name
						//client 是第一步中的 client
						that.fileList.map((item,index)=>{
							if(index==that.fileList.length-1){
								client(that.dataObj).multipartUpload(fileName, file.file, {
										progress: function(p) { //获取进度条的值
											 // progresss = p.toFixed(2) * 100;
											item.progress =Math.floor(p.toFixed(2) * 100) ;
											console.log(p.toFixed(2) * 100, "*100"+item.name)
										},
									}).then(
										result => {
											//下面是如果对返回结果再进行处理，根据项目需要
											var fileurl = file.file.name
											var index = fileurl.lastIndexOf("\.");
											var lastname = fileurl.substring(index + 1, fileurl.length);
											let data = {
												savename: result.name,
												ext: lastname,
												name: file.file.name,
												size: file.file.size
											}
											that.$api.api.recordfile(data).then((res) => {
												console.log(res, "success文件")
												item.id=res.data.data.id
											}).catch((res) => {
												console.log(res, "err")
											})
										}).catch(err => {
										console.log("err:", err)
									})
								}
								that.file_type = 3
								that.imgList = []
							})
						})
					
				} else {
					console.log("进入了上传图片")
					that.imgList.push({
						name: file.file.name,
						uid: file.file.uid,
						progress: 0,
						url: "", // res.data.data.abs_url
						id: 0,
						lastname: lastname
					})
					
					that.imgList.map((item,index)=>{
						if(index==that.imgList.length-1){
							const fileName = objName + file.file.name
							client(that.dataObj).multipartUpload(fileName, file.file, {
								progress: function(p) { //获取进度条的值
									item.progress = Math.floor(p.toFixed(2) * 100);
									console.log(p.toFixed(2) * 100, "*100")
								},
							}).then(result => {
								//下面是如果对返回结果再进行处理，根据项目需要
								var fileurl = file.file.name
								var index = fileurl.lastIndexOf("\.");
								var lastname = fileurl.substring(index + 1, fileurl.length);
								let data = {
									savename: result.name,
									ext: lastname,
									name: file.file.name,
									size: file.file.size
								}
								that.$api.api.recordfile(data).then((res) => {
									console.log(res, "success图片")
									item.url=res.data.data.abs_url
									item.id=res.data.data.id
									console.log(that.imgList)
								}).catch((res) => {
									console.log(res, "err")
								})
							}).catch(err => {
								console.log("err:", err)
							})
						} //if
					})  //map
					that.fileList = []
					that.file_type = 1
				}  //else
			},
			//文件上传时的钩子   无效
			uploadProcess(event, file, fileList) {
        console.log(event,"event.percent");
        // this.percent = Math.floor(event.percent);
      },
			//文件上传成功的钩子  无效
			 handleSuccess(res, file) {
				console.log(res,"handleSuccess")
			},
			// 删除 上传 文件/图片
			bindDel(index, type) {
				// type 1 删除图片 3 删除文件
				switch (Number(type)) {
					case 1:
						this.imgList.splice(index, 1)
						break;
					case 3:
						this.fileList.splice(index, 1)
						break;
				}
			},
			// 上传图片 预览
			showImg(url) {
				window.open(
					url,
					"_blank"
				)
			},
			// 上传文件 预览
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
			// 发布
			bindSubmit() {
				// 整理 图片/文件 数据
				switch (this.file_type) {
					case 1:
						var file = []
						for (let i = 0; i < this.imgList.length; i++) {
							file = file.concat(this.imgList[i].id)
							console.log(file, 'file图片')
						}
						break;
					case 3:
						var file = []
						console.log(this.fileList, 'fileList')
						for (let i = 0; i < this.fileList.length; i++) {
							file = file.concat(this.fileList[i].id)
							console.log(file, 'file文件')
						}
						break;
				}
				switch (Number(this.status)) {
					case 1:
						// 判断标题是否以问号结尾
						if (this.subject.charAt(this.subject.length - 1) === '?' || this.subject.charAt(this.subject.length - 1) === '？') {
							// 发布提问
							let datas = {
								member_id: localStorage.getItem('member_id') || '',
								subject: this.subject,
								text_type: 1,
								content: this.textarea_val,
								pictures: file.join(','),
								file_type: this.file_type
							}
							this.$api.api.EncyAdd(datas).then((res) => {
								this.$Message({
									message: res.data.message,
									type: 'success'
								})
								this.popupStatus = false
								this.$emit("popupStatus", this.popupStatus, this.status)
								this.$parent.getEncyclopediasList(this.isOfficial)
								this.subject = ''
								this.textarea_val = ''
								this.imgList = []
								this.fileList = []
							})
						} else {
							this.$Message({
								message: '提问标题请以问号结尾',
								type: 'warning'
							})
						}
						break;
					case 2:
						// 发布说说
						let data = {
							member_id: localStorage.getItem('member_id') || '',
							questions_id: this.questions_id,
							content: this.textarea_val,
							text_type: 1,
							pictures: file.join(','),
							file_type: this.file_type,
							is_ano: this.is_ano ? 1 : '0'
						}
						this.$api.api.AnswersAdd(data).then((res) => {
							this.$Message({
								message: res.data.message,
								type: 'success'
							})
							this.popupStatus = false
							this.$emit("popupStatus", this.popupStatus, this.status)
							this.$parent.getAnswerList(this.questions_id)
							this.textarea_val = ''
							this.imgList = []
							this.fileList = []
						})
						break;
					case 3:
						// 发布星球 主题
						let dataStar = {
							member_id: localStorage.getItem('member_id') || '',
							star_id: this.starId,
							subject: this.subject,
							content: this.textarea_val,
							text_type: 1,
							pictures: file.join(','),
							file_type: this.file_type,
							at_str: ''
						}
						this.$api.api.AddPosts(dataStar).then((res) => {
							this.$Message({
								message: res.data.message,
								type: 'success'
							})
							this.popupStatus = false
							this.$emit("popupStatus", this.popupStatus, this.status)
							this.$parent.getStarList()
							this.textarea_val = ''
							this.subject = ''
							this.imgList = []
							this.fileList = []
						})
						break;
				}
			},

			// 关闭 编辑弹窗
			hideEditPopup() {
				// console.log('关闭弹窗回调')
				this.emojiShow = false
				this.popupStatus = false
				this.$emit("popupStatus", this.popupStatus, this.status)
			},

			//加载表情，存放到表情列表中
			loadEmojis() {
				for (let i in appData) {
					this.faceList.push(appData[i].char);
				}
			},
			// 获取用户点击之后的表情 ，存放到输入框内
			getBrow(index) {
				for (let i in this.faceList) {
					if (index == i) {
						this.getBrowString = this.faceList[index];
						this.textarea_val += this.getBrowString;
					}
				}
				this.emojiShow = false;
			},

			// @用户 变化
			onSelect(option) {
				// console.log('select', option);
			},
			onChange(value) {
				// console.log('Change:', value);
			},
			// 输入框 失去焦点
			onBlur(e) {
				this.blurAddress = e.target.selectionStart
			},
			// 选择 发布星球主题 标签
			changeSubject(name) {
				this.subjectPopup = false
				let newStar = ' #' + name + '# '
				this.textarea_val = this.handlerTextareaVal(this.textarea_val, this.blurAddress, newStar)
			},
			// 选择 标签后 插入编辑框内容指定位置
			handlerTextareaVal(soure, start, newStr) {
				/*
				  soure为原字符串
				  start为将要插入字符的位置
				  newStr为要插入的字符
				*/
				return soure.slice(0, start) + newStr + soure.slice(start)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.label {
		width: 600px;
		background: #fff;
		position: absolute;
		top: 560px;
		left: 0px;
		border-radius: 5px;
		padding: 20px;
	}

	.label>.labelbox {
		height: 36px;
		width: 100%;
		background: #f5f5f5;
		display: flex;
		justify-content: space-between;
	}

	.labelbox>p {
		line-height: 36px;
		margin-left: 10px;
		border-radius: 5px;
	}

	.labelbox>button {
		background: #fbaa00;
		color: #fff;
		border: none;
	}

	.label>.title {
		line-height: 70px;
	}

	.label>.fa>.one {
		display: inline-block;
		padding: 5px 10px;
		text-align: center;
		line-height: 34px;
		color: #fbaa00;
		cursor: pointer;
		background: #f6f4f4;
		margin-top: 5px;
		margin-left: 10px;
	}

	.labelimg {
		height: 26px;
		width: 26px;
	}

	.righta {
		display: flex;
		align-items: center;
	}

	.fileitem {
		display: flex;
		align-items: center;
	}

	.filedel {
		margin-right: 30px;
	}

	.el-upload-list--picture-card .el-upload-list__item-actions {
		position: absolute !important;
		width: 0px !important;
		height: 0% !important;
		left: 0 !important;
		top: 0 !important;
		cursor: default;
		text-align: center;
		color: #fff;
		opacity: 0;
		font-size: 20px;
		background-color: rgba(0, 0, 0, 0.5);
		transition: opacity 0.3s;
	}

	.bg {
		height: 135px;
		width: 135px;
		background: #f6f4f4;
		position: absolute;
		top: 0;
	}

	.delimg {
		height: 30px;
		width: 30px;
	}

	.box-content-scroll {
		height: 220px !important;
	}

	.filepos {
		position: relative;
	}

	.blockfile {
		display: block;
	}

	.el-progress {
		z-index: 10000;
	}

	.fileprogress {
		display: block !important;
		margin-right: 80px;
		width: 200px;
	}

	.imgprogress {
		width: 80% !important;
		display: flex;
		position: absolute;
		top: 45%;
		left: 10%;
		z-index: 100000;
	}

	.files {
		display: flex;
		align-items: center;
	}

	h2 {
		margin-bottom: 0 !important;
		font-size: 16px;
	}

	.box {
		width: 100%;

		&-content {
			width: 100%;
			padding: 35px 0 25px 0;
			border-top: 2px solid #f6f4f4;

			&-inp {
				width: 100%;
				margin-bottom: 10px;
			}

			&-edit {
				width: 100%;

				>textarea {
					width: 100%;
					border: none;
					padding: 0;
					min-height: 200px !important;
					height: 200px !important;
					outline: none;
					resize: none;
				}

				>textarea::-webkit-input-placeholder {
					color: #b7b7b7;
				}

				>textarea:-moz-placeholder {
					color: #b7b7b7;
				}

				>textarea::-moz-placeholder {
					color: #b7b7b7;
				}

				>textarea:-ms-input-placeholder {
					color: #b7b7b7;
				}
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
						right: 0px;
						top: 0px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}

				&-item:first-child {
					margin-left: 0;
				}
			}

			&-file {
				width: 100%;

				align-items: center;

				&-item {
					margin-bottom: 20px;
					max-width: 100%;
					justify-content: space-between;
					display: flex;
					align-items: center;
					position: relative;
					z-index: 5;

					&-del {
						z-index: 6;
						width: 30px;
						height: 30px;
						border-radius: 50%;
					}

					&-icon {
						width: 40px;
						height: 40px;
						margin-right: 20px;

						>img {
							width: 100%;
							height: 100%;
						}
					}

					>h2 {
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

						>img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			&-right {
				display: flex;
				align-items: center;

				>p {
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

	.browBox {
		width: 200%;
		height: 200px;
		background: #e6e6e6;
		// position: absolute;
		// z-index: 100;
		// bottom: -200px;
		overflow-y: scroll;

		ul {
			display: flex;
			flex-wrap: wrap;
			padding: 10px;

			li {
				cursor: pointer;
				width: 10%;
				font-size: 26px;
				list-style: none;
				text-align: center;
			}
		}
	}

	.subject {
		width: 100%;
		max-height: 200px;
		background: #fff;
		overflow-y: scroll;

		&-item {
			width: 100%;
			padding: 5px 10px;
			font-size: 18px;
			columns: #333;
			text-align: justify;
		}

		&-item:hover {
			background-color: #e6e6e6;
		}
	}
</style>
