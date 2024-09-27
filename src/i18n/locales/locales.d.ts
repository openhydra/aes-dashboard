/**
 * @AUTHOR liu.qing
 * @DATE (2022/08/11)
 * @Description: Define language pack format
 */

interface LocalItem {
  zh: string;
  tw: string;
  en: string;
  title?: string | Array<string>;
}
export type LocalItems = Array<LocalItem>;
