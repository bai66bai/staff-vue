export interface Personnel{
    userId:number //人员 id
    username:string //人员姓名
    nickName:string //昵称
    gender:number   //xingbie
    avatarUrl:string //头像地址
    recruitSource: string//入职途径
    entryTime:string //入职时间
    birthday:string //出生日期
    bankAccount:string //银行账户
    politicalIdentity:string //政治面貌
    email:string //邮箱
    phone:string //手机号
    deptName:string //部门
    posName:string //岗位
    posIds:number[] //岗位id
}

export interface RuleForm {
    [x: string]: any
    userId:number |null
    username:string //人员姓名
    nickName:string //昵称
    gender:number |null   //xingbie
    recruitSource: string//入职途径
    entryTime: Date|null//入职时间
    birthday:Date|null //出生日期
    bankAccount:string //银行账户
    politicalIdentity:string //政治面貌
    email:string //邮箱
    phone:string //手机号
    posIds:number[] //岗位id
    }

    export  interface Profile {
        userId: number|null
        nickName: string
        phone: string
        email: string
        gender: string
        username: string
        createdTime: string
      }