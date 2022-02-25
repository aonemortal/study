<template>
  <div id="app">
    <HeaderNav v-show="show_header" />
    <!-- 需要缓存的视图组件 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!-- 不需要缓存的视图组件 -->
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import HeaderNav from "@/components/HeaderNav.vue"
export default {
  data() {
    return {
      show_header: false, //是否出现头部导航栏组件 HeaderNav
    };
  },
  components: {
    HeaderNav,
  },
  watch: {
    // 监听路由变化，控制是否出现头部导航栏组件 HeaderNav
    $route(to) {
      // console.log(to,'to')
      if (to.name === "Login" || to.name === "Editor" || to.name === "IndexDetailReplyDetail" || to.name === 'Index') {
        this.show_header = false;
      } else {
        this.show_header = true;
      }
			if(to.name==="huati"){
				document.body.scrollTop = 0
				document.documentElement.scrollTop = 0
				window.pageYOffset = 0
			}
    },
  },
  created() {
    this.$store.commit('changeNickName', localStorage.getItem('nickname') || '')
    this.$store.commit('changeMemberId', localStorage.getItem('member_id') || '')
    this.$store.commit('changeAbsUrl', localStorage.getItem('abs_url') || '')
    this.$store.commit('changeToken', localStorage.getItem('token') || '')
  }
};
</script>

<style lang="scss">
body {
  background-color: #f6f4f4 !important;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
// 登录页
.login .el-input__inner {
  height: 55px !important;
  line-height: 55px !important;
  border: none;
  padding: 0;
  font-size: 22px;
  color: #333;
}
.login .el-select .el-input__inner {
  font-size: 22px;
  color: #333;
}
// 头部导航栏
.headernav .el-input__inner {
  border: none;
  background-color: #fbfbfb;
  font-size: 16px;
  color: #333;
}
.headernav .el-input__inner::placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 16px !important;
}
/* 谷歌 */
.headernav .el-input__inner::-webkit-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 16px !important;
}
/* 火狐 */
.headernav .el-input__inner:-moz-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 16px !important;
}
/*ie*/
.headernav .el-input__inner:-ms-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 16px !important;
}
.elPopover {
  cursor: pointer;
  padding: 0 !important;
}
.headernav .el-button--text span {
  color: #333 !important;
}
// 留出 头部导航栏固定定位后的位置
.marginTop {
  margin-top: 90px;
}
// 菜单栏
.menu .el-tree {
  background-color: #f6f4f4;
}

.menu .el-tree-node__label {
  font-size: 20px;
  color: #4d4a4a;
}
.menu .el-tree-node__content {
  height: 45px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  padding-left: 0 !important;
}
.menu .el-tree-node__children .el-tree-node__content > span:nth-child(2) {
  padding-left: 0 !important;
  font-size: 20px !important;
  font-weight: 400;
  color: #787878;
}
.menu .el-tree-node:focus > .el-tree-node__content {
  background: none;
}
.menu .el-tree-node__expand-icon {
  font-size: 20px;
  // color: #999;
}
.menu
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: none;
}
.menu
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .el-tree-node__label {
  color: #fbaa00;
}
.menu .el-tree-node__content:hover {
  background: none;
}
.menu .el-tree-node__content:hover .el-tree-node__label {
  color: #fbaa00;
}

