export interface Personnel {
  id: number; //人员 id
  username: string; //人员姓名
  gender: number; //xingbie
  avatarUrl: string; //头像地址
  birthday: string; //出生日期
  email: string; //邮箱
  phone: string; //手机号
  deptName: string; //部门
  posName: string; //岗位
  posIds: number[]; //岗位id
  status: string; //状态
  bankName: string; //银行名称
  bankCardAccount: string; //银行卡号
}

export interface RuleForm {
  [x: string]: any;
  id: number | null;
  username: string; //人员姓名
  gender: number | null; //性别
  birthday: Date | null; //出生日期
  email: string; //邮箱
  phone: string; //手机号
  posIds: number[]; //岗位id
  empId: string; //工号
  emergency: string; //紧急联系人
  emergencyPhone: string; //紧急联系人电话
}

export interface Profile {
  id: number | null;
  phone: string;
  email: string;
  gender: string;
  username: string;
  createdTime: string;
  empId: string;
  emergency: string;
  emergencyPhone: string;
  bankName: string;
  bankCardAccount: string;
}

export interface UserQueryParams extends QueryParams {
  username?: string;
  status?: string;
}
