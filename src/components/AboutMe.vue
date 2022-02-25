<template>
  <div class="container">
    <div class="item hands" @click="toDetail(item.target_rule, item.rele_id,index,item.msg_id)">
      <div class="item-user">
        <div class="item-user-left">
          <User
            :nickname="item.nickname"
            :tx_url="item.cover"
            :create_time="item.create_time"
          />
        </div>
        <div class="item-user-right" v-show="item.star_name != ''">
          {{ item.star_name }}
        </div>
      </div>
      <p :style="item.status==1?'color:#999;font-weight:500;':''">{{ item.reason }}</p>
    </div>
  </div>
</template>

<script>
import User from "@/components/User.vue";
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object
    },
    index:{
      type:[Number,String]
    }
  },
  components: {
    User,
  },
  methods: {
    // 跳转到 对应的 详情
    toDetail(target_rule, rele_id,index,msg_id) {
      this.$emit('aboutDetail',target_rule, rele_id,index,msg_id)
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px 40px;
  background: #ffffff;
  border-radius: 0px 0px 10px 10px;
  margin-bottom: 20px;
  > p {
    width: 100%;
    text-align: justify;
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin-top: 20px;
  }
  &-user {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-right {
      font-size: 16px;
      color: #999;
      font-weight: 500;
    }
  }
}
</style>