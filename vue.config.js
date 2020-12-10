module.exports = {
  publicPath: './',
  // 解决跨域
  devServer:{
    proxy: {
      '/apis': {
  
        // 测试环境
  
        target: 'https://autumnfish.cn', // 接口域名
  
        changeOrigin: true, //是否跨域
  
        pathRewrite: {
  
          '^/apis': '' //需要rewrite重写的,
        }
      }
    }
  }
}