// 编辑弹出框
.editPopup .el-textarea__inner {
  border: none;
  padding: 0;
  min-height: 200px !important;
  height: 200px !important;
}
.editPopup .el-input > input .el-textarea__inner {
  border: none;
  padding: 0;
  min-height: 200px !important;
  height: 200px !important;
}
.editPopup .el-upload--picture-card {
  width: 26px;
  height: 26px;
  border: none;
}
.editPopup .el-input__inner {
  border: none;
  padding: 0;
  font-size: 20px;
  color: #121212;
}
.editPopup .ant-mentions,
.ant-mentions-focused {
  border: none !important;
  border-color: #fff !important;
  box-shadow: none;
}
.editPopup .ant-mentions:hover {
  border: none !important;
  border-color: #fff !important;
  box-shadow: none;
}
.editPopup .ant-mentions > textarea {
  padding: 0;
  font-size: 18px;
  color: #444;
}
// 弹窗 多选框
.editPopup .el-checkbox{
  display: flex;
  align-items: center;
}
.editPopup .el-checkbox__input{
  height: 20px;
}
.editPopup .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #fbaa00;
  border-color: #fbaa00;
}
.editPopup .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fbaa00;
}
.editPopup .el-checkbox .is-focus .el-checkbox__inner {
  border: 1px solid #dcdfe6;
}
.editPopup .el-checkbox__inner:hover{
  border-color: #fbaa00 !important;
}
.editPopup .el-checkbox__inner{
  width: 20px;
  height: 20px;
}
.editPopup .el-checkbox__label{
  font-size: 16px;
  line-height: 20px;
}
.editPopup .el-checkbox__inner::after{
  height: 10px;
  width: 4px;
  left: 7px;
  top: 2px;
}
// 列表 导航
.indexNav .el-tabs__header {
  box-sizing: border-box;
  padding: 0 40px;
  background-color: #fff;
  border-radius: 10px 10px 0px 0px;
}
.indexNav .el-tabs__item {
  height: 55px;
  line-height: 55px;
  font-weight: 600;
  font-size: 18px;
}
.indexNav .el-tabs__item.is-active {
  color: #fbaa00;
}
.indexNav .el-tabs__active-bar {
  background-color: #fbaa00;
  height: 3px;
}
.indexNav .el-tabs__item:hover {
  color: #fbaa00;
}
.indexNav .el-tabs__content {
  display: none;
}
.indexNav .el-tabs__nav-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #e4e7ed;
  z-index: 1;
  display: none;
}
.indexNav .el-tabs__header {
  margin-bottom: 0;
}
// 回复列表 单项
.IndexDetailReplyDetailItem .el-textarea__inner {
  padding: 10px 0 5px 0;
  border: none;
  min-height: 44px !important;
  font-size: 16px;
}
.IndexDetailReplyDetailItem .el-input__inner::placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}
/* 谷歌 */
.IndexDetailReplyDetailItem .el-input__inner::-webkit-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}
/* 火狐 */
.IndexDetailReplyDetailItem .el-input__inner:-moz-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}
/*ie*/
.IndexDetailReplyDetailItem .el-input__inner:-ms-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}
// 说说详情 主题详情 一级评论弹窗
.DetaileditPopup .box-content-edit .el-textarea__inner {
  border: none;
  padding: 0;
  min-height: 200px !important;
  height: 200px !important;
  font-size: 20px;
  color: #121212;
}
.DetaileditPopup .el-input__inner {
  border: none;
  padding: 0;
  font-size: 24px;
}

.el-input__inner::placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}
/* 谷歌 */
.el-input__inner::-webkit-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}
/* 火狐 */
.el-input__inner:-moz-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}
/*ie*/
.el-input__inner:-ms-input-placeholder {
  color: #999999 !important;
  font-weight: 400 !important;
  font-size: 20px !important;
}

.ant-mentions textarea::placeholder {
  color: #b7b7b7 !important;
  font-weight: 400 !important;
  font-size: 18px;
}
/* 谷歌 */
.ant-mentions textarea::-webkit-input-placeholder {
  color: #b7b7b7 !important;
  font-weight: 400 !important;
  font-size: 18px;
}
/* 火狐 */
.ant-mentions textarea:-moz-placeholder {
  color: #b7b7b7 !important;
  font-weight: 400 !important;
  font-size: 18px;
}
/*ie*/
.ant-mentions textarea:-ms-input-placeholder {
  color: #b7b7b7 !important;
  font-weight: 400 !important;
  font-size: 18px;
}

i {
  font-style: normal;
}

p {
  margin-bottom: 0 !important;
}

.el-dialog--center {
  border-radius: 10px !important;
}
.el-dialog__title {
  font-weight: 600;
}

// 富文本编辑器 图标布局排版
.editor .ql-toolbar.ql-snow {
  text-align: justify;
}
// 富文本 编辑页面 多选框
.editor .el-checkbox{
  display: flex;
  align-items: center;
}
.editor .el-checkbox__input{
  height: 20px;
}
.editor .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #fbaa00;
  border-color: #fbaa00;
}
.editor .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fbaa00;
}
.editor .el-checkbox .is-focus .el-checkbox__inner {
  border: 1px solid #dcdfe6;
}
.editor .el-checkbox__inner:hover{
  border-color: #fbaa00 !important;
}
.editor .el-checkbox__inner{
  width: 20px;
  height: 20px;
}
.editor .el-checkbox__label{
  font-size: 16px;
  line-height: 20px;
}
.editor .el-checkbox__inner::after{
  height: 10px;
  width: 4px;
  left: 7px;
  top: 2px;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #f2f2f2 !important;
  color: #fbaa00 !important;
}

// 草稿箱 删除草稿弹窗
.el-popconfirm__main{
  margin-bottom: 10px !important;
}
</style>
