import { SortSetting } from "./Api/SortSetting";

export interface QueryParams {
    page: number,
    sortSettings: SortSetting,
    search: string,
    filters: any
}