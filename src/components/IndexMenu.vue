<template>
  <div class="container menu">
    <div class="box">
      <el-tree
        ref="treeList"
        :data="menu"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :highlight-current="true"
        node-key="menu_id"
        :default-expanded-keys="defaultMenu" 
				:default-expand-all="zhankai" 
      ></el-tree>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      ],//菜单列表
      defaultProps: {
        children: "children",
        label: "name",
      },
      defaultMenu: [this.menu_status],//选中的 菜单
	  zhankai:"true", //默认展开
    };
  },
  props: {
    menu_status: {
      type: [String, Number]
    }
  },
  computed:{
    vuexMenuStatus() {
      return this.$store.state.menu_status
    }
  },
  watch: {
    //选中的 菜单
    menu_status: {
      handler(newValue, oldValue) {
        this.defaultMenu[0] = newValue
      }
    },
    // 菜单列表
    menu: {
      handler(newValue, oldValue) {
        this.menu = newValue
      }
    },
    // 监听 vuex 里 选中的 菜单
    vuexMenuStatus:{
      handler(newValue, oldValue) {
        this.defaultMenu[0] = newValue
      }
    }
  },
  created() {
    // 树形菜单 页面渲染 默认选中 高亮
    this.$nextTick(function () {
      this.$refs.treeList.setCurrentKey(this.menu_status); //"treeList"是你自己在树形控件上设置的 ref="treeList" 的名称
    });
  },
  methods: {
    // 切换菜单
    handleNodeClick(data) {
      // console.log(data,'menu')
      if (data.menu_id != undefined && data.menu_id != null && data.menu_id != '') {
        this.$emit('menuChange', data.menu_id, data.star_id)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  position: relative;
}
.box {
  // width: 14.33%;
  padding-top: 30px;
  position: fixed;
}
</style>
