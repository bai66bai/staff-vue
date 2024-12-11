import request from '@/utils/request'
import type { Personnel , RuleForm } from './type'

//人员列表查询
export const getPersonnelList = (pageNum:number, pageSize:number , username?:string):ResponsePromise<PageInfo<Personnel>> => {
    
    return  request({
        url: '/user/list',
        method:"GET",
        params:{
            pageNum,
            pageSize,
            username
        }
    })
}


//新增人员信息
export const addPersonnel = (formDate:RuleForm):ResponsePromise<string> =>{

    return request({
        url: '/user/add',
        method:"POST",
        data:formDate
    })
}


//删除人员信息
export const deletePersonnel = (userId:number | any[]):ResponsePromise<string> =>{
    return request({
        url: '/user/' + userId,
        method:"DELETE"
    })
}

//根据id查询人员信息
export const selectPersonnelByUserId = (userId:number):ResponsePromise<RuleForm>=>{
    return request({
        url:'/user/' + userId,
        method:"GET"
    })
}


//修改人员信xi
export const updatePersonnel = (formDate:RuleForm):ResponsePromise<string> =>{
    return request({
        url: '/user/update',
        method:"PUT",
        data:formDate
    })
}