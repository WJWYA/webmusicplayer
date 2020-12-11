module.exports = {
  publicPath: './',
  outputDir:'dist', //build输出目录
  assetsDir:'assets',//静态资源目录
  // lintOnSave:process.env.NODE_ENV ==='production',
  devServer:{
    // open:true,
    // proxy:{
    //   [process.env.VUE_APP_BAS_API]:{
    //     target:process.env.VUE_APP_SERVICE_URL,//API服务器的地址
    //     ws:true,//代理websockets
    //     changeOrigin:true,//虚拟的站点需要更换origin
    //     pathRewrite:{//重写路径
    //       ['^'+process.env.VUE_APP_BAS_API]:'/'
    //     }
    //   }
    // }
    proxy:{
     '/api':{
        target:"https://autumnfish.cn",//API服务器的地址
        ws:true,//代理websockets
        changeOrigin:true,//虚拟的站点需要更换origin
        pathRewrite:{//重写路径
          '^/api':''
        }
      }
    }
  }

}
