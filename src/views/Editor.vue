<template>
  <div class="container editor">
    <!-- header -->
    <div class="nav">
      <HeaderNotLogo />
    </div>
    <!-- 编辑器 -->
    <div class="contents">
      <!-- title -->
      <div class="contents-title">
        <div class="contents-title-left">
          <Breadcrumb @toback="bindBack" title="写文章" />
        </div>
        <!-- 按钮 -->
        <div class="contents-title-btn">
          <div class="contents-title-btn-nr">
            <div class="contents-title-btn-nr-item hands" @click="bindSubmit">
              发布
            </div>
            <div class="contents-title-btn-nr-item hands" @click="DepositDraft">
              存草稿
            </div>
          </div>
          <div class="contents-title-btn-anonymous hands" v-if="type == 2">
            <el-checkbox v-model="is_ano">匿名发布</el-checkbox>
          </div>
          <!-- <div class="contents-title-btn-nums">字数统计：{{ text_num }}/30000</div> -->
        </div>
      </div>
      <!-- 标题 发布星球主题 -->
      <div
        class="subject-inp"
        v-if="type == 3"
        style="
          width: 100%;
          border-bottom: 2px solid #f6f6f6;
          margin-bottom: 20px;
        "
      >
        <el-input v-model="subject" placeholder="请输入标题"></el-input>
      </div>
			<!-- 上传图片 自定义 隐藏 -->
			<div class="upload-img" style="">
			  <!-- <input
			    :id="uniqueId"
			    type="file"
			    name="file"
			    multiple
			    accept="image/jpg, image/jpeg, image/png, image/gif"
			    @change="uploadImg('uploadFormMulti')"
			  /> -->
				<el-upload class="upload" action :http-request="handleUpload" multiple show-file-list :file-list="imgList"
				 accept="image/*">111
				</el-upload>
			</div>
      <!-- 富文本编辑器 -->
      <div class="contents-editor">
        <quill-editor
          class="editor"
          ref="myQuillEditor"
          v-model="content"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
          @change="onEditorChange($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNotLogo from "@/components/HeaderNotLogo.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { addQuillTitle } from "@/assets/js/quill-title.js";
