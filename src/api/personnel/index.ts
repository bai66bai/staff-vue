import request from '@/utils/request'
import type { Profile, Personnel , RuleForm } from './type'

//人员列表查询
export const getPersonnelList = (pageNum:number, pageSize:number , username?:string , status?:string):ResponsePromise<PageInfo<Personnel>> => {
    
    return  request({
        url: '/staff/user/list',
        method:"GET",
        params:{
            pageNum,
            pageSize,
            username,
            status
        }
    })
}


//新增人员信息
export const addPersonnel = (formDate:RuleForm):ResponsePromise<string> =>{

    return request({
        url: '/staff/user/add',
        method:"POST",
        data:formDate
    })
}


//删除人员信息
export const deletePersonnel = (userId:number | any[]):ResponsePromise<string> =>{
    return request({
        url: '/staff/user/' + userId,
        method:"DELETE"
    })
}

//根据id查询人员信息
export const selectPersonnelByUserId = (userId?:number):ResponsePromise<RuleForm>=>{
    const url = userId ? '/staff/user/' + userId : '/staff/user'
    return request({
        url,
        method:"GET"
    })
}


//修改人员信xi
export const updatePersonnel = (formDate:RuleForm):ResponsePromise<string> =>{
    return request({
        url: '/staff/user/update',
        method:"PUT",
        data:formDate
    })
}

//重置人员密码变为初始值
export const resetPassword = (userId:number):ResponsePromise<string> =>{
    return request({
        url: '/staff/user/resetPwd/' + userId,
        method:"PUT"
    })
}




//退出登录
export const logout = ():ResponsePromise<string> =>{
    return request({
        url: '/logout',
        method:"POST"
    })
}


//上传头像
export const uploadAvatar = (data:any):ResponsePromise<string> =>{
    return request({
        url: '/staff/profile/avatar',
        method:"POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data:data
    })
}


//查询个人信息
export const getProfile = ():ResponsePromise<Profile> =>{
    return request({
        url: '/staff/user/profile',
        method:"GET"
    })
}


//修改个人信息
export const updateProfile = (formDate:Profile):ResponsePromise<string> =>{
    return request({
        url: '/staff/user/profile',
        method:"PUT",
        data:formDate
    })
}

//用户密码修改
export const updatePassword = (oldPassword:string, password:string):ResponsePromise<string> =>{
    const data = {
        oldPassword,
        password
    }
    return request({
        url: '/staff/user/updatePwd',
        method:"PUT",
        data : data
    })
}