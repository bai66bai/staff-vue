import request from '@/utils/request'
import type { Position } from './type'

//岗位查询列表
export const getPositionList = (pageNum:number, pageSize:number , posName?:string , posCode?:string , status?:string):ResponsePromise<PageInfo<Position>> => {
    return request({
        url: '/position/list',
        method:"GET",
        params:{
            pageNum,
            pageSize,
            posName,
            posCode,
            status
        }
    })
}