import Quill from "quill";
import ImageResize from "quill-image-resize-module";// 调整大小组件
import { ImageDrop } from "quill-image-drop-module";// 拖动加载图片组件
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);
import {
		client,
		getFileNameUUID
	} from '../assets/js/uploadoss.js'
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
  [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  // [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  // [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  // [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
  // [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  // [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ["clean"], // 清除文本格式-----['clean']
  ["image", "link"], // 链接、图片、视频-----['link', 'image', 'video']
];
export default {
  data() {
    return {
      is_ano: false,//是否 匿名发布
      ids: '',//星球id/百科id
      draft_id: '',//草稿id
      type: '2',// 2点击进行回答 3星球发布主题
      subject: '',//标题 星球发布主题
      text_num: 0, //编辑器字数统计
      content: "", // 富文本编辑器默认内容
      editorOption: {
        // Some Quill options...
        placeholder: "请发表你的观点...", //占位符
        modules: {
          toolbar: toolbarOptions, //工具栏定义的
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            // modules: ["Resize", "DisplaySize", "Toolbar"]
          },
        }, //  富文本编辑器配置
        theme: "snow", //主题
      }, //富文本编辑器配置
      uniqueId: "uniqueId",
			dataObj:"",  //临时凭证
			imgList:[],
    };
  },
  components: {
    HeaderNotLogo,
    Breadcrumb,
    quillEditor,
  },
  computed: {
    //当前富文本实例
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
	created() {
		var m_id = localStorage.getItem('member_id');
		let data = {
			member_id: m_id
		}
		this.$api.api.getalitoken(data).then((res) => {
			this.dataObj = res.data.data.Credentials
		})
	},
  mounted() {
    var _this = this;
    //富文本 操作按钮 添加title
    addQuillTitle()
    //type 2点击进行回答 3星球发布主题
    _this.type = _this.$route.query.type
    // ids 星球id/百科id
    _this.ids = _this.$route.query.ids

    // var imgHandler = async function (image) {
    //   // if (image) {
    //   //   var fileInput = document.getElementById(_this.uniqueId); //隐藏的file文本ID
    //   //   fileInput.click(); //加一个触发事件
    //   // }
    // };
    // _this.editor.getModule("toolbar").addHandler("image", imgHandler);
    console.log(_this.$route.query.mode)
    if (_this.$route.query.mode === 'update') {
      console.log(_this.$route.query.mode)
      // mode add 生成草稿箱方式进入  update 编辑草稿箱方式进入
      _this.draft_id = _this.$route.query.draft_id
      let data = {
        member_id: localStorage.getItem('member_id') || '',
        draft_id: _this.draft_id
      }
      _this.$api.api.DraftDetail(data).then((res) => {
        _this.content = res.data.data.content
        _this.subject = res.data.data.subject
      })
    }
  },
  methods: {
		handleUpload(file) {
			console.log(this.editor,"_this.editor")
			console.log(file,"选择的file")
			const isLt2M = file.file.size / 1024 / 1024 < 50;
			if (!isLt2M) {
			  this.$message.error('上传文件大小不能超过 50MB!');
				return false;
			}
			var fileurl = file.file.name
			var index = fileurl.lastIndexOf("\.");
			var lastname = fileurl.substring(index + 1, fileurl.length);
			var that = this
			// 生成的文件名称
			let objName = getFileNameUUID()
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
								let Range = that.editor.getSelection();
								// url = res.data.data.abs_url.indexOf("http") != -1 ? res.data.data.abs_url : "http:" + res.data.data.abs_url;
								//上传文件成功之后在富文本中回显(显示)
								that.editor.insertEmbed(
									Range != null ? Range.index : 0,
									"image",
									res.data.data.abs_url
								)
								
								
								// _this.editor.getModule("toolbar").addHandler("image", res.data.data.abs_url);
								//       let url = res;
								//       if (url != null && url.data.data.length > 0) {
								//         let Range = _this.editor.getSelection();
								//         url = url.data.data[0].abs_url.indexOf("http") != -1 ? url.data.data[0].abs_url : "http:" + url.data.data[0].abs_url;
								//         //上传文件成功之后在富文本中回显(显示)
								//         _this.editor.insertEmbed(
								//           Range != null ? Range.index : 0,
								//           "image",
								//           url
								//         );
								//       } else {
								//         _this.$Message({
								//           message: '图片上传失败',
								//           type: 'error'
								//         })
								//       }
								//       //成功之后,将文件的文本框的value置空
								//       document.getElementById(_this.uniqueId).value = "";
								//     });
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
		},
    // 发布
    bindSubmit() {
      //type 2点击进行回答 3星球发布主题
      switch (Number(this.type)) {
        case 2:
          let data = {
            member_id: localStorage.getItem('member_id') || '',
            questions_id: this.ids,
            content: this.content,
            text_type: 2,//1 纯文本 2html（富文本/图文混排）
            at_str: '',
            is_ano: this.is_ano ? 1 : '0'
          }
          this.$api.api.AnswersAdd(data).then((res) => {
            this.content = ''
            this.$Message({
              message: res.data.message,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000);
          })
          break;
        case 3:
          let datas = {
            member_id: localStorage.getItem('member_id') || '',
            star_id: this.ids,
            subject: this.subject,
            content: this.content,
            text_type: 2,//1 纯文本 2html（富文本/图文混排）
            at_str: ''
          }
          this.$api.api.AddPosts(datas).then((res) => {
            this.subject = ''
            this.content = ''
            this.$Message({
              message: res.data.message,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000);
          })
          break;
      }
    },
    // 存草稿
    DepositDraft() {
      //type 2点击进行回答 3星球发布主题
      switch (Number(this.type)) {
        case 2:
          let data = {
            type: 2,
            member_id: localStorage.getItem('member_id') || '',
            questions_id: this.ids,
            content: this.content,
            text_type: 2,//1 纯文本 2html（富文本/图文混排）
            draft_id: this.draft_id || ''
          }
          this.$api.api.DraftUpdate(data).then((res) => {
            this.content = ''
            this.$Message({
              message: res.data.message,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000);
          })
          break;
        case 3:
          let datas = {
            type: 3,
            member_id: localStorage.getItem('member_id') || '',
            star_id: this.ids,
            subject: this.subject,
            content: this.content,
            text_type: 2,//1 纯文本 2html（富文本/图文混排）
            draft_id: this.draft_id || ''
          }
          this.$api.api.DraftUpdate(datas).then((res) => {
            this.subject = ''
            this.content = ''
            this.$Message({
              message: res.data.message,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000);
          })
          break;
      }
    },
    // 返回上一页
    bindBack() {
      this.$router.go(-1)
    },
    //富文本编辑器 失去焦点事件
    onEditorBlur(quill) {
      //console.log("editor blur!", quill);
    },
    //富文本编辑器 获得焦点事件
    onEditorFocus(quill) {
     // console.log("editor focus!", quill);
    },
    //富文本编辑器 准备富文本编辑器
    onEditorReady(quill) {
      console.log("editor ready!", quill);
			quill.insertText(0,"dsadasdasdasdasd",'blod',true)
    },
    //富文本编辑器 内容改变事件
    onEditorChange({ quill, html, text }) {
      // console.log("editor change!", quill, html, text);
      this.content = html;
      this.text_num = text.length - 1;
    },
    // 上传图片
   //  uploadImg: async function () 
   //    var _this = this;
   //    //构造formData对象
   //    var formData = new FormData();
   //    formData.append("file", document.getElementById(_this.uniqueId).files[0]);
   //    formData.append("wap_terminal", 1);
			// console.log(formData)
			
			
   //    try {
   //  //     //调用上传文件接口
			// 	// console.log(formData)
   //  //     this.$api.api.Upload(formData).then(res => {
   //  //       //返回上传文件的地址
   //  //       let url = res;
   //  //       if (url != null && url.data.data.length > 0) {
   //  //         let Range = _this.editor.getSelection();
   //  //         url = url.data.data[0].abs_url.indexOf("http") != -1 ? url.data.data[0].abs_url : "http:" + url.data.data[0].abs_url;
   //  //         //上传文件成功之后在富文本中回显(显示)
   //  //         _this.editor.insertEmbed(
   //  //           Range != null ? Range.index : 0,
   //  //           "image",
   //  //           url
   //  //         );
   //  //       } else {
   //  //         _this.$Message({
   //  //           message: '图片上传失败',
   //  //           type: 'error'
   //  //         })
   //  //       }
   //  //       //成功之后,将文件的文本框的value置空
   //  //       document.getElementById(_this.uniqueId).value = "";
   //  //     });
   //    } catch ({ message: msg }) {
   //      document.getElementById(_this.uniqueId).value = "";
   //      _this.$Message({
   //        message: msg,
   //        type: 'warning'
   //      })
   //    }
   //  }
  },
};
</script>

<style lang="scss">
.subject-inp .el-input__inner {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #121212;
}
.subject-inp .el-input__inner::placeholder {
  color: #999999 !important;
  // font-weight: 400 !important;
  font-size: 18px !important;
}
/* 谷歌 */
.subject-inp .el-input__inner::-webkit-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 18px !important;
}
/* 火狐 */
.subject-inp .el-input__inner:-moz-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 18px !important;
}
/*ie*/
.subject-inp .el-input__inner:-ms-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 18px !important;
}
.nav {
  width: 100%;
}
.contents {
  // position: fixed;
  // left: 50%;
  // top: 110px;
  // transform: translateX(-50%);
  width: 880px;
  margin: 40px auto;
  min-width: 880px;
  // height: 900px;
  background-color: #fff;
  border-radius: 10px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-left{
      width: 50%;
    }
    &-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      // padding: 40px;
      // position: absolute;
      // left: 0;
      // right: 0;
      // bottom: 0;
      &-nr {
        display: flex;
        align-items: center;
        &-item {
          width: 110px;
          height: 45px;
          background: #fbaa00;
          border-radius: 4px;
          text-align: center;
          line-height: 45px;
          font-size: 18px;
          color: #fff;
          font-weight: 600;
          margin-right: 30px;
        }
      }
      &-nums {
        font-size: 16px;
        color: #999;
        font-weight: 600;
      }
    }
  }
  &-editor {
    width: 100%;
    height: 700px;
  }
}



.editor {
  line-height: normal !important;
  height: 100%;
}
// 富文本编辑行高
.ql-editor{
    line-height: 1.8 !important;
  }
.ql-container {
  height: 85%;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
// 富文本 placeholder 清除斜体
.ql-editor.ql-blank::before {
  font-style: normal;
  font-size: 16px;
}
.ql-editor p,
.ql-editor ol,
.ql-editor ul,
.ql-editor pre,
.ql-editor blockquote,
.ql-editor h1,
.ql-editor h2,
.ql-editor h3,
.ql-editor h4,
.ql-editor h5,
.ql-editor h6 {
  font-size: 16px;
}
.ql-snow .ql-editor h1 {
  font-size: 20px;
}
.ql-snow .ql-editor h2 {
  font-size: 18px;
}
.upload{
	background-color: #000000;
	display: inline-block;
	width: 30px;
	height: 30px;
	margin-top: 7px;
	opacity: 0;
}
.upload-img{
	position: relative;
	right: -117px;
	top: 0;
	height: 0;
}
</style>
