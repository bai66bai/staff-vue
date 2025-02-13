<template>
    <div class="side-bar-item" v-if="!item.hidden">
      <template
        v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild?.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
        <el-menu-item v-if="!item.children || item.children.length === 0" :index="resolvePath(onlyOneChild!.path)"
          @click="selectMenu">
          {{ item.meta?.title }}
        </el-menu-item>
        <el-menu-item v-else :index="resolvePath(onlyOneChild!.path)" @click="selectMenu">
          {{ item.children[0].meta?.title }}
        </el-menu-item>
      </template>
  
      <el-sub-menu :index="resolvePath(item.path)" v-else popper-append-to-body>
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
  
        <side-bar-item-view v-for="(child, index) in item.children" :key="child.path + index" :item="child"
          :base-path="resolvePath(child.path)">
        </side-bar-item-view>
  
      </el-sub-menu>
    </div>
  </template>
  
  <script setup lang='ts'>
  import router from '@/router';
  import type { MenuItemRegistered } from 'element-plus';
  import path from 'path-browserify'
  import { ref } from 'vue';
  import type { RouteRecordRaw } from 'vue-router';
  
  const onlyOneChild = ref<RouteRecordRaw | null>(null)
  
  const props = defineProps<{
    item: RouteRecordRaw
    basePath: string
  }>()
  
  function selectMenu(item: MenuItemRegistered) {
    router.push(item.index)
  }
  
  function hasOneShowingChild(children: RouteRecordRaw[] | undefined, parent: RouteRecordRaw) {
  
    if (!children) {
      children = [];
    }
    const showingChildren = children.filter(item => {
      if (item.hidden) {
        return false
      } else {
        // Temp set(will be used if only has one showing child)
        onlyOneChild.value = item
        return true
      }
    })
  
    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
      return true
    }
  
    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
      onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
      return true
    }
  
    return false
  }
  
  function resolvePath(routePath: string) {
    return path.resolve(props.basePath, routePath)
  }
  </script>
  
  
  <style lang="scss" scoped>
  .side-bar-item {
  
    span {
      font-size: 1.3rem;
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
  
    .el-menu-item {
      font-size: 1.1rem;
      font-weight: 500;
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
  }
  </style>
  