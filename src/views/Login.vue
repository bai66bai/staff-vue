<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="title">人员管理系统</div>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>

      </el-form>
    </el-card>
  </div>

</template>

<script lang="ts" setup>
import { ref ,watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { LocationQuery, LocationQueryValue } from 'vue-router';
import { useRouter } from 'vue-router';
import type { LoginForm } from '@/api/login/type';
import { userLogin } from '@/api/login'
import useStore from '@/stores';
import {setToken} from '@/utils/auth'


// router
const router = useRouter();
const formRef = ref();
const form = ref<LoginForm>({
  username: '',
  password: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '请输入2-10个字的用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '请输入6-18位的密码', trigger: 'blur' }
  ]
};

const redirect = ref<LocationQuery | LocationQueryValue | LocationQueryValue[]>()
const route = router.currentRoute
watch(route, () => {
  redirect.value = route.value.query && route.value.query.redirect
}, { immediate: true })


const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (valid) {

      const result = await userLogin(form.value)

      if (result.data.status === 200) {
        //将当前用户信息存入缓存
        setToken(result.data.data.access_token)
        useStore().sysUser.SET_TOKEN(result.data.data.access_token)
        router.push({ path: redirect.value as string || '/' })
        ElMessage.success('登录成功');
      } else {
        ElMessage.error(result.data.msg? result.data.msg : "登陆失败");
      };


    } else {
      ElMessage.error('请检查输入内容');
    }
  });
};

const onReset = () => {
  formRef.value?.resetFields();
};
</script>

<style scoped lang="less">
.login-container {
  height: 100vh;
  background-image: url(../assets/shouTu_w_01.png);
  background-repeat: no-repeat;
  background-size: cover;

  .login-card {
    text-align: center;
    border-radius: 20px;
    padding: 30px 10px;
    width: 450px;
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
  }

  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
    line-height: 4rem;
    letter-spacing: 0.5rem;
  }

  .el-button {
    width: 200px;
  }
}
</style>