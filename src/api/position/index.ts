import request from '@/utils/request'
import type { Position, PostRuleForm } from './type'

//岗位查询列表
export const getPositionList = (pageNum:number, pageSize:number , posName?:string , posCode?:string , status?:string):ResponsePromise<PageInfo<Position>> => {
    return request({
        url: '/staff/position/list',
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


//新增岗位信息
export const addPosition = (formDate:PostRuleForm):ResponsePromise<string> =>{

    return request({
        url: '/staff/position/add',
        method:"POST",
        data:formDate
    })
}


//修改岗位信息

export const updatePosition = (formDate:PostRuleForm):ResponsePromise<string> =>{
    return request({
        url: '/staff/position/update',
        method:"PUT",
        data:formDate
    })
}

//根据岗位ID查询岗位信息
export const selectPositionByPosId = (posId?:number):ResponsePromise<PostRuleForm>=>{
    return request({
        url : '/staff/position/' + posId,
        method:"GET"
    })
}

//删除岗位信息
export const deletePosition = (posId:number | any[]):ResponsePromise<string> =>{
    return request({
        url: '/staff/position/' + posId,
        method:"DELETE"
    })
}