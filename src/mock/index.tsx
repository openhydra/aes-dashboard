/**
 * @AUTHOR zhy
 * @DATE zhy (2022/04/05)
 * @Description:
 */
import Mock from 'mockjs';
import * as LoginApi from './login/login';

Mock.setup({ timeout: '1000' });

Mock.mock('/apis/open-hydra-server.openhydra.io/auth/login', 'post', LoginApi.login);
