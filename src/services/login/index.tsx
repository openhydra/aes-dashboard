/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { POST } from '@src/fetchUtil/fetchUtil';

export const index = (body: any) => POST('getLogin', body, null, false);
