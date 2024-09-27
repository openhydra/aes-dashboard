/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/24)
 * @Description: 本地测试修改请不要提交，除非添加 url
 */

const AppService = {
  AppService: 'http://61.241.103.52:30002', // 测试
  staticHost: 'https://172.16.50.79', // 静态资源,
  baiduTrans: 'https://fanyi-api.baidu.com/api/trans/vip/translate'
};

module.exports = {
  proxy: [
    {
      context: ['/coreApi'],
      target: AppService.AppService,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/coreApi': '/apis/core-api.openhydra.io/v1/'
      }
    },
    {
      context: ['/chat'],
      target: AppService.AppService,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/chat': '/apis/rag.openhydra.io/v1/'
      }
    },
    {
      context: ['/xinference'],
      target: AppService.AppService,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/xinference': '/apis/xinference.openhydra.io/v1/'
      }
    },
    {
      context: ['/apis/open-hydra-server.openhydra.io/extendV1/'],
      target: AppService.AppService,
      secure: false,
      changeOrigin: true
    },
    {
      context: ['/apis/open-hydra-server.openhydra.io/v1/'],
      target: AppService.AppService,
      secure: false,
      changeOrigin: true
    },
    {
      context: ['/baidu-trans'],
      target: AppService.baiduTrans,
      secure: false,
      changeOrigin: true
    }
  ]
};
