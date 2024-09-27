interface assetsServiceType {
  [x: string]: {
    url: string;
  };
}

const assetsService: assetsServiceType = {
  // CDN
  antdCss: { url: 'antd.min.4.4.2.css' },
  echartsJs: { url: 'echarts.min.4.8.0.js' },
  momentJs: { url: 'moment.min.2.27.0.js' },

  // images
  LoginBg: { url: 'homeBg.png' },
  HomeBg: { url: 'main.png' },

  // 告警提示音效
  alarm: { url: 'alarm.wav' },

  // files---例如一些下载模板等等
  DataTemplate: { url: 'DataTemplate.xls' }
};
export default assetsService;
