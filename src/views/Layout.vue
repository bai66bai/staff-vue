<template>
    <!-- elementPlus中的容器 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!-- 菜单标签 -->
            <el-menu active-text-color="#ffd04b" background-color="#3b8eea"  text-color="#fff"
                router>
                <el-menu-item index="/personnel">
                    <el-icon>
                        <Avatar />
                    </el-icon>
                    <span>人员管理</span>
                </el-menu-item>
                <el-menu-item index="/personnel">
                    <el-icon>
                        <Avatar />
                    </el-icon>
                    <span>人员管理</span>
                </el-menu-item><el-menu-item index="/personnel">
                    <el-icon>
                        <Avatar />
                    </el-icon>
                    <span>人员管理</span>
                </el-menu-item><el-menu-item index="/personnel">
                    <el-icon>
                        <Avatar />
                    </el-icon>
                    <span>人员管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>当前登录：<strong>{{ sysUserName }}</strong></div>
                <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <RouterView></RouterView>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>骑鲸建筑-人员管理系统</el-footer>
        </el-container>
    </el-container>
</template>


<script setup>
import { Avatar,User,Crop,EditPen,SwitchButton,CaretBottom} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import useStore from '@/store'
import { storeToRefs } from 'pinia';

//pinia
const store = useStore();
const sysUserStore = store.sysUser
const { sysUserName} = storeToRefs(sysUserStore);




</script>




<style lang="scss" scoped>
.layout-container {
    background-color: #fff;
    height: 100vh; 
    width: 100vw;
    .el-aside {
        background-color: #3b8eea;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
            text-align: center;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
        height: 40px;
    }
}
</style>