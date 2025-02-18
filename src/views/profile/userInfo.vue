<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" maxlength="30" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" maxlength="50" />
        </el-form-item>
        <el-form-item label="性别">
            <el-radio-group v-model="form.gender">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="0">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"  @click="submit">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { updateProfile } from '@/api/personnel'
import { type Profile } from '@/api/personnel/type';



const props = defineProps<{
    user: Profile
}>()

const emit = defineEmits(['update:user'])

const formRef = ref<FormInstance>()
const form = reactive<Profile>({
    userId: props.user.userId,
    nickName: '',
    phone: '',
    email: '',
    gender: '',
    username: '',
    createdTime: ''
})

const rules = reactive({
    nickName: [
        { required: true, message: '用户昵称不能为空', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
        {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
        }
    ],
    phone: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
        }
    ]
})

watch(() => props.user, (newVal) => {
    if (newVal) {
        form.nickName = newVal.nickName
        form.phone = newVal.phone
        form.email = newVal.email
        form.gender = newVal.gender
        form.userId = newVal.userId
    }
}, { immediate: true, deep: true })

const submit = () => {
    formRef.value?.validate(valid => {
        if (valid) {
            console.log(form);
            
            updateProfile(form).then(() => {
                ElMessage.success('修改成功')
                emit('update:user', {
                    ...props.user,
                    phone: form.phone,
                    email: form.email,
                    gender: form.gender
                })
            })
        }
    })
}

</script>