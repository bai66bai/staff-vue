export interface TreeNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;  // 动态对象结构，节点可以包含任意属性
  }
  
  export interface Config {
    id: string;
    parentId: string;
    childrenList: string;
  }
  
  export type GenericTreeNode<T> = T & { children: GenericTreeNode<T>[] };
  
  