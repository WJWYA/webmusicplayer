module.exports = {
  publicPath: './',
  // 解决跨域
  devServer:{
    proxy: {
      '/api': {
  
        // 测试环境
  
        target: 'https://autumnfish.cn', // 接口域名
  
        changeOrigin: true, //是否跨域
  
        pathRewrite: {
  
          '^/api': '' //需要rewrite重写的,
        }
      }
    }
  }
}
