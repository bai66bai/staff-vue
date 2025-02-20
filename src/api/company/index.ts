import request from "@/utils/request";

import type { CompanyForm } from "./type";

//公司列表查询
export const getCompanyList = (pageNum: number, pageSize: number, comName?: string): ResponsePromise<PageInfo<CompanyForm>> => {
    return request({
        url: '/staff/company/list',
        method: "GET",
        params: {
            pageNum,
            pageSize,
            comName
        }
    })
}


//新增公司信息
export const addCompanyInfo = (formDate: CompanyForm): ResponsePromise<string> => {

    return request({
        url: '/staff/company/add',
        method: "POST",
        data: formDate
    })
}


//删除公司信息
export const deleteCompanyInfo = (comId: number | any[]): ResponsePromise<string> => {
    return request({
        url: '/staff/company/' + comId,
        method: "DELETE"
    })
}


//根据id查询公司信息
export const selectCompanyByComId = (comId: number): ResponsePromise<CompanyForm> => {
    return request({
        url:'/staff/company/' + comId,
        method: "GET"
    })
}


//修改公司信息
export const updateCompanyInfo = (formDate: CompanyForm): ResponsePromise<string> => {
    return request({
        url: '/staff/company/update',
        method: "PUT",
        data: formDate
    })
}