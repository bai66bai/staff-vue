/** 全局类型定义 */

/** 后端返回数据格式 */
declare interface ResponseRecord<T> {
    data    :T
    status  :number
    msg     :string
}

/** 封装后端响应promise */
declare type ResponsePromise<T> = 
    import('axios').AxiosPromise<ResponseRecord<T>>

/** 封装分页信息 PageInfo */
declare interface PageInfo<T extends Object = Object> {
    pageNum         :number,    // 当前页的页码
    pageSize        :number,    // 每页显示的条数
    size            :number,    // 当前页显示的真实条数
    total           :number,    // 总记录数
    pages           :number,    // 总页数
    prePage         :number,    // 上一页的页码
    nextPage        :number,    // 下一页的页码
    isFirstPage     :boolean,   // 是否为第一页
    isLastPage      :boolean,   // 是否为最后一页
    hasPreviousPage :boolean,   // 是否存在上一页
    hasNextPage     :boolean,   // 是否存在下一页
    navigatePages   :number,    // 导航分页的页数
    navigatePageNums:number[],  // 导航分页的页码
    list            :T[],        // 数据
    rows            :T[]         //数据
}

declare interface RouteRecordWhale extends RouteRecordRaw {
    permission?: string[]
    role?: string[]
  }
  
  /**
   * 路由信息
   */
  declare interface Routes {
    component?: RouteRecordWhale | string | Component | RouteRecordRaw
    hidden: boolean
    path: string
    children?: Routes[]
    alwaysShow?: boolean
    meta?: RoutesMeta
    name?: string
    redirect?: string
  }
  
  /**
   * 路由元信息
   */
  declare interface RoutesMeta {
    link: string
    noCache: boolean
    title: string
  }