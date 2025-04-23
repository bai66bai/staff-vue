<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="8" :xs="24">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>个人信息</span>
                        </div>
                    </template>

                    <div>
                        <!-- <div class="text-center">
                            <UserAvatar />
                        </div> -->
                        <ul class="list-group list-group-striped">
                            <li class="list-group-item">
                                <el-icon>
                                    <UserFilled />
                                </el-icon>用户名称
                                <div class="pull-right">{{user.username}}</div>
                            </li>
                            <li class="list-group-item">
                                <el-icon>
                                    <CreditCard />
                                </el-icon>员工工号
                                <div class="pull-right">{{user.empId}}</div>
                            </li>
                            <li class="list-group-item">
                                <el-icon>
                                    <Iphone />
                                </el-icon>手机号码
                                <div class="pull-right">{{user.phone}}</div>
                            </li>
                            <li class="list-group-item">
                                <el-icon>
                                    <Message />
                                </el-icon>用户邮箱
                                <div class="pull-right">{{user.email}}</div>
                            </li>
                            <li class="list-group-item">
                                <el-icon>
                                    <Calendar />
                                </el-icon>创建日期
                                <div class="pull-right">{{user.createdTime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')}}</div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16" :xs="24">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>基本资料</span>
                        </div>
                    </template>

                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="基本资料" name="userinfo">
                            <UserInfo :user="user"  @update:user="user = $event" />
                        </el-tab-pane>
                        <el-tab-pane label="修改密码" name="resetPwd">
                            <ResetPwd />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref , onMounted } from 'vue';
import { Calendar, UserFilled, Message, Iphone ,CreditCard } from '@element-plus/icons-vue'
import ResetPwd from '@/views/profile/resetPwd.vue'
import UserInfo from '@/views/profile/userInfo.vue'
import { getProfile } from '@/api/personnel'
const activeTab = ref<string>('userinfo')

const user = ref({
    id: null as number | null,
    phone: '',
    email: '',
    gender: '0',
    username:'',
    createdTime: '',
    empId: '',
    emergency:'',
    emergencyPhone: '',
    bankName: '',
    bankCardAccount: ''
})


onMounted(async () => {
    await getProfileInfo();
});


//获取个人信息
const getProfileInfo = async () =>{
    const result = await getProfile()
    user.value = result.data.data ?? user.value
}

</script>




<style scoped>
.app-container {

    .text-center{
        text-align: center;
    }
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