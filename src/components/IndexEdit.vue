<template>
  <div class="concainer indexEdit">
    <div class="box hands" @click="showEditPopup">
      <!-- 编辑框 -->
      <div class="box-edit">
        <div class="box-edit-tx">
          <!-- <img src="@/assets/images/img_3.png" alt="" /> -->
          <el-image
            style="width: 100%; height: 100%"
            :src="this.$store.state.abs_url"
            fit="cover"
          ></el-image>
        </div>
        <div class="box-edit-content">
          {{ placeholder }}
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="box-btn">
        <div class="box-btn-left">
          <div class="box-btn-left-item">
            <div class="box-btn-left-item-icon">
              <img src="@/assets/images/img_5.png" alt="" />
            </div>
          </div>
          <div class="box-btn-left-item">
            <div class="box-btn-left-item-icon">
              <img src="@/assets/images/img_6.png" alt="" />
            </div>
          </div>
          <div class="box-btn-left-item">
            <div class="box-btn-left-item-icon">
              <img src="@/assets/images/img_4.png" alt="" />
            </div>
          </div>
          <div class="box-btn-left-item" v-show="status == 3">
            <div class="box-btn-left-item-icon">
              <img src="@/assets/images/img_17.png" alt="" />
            </div>
          </div>
        </div>
        <div class="box-btn-right">
          <div
            class="box-btn-right-item"
            @click.stop="toEditor"
            v-if="status == 2 || status == 3"
          >
            <i class="el-icon-edit"></i>
            <b>去写文章</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      popupStatus: this.centerDialogVisible, //编辑弹窗 是否出现
    };
  },
  props: {
    placeholder: {
      type: String,
    },
    status: {
      type: [Number, String], // 1点击进行提问 2点击进行回答 3星球发布主题
    },
    // 编辑弹窗 是否出现
    centerDialogVisible: {
      type: Boolean,
      default: false,
    },
    // id 星球id/百科id
    ids: {
      type: [Number, String],
    }
  },
  watch: {
    // 监听 父组件传来的值 改变编辑弹窗的状态
    centerDialogVisible: {
      handler(newValue, oldValue) {
        // console.log(newValue,oldValue,'indexEdit')
        this.popupStatus = newValue
      },
    }
  },
  methods: {
    // 改变 编辑弹窗状态 出现/隐藏
    showEditPopup() {
      // console.log(status,'status')
      this.popupStatus = !this.popupStatus
      this.$emit('changeEditPopupState', this.popupStatus, this.status)
    },
    // 跳转到 写文章 编辑器
    toEditor() {
      this.$router.push({
        path: '/editor', query: {
          type: this.status,
          ids: this.ids,
          mode: 'add'
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  padding: 0 40px;
  background-color: #fff;
  border-radius: 10px;
  &-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    border-top: 2px solid #f6f4f4;
    &-left {
      display: flex;
      align-items: center;
      &-item {
        margin-right: 30px;
        &-icon {
          width: 26px;
          height: 26px;
          > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    &-right {
      display: flex;
      align-items: center;
      &-item {
        display: flex;
        align-items: center;
        padding-left: 20px;
        border-left: 4px solid #f6f4f4;
        > i {
          font-size: 24px;
          font-style: normal;
          color: #fbaa00;
        }
        > b {
          font-size: 18px;
          color: #fbaa00;
          font-weight: 600;
          margin-left: 10px;
        }
      }
    }
  }
  &-edit {
    width: 100%;
    padding: 20px 0;
    height: 100px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    &-tx {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
    }
    &-content {
      width: 93%;
      padding-top: 13px;
      text-align: left;
      font-size: 18px;
      color: #999999;
      // font-weight: 600;
    }
  }
}
</style>
