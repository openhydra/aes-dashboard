import devServiceHost from './development/serviceHost.conf';
import betaBuild from './betaBuild/serviceHost.conf';
import prodServiceHost from './production/serviceHost.conf';
import apiService from './apiService.conf';
import assetsService from './assetsService.conf';

class Conf {
  get serviceHostConf () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
          return devServiceHost;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      } else if (process.env.NODE_ENV === 'production') {
          return prodServiceHost;
      } else {
          return betaBuild;
      }
  }

  get apiServiceConf() {
    return apiService;
  }

  // 静态资源URL
  assetsServiceConf(route: string | number) {
    // return this.serviceHostConf.staticHost + assetsService[route]?.url;
    return assetsService[route]?.url;
  }
}

const conf = new Conf();
export default conf;
