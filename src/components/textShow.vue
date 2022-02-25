<template>
  <div class="container">
    <div class="box">
      <div
        class="box-content"
        ref="lineHeight"
        :class="more ? 'box-all' : ''"
        v-html="content"
      ></div>
      <div
        class="box-more"
        :class="more ? '' : 'box-show'"
        @click.stop="more = !more"
        v-if="valMore"
      >
        {{ more ? "收起" : "查看更多" }}<i class="el-icon-d-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valMore: false
    }
  },
  props: {
    content: {
      type: String
    },
    content_fu: {
      type: String
    },
    more: {
      type: Boolean,
      default: false
    },
    index: {
      type: [Number, String]
    }
  },
  watch: {
    content: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.$nextTick(() => {
						
            if (Number(this.$refs.lineHeight.offsetHeight) > 300) {
              this.valMore = true
							
            } else {
              this.valMore = false
            }
          })
        }
      }
    }
  },
  asyncComputed: {
    // async LineHeightFunc() {
    //   let that = this
    //   return await new Promise((resolve, reject) => {
    //     that.$nextTick(() => {
    //       setTimeout(() => {
    //         // resolve(Number(`${that.$refs['lineHeight' + that.index].offsetHeight}`) > 300)
    //         console.log(Number(this.$refs.lineHeight.offsetHeight))
    //         // resolve(Number(this.$refs.lineHeight.offsetHeight) > 300)
    //         if (Number(this.$refs.lineHeight.offsetHeight) > 300) {
    //           this.valMore = true
    //         } else {
    //           this.valMore = false
    //         }
    //       }, 300)
    //     })
    //   })
    // }
  },
  mounted() {
    let that = this
    that.$nextTick(() => {
      setTimeout(() => {
        // console.log(Number(this.$refs.lineHeight.offsetHeight))
        if (Number(this.$refs.lineHeight.offsetHeight) > 300) {
          this.valMore = true
        } else {
          this.valMore = false
        }
      }, 300)
    })
  },
	filters:{
		gaishuju(value){ //处理数据
			console.log(value)
			var findArray=value.match(/#.+?#/)
			if(null==findArray||0==findArray.length)return value
			var result=value.substr(0,findArray.index) +"<a style='color:#fbaa00' href='/index?name="+value.substr(findArray.index,findArray[0].length)+"'>" +value.substr(findArray.index,findArray[0].length)+"</a>"
			if(value.length>findArray.index+findArray[0].length){
				result=result+this.gaishuju(value.substr(findArray.index+findArray[0].length))
				console.log(result)
			}
			return result
		},
	},
	methods:{
		
	}
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  margin-top: 15px;
  position: relative;
  z-index: 5;
  &-content {
    width: 100%;
    text-align: justify;
    line-height: 2;
    font-size: 16px;
    color: #121212;  //fbaa00
    font-weight: 400;
    word-break: break-all;
    // height: 330px;
    max-height: 330px;
    overflow: hidden;
  }
  &-all {
    height: auto !important;
    max-height: none;
  }
  &-more {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fbaa00;
    font-weight: 400;
  }
  &-show {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(243, 243, 243, 0.9), #fff);
    box-shadow: 0px -10px 20px rgb(243, 243, 243);
  }
}

.content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  &-text {
    display: inline-block;
    text-align: justify;
    font-size: 16px;
    color: #121212;
    font-weight: 400;
    margin-top: 15px;
    word-break: break-all;
    line-height: 1.8;
    &-more {
      display: inline-block;
      font-size: 16px;
      color: #fbaa00;
      font-weight: 400;
      margin-bottom: 0;
    }
  }
}
.more {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.contentMore {
  position: relative;
  z-index: 5;
  .content-text-more {
    display: inline-block;
    // position: absolute;
    // z-index: 6;
    // right: 0;
    // bottom: 0;
  }
}
</style>