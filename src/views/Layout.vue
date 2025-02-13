<template>
    <!-- elementPlus中的容器 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="230px">
            <div class="el-aside__logo"></div>
            <!-- 菜单标签 -->
            <el-menu active-text-color="#ffd04b" background-color="#344156" text-color="#fff"
                :default-active="activeMenu">
                <div id="side-items">
                    <SideBearItemView v-for="item in sidebarRouters" :key="item.path" :item="item" :basePath="item.path" />
                </div>
            
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>当前登录：<strong>{{ sysUserStore.name }}</strong></div>
                <el-dropdown @command="handleCommand" placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <!-- <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item> -->
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
import { Avatar, User, SwitchButton, CaretBottom, Postcard } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import avatar from '@/assets/default.png'
import useStore from '@/stores'
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import SideBearItemView from '@/components/SideBearItemView.vue';

//pinia
const route = useRoute();
const router = useRouter();
const sysUserStore = useStore().sysUser
const settingsStore = useStore().settings;
const permissionStore = useStore().permission;

const sidebarRouters = computed(() => permissionStore.routeRecord.sidebarRouters);
const activeMenu = computed(() => settingsStore.currentRoute);

// 监听路由变化，更新选中项
watch(() => route.path, (newPath) => {
    activeMenu.value = newPath;
});


//检测下拉框的点击指令
const handleCommand = (command) => {
    if (command === 'logout') {
        LogOut();
    }
}


const LogOut = () => {
    // 提示确认框
    ElMessageBox.confirm(
        '你确定要退出登录吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                sysUserStore.Logout({ sendRequest: true, routeLogin: true })
            } catch (error) {
                console.error('登出失败:', error);
                ElMessage({
                    type: 'error',
                    message: '退出登录失败，请稍后再试',
                });
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消退出',
            });
        });
};


</script>




<style lang="scss" scoped>
.layout-container {
    background-color: #fff;
    height: 100vh;
    width: 100vw;

    .el-aside {
        background-color: #344156;
        box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
        /* 只在右侧添加阴影 */
        margin-right: 10px;

        &__logo {
            margin: 20px 0;
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
            text-align: center;

            .el-menu-item {
                font-size: 18px;
            }
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dcdfe6;
        box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);

        /* 只在右侧添加阴影 */
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
    #side-items {
    height: calc(100% - 1rem);
    padding-top: 1rem;
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