<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="8rem">
        <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergency">
            <el-input v-model="form.emergency" maxlength="11" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyPhone">
            <el-input v-model="form.emergencyPhone" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" maxlength="50" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName">
            <el-input v-model="form.bankName" maxlength="50" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCardAccount">
            <el-input v-model="form.bankCardAccount" maxlength="50" />
        </el-form-item>
        <el-form-item label="性别">
            <el-radio-group v-model="form.gender">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="0">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
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
    id: props.user.id,
    phone: '',
    email: '',
    gender: '',
    username: '',
    createdTime: '',
    empId: '',
    emergency: '',
    emergencyPhone: '',
    bankName: '',
    bankCardAccount: ''
})

const rules = reactive({
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
    ],
    emergency: [
        { required: true, message: '紧急联系人不能为空', trigger: 'blur' }
    ],
    bankName: [
        { required: true, message: '开户行不能为空', trigger: 'blur' }
    ],
    bankCardAccount: [
        { required: true, message: '银行卡号不能为空', trigger: 'blur' },
        {
            pattern: /^[0-9]{16,19}$/,
            message: '请输入正确的银行卡号',
            trigger: 'blur'
        }
    ],
    emergencyPhone: [
        { required: true, message: '紧急联系人电话不能为空', trigger: 'blur' },
        {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
        }
    ]
})

watch(() => props.user, (newVal) => {
    if (newVal) {
        form.phone = newVal.phone
        form.email = newVal.email
        form.gender = newVal.gender
        form.id = newVal.id
        form.emergency = newVal.emergency
        form.emergencyPhone = newVal.emergencyPhone
        form.bankName = newVal.bankName
        form.bankCardAccount = newVal.bankCardAccount
    }
}, { immediate: true, deep: true })

const submit = () => {
    formRef.value?.validate(valid => {
        if (valid) {
            updateProfile(form).then(() => {
                ElMessage.success('修改成功')
                emit('update:user', {
                    ...props.user,
                    phone: form.phone,
                    email: form.email,
                    gender: form.gender,
                    emergency: form.emergency,
                    emergencyPhone: form.emergencyPhone,
                    bankName: form.bankName,
                    bankCardAccount: form.bankCardAccount
                })
            })
        }
    })
}

</script>