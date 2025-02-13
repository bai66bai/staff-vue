<template>
    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submit">保存</el-button>
        <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
      </el-form-item>
    </el-form>
  </template>

 <script setup lang="ts">
import { ref ,reactive} from 'vue';
import {ElMessage, ElMessageBox , type FormInstance} from 'element-plus';


interface UserForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Rule {
  required?: boolean;
  message?: string;
  trigger: string | string[];
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: Rule, value: string, callback: (error?: Error) => void) => void;
}

const user = ref<UserForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const form = ref<FormInstance>();

const equalToPassword = (rule: Rule, value: string, callback: (error?: Error) => void) => {
  if (user.value.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};


const rules = reactive<{ [key: string]: Rule[] }>({
  oldPassword: [
    { required: true, message: "旧密码不能为空", trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
    { 
      pattern: /^[^<>"'|\\]+$/, 
      message: "不能包含非法字符：< > \" ' \\\ |", 
      trigger: "blur" 
    }
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { validator: equalToPassword, trigger: "blur" }
  ]
});

//TODO: 提交表单 相关前端方法  后端接口待完成
const submit = () =>{
    
}



</script>