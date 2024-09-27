/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET } from '@src/fetchUtil/fetchUtil';

export const getSummary = (params: any) =>
  GET('getSummary', null, params, false);
