export interface Personnel{
    userId:number //人员 id
    username:string //人员姓名
    nickName:string //昵称
    gender:number   //xingbie
    avatarUrl:string //头像地址
    birthday:string //出生日期
    email:string //邮箱
    phone:string //手机号
    deptName:string //部门
    posName:string //岗位
    posIds:number[] //岗位id
    status:string //状态
}

export interface RuleForm {
    [x: string]: any
    userId:number |null
    username:string //人员姓名
    nickName:string //昵称
    gender:number |null   //性别
    birthday:Date|null //出生日期
    email:string //邮箱
    phone:string //手机号
    posIds:number[] //岗位id
    empId:string //工号
    emergency:string  //紧急联系人
    emergencyPhone:string //紧急联系人电话
    }

    export  interface Profile {
        userId: number|null
        nickName: string
        phone: string
        email: string
        gender: string
        username: string
        createdTime: string
        empId: string
        emergency: string
        emergencyPhone: string
      }