<template>
  <div class="container">
    <div class="box" style="display: flex; justify-content: space-between;">
      <div><i class="hands" @click="bindBack">返回</i> | <b style="color: black;">{{ title }}</b></div>
	  <i class="hands" @click="bindBack">进入星球></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
    },
  },
  methods: {
    // 返回上一页
    bindBack() {
      this.$emit("toback");
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  padding: 25px 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #999999;
  font-weight: 600;
  > i {
    font-size: 20px;
    color: #999999;
    font-weight: 500;
    padding-right: 5px;
    font-style: normal;
  }
  > i:hover {
    text-decoration: underline;
  }
  > b {
    font-size: 20px;
    color: #333;
    font-weight: 500;
    font-style: normal;
    margin-left: 5px;
  }
}
</style>