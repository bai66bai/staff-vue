<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6" :xs="24">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>个人信息</span>
                        </div>
                    </template>

                    <div>
                        <div class="text-center">
                            <userAvatar />
                        </div>
                        <ul class="list-group list-group-striped">
                            <li class="list-group-item">
                                <el-icon>
                                    <UserFilled />
                                </el-icon>用户名称
                                <div class="pull-right">admin</div>
                            </li>
                            <li class="list-group-item">
                                <el-icon>
                                    <Iphone />
                                </el-icon>手机号码
                                <div class="pull-right">15888888888</div>
                            </li>
                            <li class="list-group-item">
                                <el-icon>
                                    <Message />
                                </el-icon>用户邮箱
                                <div class="pull-right">135555555@163.com</div>
                            </li>
                            <li class="list-group-item">
                                <el-icon>
                                    <Calendar />
                                </el-icon>创建日期
                                <div class="pull-right">2025-01-22 12:31:35</div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18" :xs="24">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>基本资料</span>
                        </div>
                    </template>

                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="基本资料" name="userinfo">
                            <!-- <userInfo :user="user" /> -->
                        </el-tab-pane>
                        <el-tab-pane label="修改密码" name="resetPwd">
                            <resetPwd />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, UserFilled, Message, Iphone } from '@element-plus/icons-vue'

const activeTab = ref<string>('userinfo')

</script>




<style scoped>
.app-container {


    .list-group {
        padding: 0;
        margin: 0;
        list-style: none;
        border-top: 1px solid #ebeef5;

        .list-group-item {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid #ebeef5;
            font-size: 14px;
            color: #606266;

            .pull-right {
                margin-left: auto;
                /* 将内容推到右侧 */
                text-align: right;
                /* 文字右对齐 */
            }
        }
    }
}
</style>