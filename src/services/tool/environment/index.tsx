/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET } from '@src/fetchUtil/fetchUtil';


export const getSandboxes = ( params:any) =>
  GET('getSandboxes', null, params, false);
