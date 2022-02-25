const scroll = {
  fn: null,
  isEnd: false,
  // callback 使用上拉加载页面传入的方法
  start(callback) {
    this.isEnd = false
    // console.log('创立滚动监听')
    this.fn = this.debpunce(this.scrollFUNC(callback), 300)
    callback && window.addEventListener('scroll', this.fn, true)
  },
  // 下一页没有内容 就算触底也不请求下一页
  end() {
    this.isEnd = true
  },
  // 在当前页关闭上拉加载后，再次开启上拉加载
  again() {
    this.isEnd = false
  },
  // 函数防抖
  debpunce(fn, wait) {
    let timer = null
    return function (...res) {
      let context = this
      if (timer) { clearTimeout(timer) }
      timer = setTimeout(() => {
        fn.call(context, ...res)
      }, wait)
    }
  },
  // 监听滚动 addEventListener回调
  scrollFUNC(callback) {
    let that = this
    return function () {
      //浏览器向上滚动的高度
      const scrollTop = document.documentElement.scrollTop
      // console.log(scrollTop, 'scrollTop')
      //文档真实的高度
      const scrollHeight = document.documentElement.scrollHeight
      // console.log(scrollHeight, 'scrollHeight')
      //游览器窗口（文档）的可视高度，就是肉眼可见的那部分真实高度
      const clientHeight = document.documentElement.clientHeight
      // console.log(clientHeight, 'clientHeight')
      // scrollHeight - 50 距离页面底部50像素的位置加载下一页
      if (!that.isEnd && scrollHeight - 50 < scrollTop + clientHeight) {
        //触底 反弹 250 个像素
        // window.scrollTo(0, scrollTop - 200)
        callback()
      }
    }
  },
  // 卸载滚动监听
  uninstall() {
    // console.log('销毁滚动监听')
    window.removeEventListener('scroll', this.fn, true)
  }
}

export default scroll