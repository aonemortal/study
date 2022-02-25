<template>
  <div class="container indexNav">
    <div class="nav">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="item.name"
          :name="item.type"
          v-for="(item, index) in list_nav"
          :key="item + index"
          >{{ item.name }}</el-tab-pane
        >
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: this.default,
    };
  },
  props: {
    // 导航列表
    list_nav: {
      type: Array
    },
    // status 1百科 2加入的星球
    status: {
      type: [Number, String]
    },
    // 默认选中
    default: {
      type: [Number, String]
    }
  },
  watch: {
    // 监听 默认选中的导航
    default: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue)
        this.activeName = newValue
      }
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('NavIndex', e.index, this.status)
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
}
</style>
