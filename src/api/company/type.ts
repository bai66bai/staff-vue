export interface CompanyForm{
    comId?:number,              //公司信息ID
    comName:string,             //公司名称
    organizationId?:string,      //组织ID
    socialCode:string,          //统一社会信用代码
    businessAddress:string,     //营业执照注册地址
    accountName:string,         //收款账户名称
    bankName:string,            //开户行名称
    bankAccount:string,         //银行账号
    legalRepresentative:string, //法人代表
    createTime?:string           //当前信息的创建时间
}

export interface DeptTree {
    id: number
    deptName: string
    children: DeptTree[]
  }