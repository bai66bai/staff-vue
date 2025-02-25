import type { AxiosRequestConfig } from 'axios'
import type { Config, GenericTreeNode, TreeNode } from './types.ts'
import axiosRequest from '@/utils/request'
import { ElMessage, ElLoading, type LoadingOptions } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.mjs'
import JSEncrypt from 'jsencrypt'

/**
 * 格式化时间
 * @param time 时间
 * @param pattern 格式化模板
 * @returns 格式化结果
 */
export function parseTime(time: object | string | number, pattern: string | null) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        .replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key: keyof typeof formatObj) => {
    let value: number | string = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value.toString() || '0'
  })
  return time_str
}

export function handleTree(
  data: TreeNode[],
  id: string = 'id',
  parentId: string = 'parentId',
  children: string = 'children',
): TreeNode[] {
  const config: Config = {
    id,
    parentId,
    childrenList: children,
  }

  const childrenListMap: { [key: string]: TreeNode[] } = {}
  const nodeIds: { [key: string]: TreeNode } = {}
  const tree: TreeNode[] = []

  for (const d of data) {
    const parentIdValue = d[config.parentId]
    if (!childrenListMap[parentIdValue]) {
      childrenListMap[parentIdValue] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentIdValue].push(d)
  }

  for (const d of data) {
    const parentIdValue = d[config.parentId]
    if (!nodeIds[parentIdValue]) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(node: TreeNode): void {
    if (childrenListMap[node[config.id]]) {
      node[config.childrenList] = childrenListMap[node[config.id]]
    }
    if (node[config.childrenList]) {
      for (const child of node[config.childrenList]) {
        adaptToChildrenList(child)
      }
    }
  }

  return tree
}

export function traverseTree<T extends { children: T[] }>(
  node: GenericTreeNode<T>,
  callback: (node: GenericTreeNode<T>) => void,
): void {
  // 处理当前节点
  callback(node)

  // 递归处理子节点
  node.children.forEach((child) => {
    traverseTree(child, callback)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) {
    return false
  }

  // 对两个数组进行排序
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()

  // 逐个元素进行比较
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) {
      return false
    }
  }

  return true
}

export function parseStrEmpty(str: string | null | undefined): string {
  if (!str || str == 'undefined' || str == 'null') {
    return ''
  }
  return str
}

export async function request<T>(
  axiosConfig: AxiosRequestConfig,
  wrConfig?: { successMsg?: string; loading?: boolean },
): ResponsePromise<T> {
  if (wrConfig?.loading) showLoading()

  const retPromise = axiosRequest(axiosConfig)
  const retRecord = await retPromise

  const successMsg = wrConfig?.successMsg
  if ((retRecord.status === 200 || 201) && successMsg) ElMessage.success(successMsg)

  hideLoading()

  return retPromise
}

/** 全局Loading */
let loadingInstance: LoadingInstance | null = null // 存储当前的加载实例

// 显示加载动画
const showLoading = (options: LoadingOptions = {}) => {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true, // 锁定屏幕，防止用户在加载过程中进行其他操作
      text: options.text || '加载中...', // 自定义加载提示文本
      background: options.background || 'rgba(0, 0, 0, 0.7)', // 自定义背景颜色
      spinner: options.spinner, // 自定义加载动画（可选）
      fullscreen: true, // 全屏模式
    })
  }
}

// 隐藏加载动画
export const hideLoading = () => {
  if (loadingInstance) {
    loadingInstance.close() // 关闭加载动画
    loadingInstance = null // 重置实例
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withLoading = (fn: (...fnArgs: any[]) => Promise<any>, options = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newFn = async (...args: any[]) => {
    try {
      showLoading(options) // 开始加载动画
      const result = await fn(...args) // 执行异步操作
      hideLoading() // 完成后隐藏加载动画
      return result // 返回结果
    } catch (err) {
      hideLoading() // 出现错误时也要隐藏动画
      throw err // 抛出错误给调用方处理
    }
  }
  return newFn // 返回封装后的新函数
}

const encryptor = new JSEncrypt()
encryptor.setPublicKey(import.meta.env.VITE_BASE_RSA_PUBLIC_KEY)

export function rasEncrypt(data: string): string | false {
  return encryptor.encrypt(data)
}
