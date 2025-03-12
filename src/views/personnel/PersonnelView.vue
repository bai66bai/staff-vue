<template>
  <div class="bigbox">
    <!-- 搜索表单 -->
    <el-form :inline="true" class="form">
      <el-form-item label="用户名称：" label-width="85px">
        <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
            <el-date-picker v-model="createTimeRange" type="daterange" range-separator="-" value-format="YYYY-MM-DD"
              start-placeholder="开始日期" @change="handleRangeChange" end-placeholder="结束日期" unlink-panels />
          </el-form-item>
      <el-form-item>
        <el-button type="primary"  plain @click="handleSearch"><el-icon>
            <Search />
          </el-icon>搜索</el-button>
        <el-button @click="handleReset"><el-icon>
            <Refresh />
          </el-icon>重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" :header-cell-style="{ background: '#f8f8f9' }" style="width: 100% ; height: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" fixed prop="userId" label="用户编号" width="150" />
      <el-table-column align="center" prop="username" label="用户名" />
      <el-table-column align="center" prop="nickName" label="用户昵称" />
      <el-table-column align="center" prop="phone" label="手机号" />
      <el-table-column align="center" prop="status" label="状态">
        <template #default="scope">
                    <el-tag style="animation: none; transition: none;" :type="scope.row.status == '0' ? 'primary' : 'danger'"
                        :style="{ width: '55px', height: '30px' }">
                        {{ scope.row.status == "0" ? '在职' : '离职' }}
                    </el-tag>
                </template>
      </el-table-column>
      <el-table-column align="center" prop="createdTime" label="创建时间">
        <template #default="scope">
          {{ scope.row.createdTime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230">
        <template #default="scope">
          <el-link type="primary"  v-hasPermi="['staff:user:edit']" @click="handleEdit(scope.row)"><el-icon>
              <Edit />
            </el-icon>修改</el-link>
          <el-link type="primary" v-hasPermi="['staff:user:reset']" @click="handleResetPwd(scope.row)"><el-icon>
              <Key />
            </el-icon>重置密码</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination :current-page="searchForm.pageNum as number" :page-size="searchForm.pageSize as number" :total="total"
      @update:currentPage="handlePageChange" @update:pageSize="handlePageSizeChange" />
  </div>



  <!-- 添加弹出框 -->
  <el-dialog v-model="dialogFormVisible" :title="title" width="50rem" @closed="resetForm(ruleFormRef)">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="120px">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        {{ formData.username }}
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="formData.nickName" placeholder="请输入昵称" />
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 工号 -->
      <el-form-item label="工号" prop="empId">
        <el-input v-model="formData.empId" placeholder="请输入员工工号" />
      </el-form-item>

      <!-- 岗位 -->
      <el-form-item label="岗位" prop="posName">
        <el-select v-model="formData.posIds" multiple placeholder="请选择岗位">
          <el-option v-for="item in postOptions" :key="item.posId" :label="item.posName" :value="item.posId"
            :disabled="item.status == '1'" />
        </el-select>
      </el-form-item>

      <!-- 出生日期 -->
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker v-model="formData.birthday" type="date" placeholder="选择出生日期" style="width: 100%;" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>

      <!-- 紧急联系人 -->
      <el-form-item label="紧急联系人" prop="emergency">
        <el-input v-model="formData.emergency" placeholder="请输入紧急联系人" />
      </el-form-item>

      <!-- 紧急联系人电话 -->
      <el-form-item label="紧急联系人电话" prop="emergencyPhone">
        <el-input v-model="formData.emergencyPhone" placeholder="请输入紧急联系人电话" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getPersonnelList,selectPersonnelByUserId, updatePersonnel, resetPassword, syncPersonnel } from '@/api/personnel'
import { Edit, Search, Refresh, Key } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import type { RuleForm, UserQueryParams } from "@/api/personnel/type";
import Pagination from '@/components/Pagination/index.vue'
// 搜索表单
const searchForm = ref<UserQueryParams>({ pageNum: 1, pageSize: 20, params: {} });


const total = ref(0)
// 分页变化
const handlePageChange = (page: number) => {
  searchForm.value.pageNum = page;
  getPersonnelAllList();
};

//页面显示条数变化
const handlePageSizeChange = (size: number) => {
  searchForm.value.pageSize = size;
  getPersonnelAllList();
};

//控制表单开关
const dialogFormVisible = ref(false)
const single = ref(true) //控制修改
const multiple = ref(true) //控制批量删除
// 表格数据
let tableData = ref();
//获取人员列表数据
const getPersonnelAllList = async () => {
  const result = await getPersonnelList(searchForm.value)
  tableData.value = result.data.data.rows
  total.value = result.data.data.total
}

onMounted(() => {
  getPersonnelAllList();
  syncPersonnel();
});

//创建时间选择
const createTimeRange = ref<[string, string]>(['', ''])
function handleRangeChange() {
  searchForm.value.params.beginTime = createTimeRange.value[0]
  searchForm.value.params.endTime = createTimeRange.value[1]
}

// 搜索逻辑
const handleSearch = () => {
  getPersonnelAllList();
};

// 重置搜索条件
const handleReset = () => {
  searchForm.value.username = "";
  searchForm.value.status = "";
  searchForm.value.params = {}
  getPersonnelAllList();
};

// 新增
const handleAdd = async () => {
  title.value = "添加人员信息"
  const { data } = await selectPersonnelByUserId();
  postOptions.value = data.data.posts;
  dialogFormVisible.value = true
};


const ids = ref<any>([])

// 行选择变化
const handleSelectionChange = (rows: any[]) => {
  ids.value = rows.map(item => item.userId)
  single.value = rows.length != 1
  multiple.value = !rows.length
};



const ruleFormRef = ref<FormInstance>()
//定义变量 控制标题的引用
const title = ref('')
//定义岗位选项
interface PostOption {
  posId: number;
  posName: string;
  status: string;
}

const postOptions = ref<PostOption[]>([]);
//添加
const formData = reactive<RuleForm>({
  userId: null,
  username: '',
  nickName: '',
  gender: null,
  birthday: null,
  email: '',
  phone: '',
  posIds: [],
  emergency:'',
  emergencyPhone:'',
  empId:'',
  status: '0'
})

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updatePersonnelMsg()
    } else {
      console.log('error submit!', fields)
    }
  })
}

//修改人员信息
const updatePersonnelMsg = async () => {
  const result = await updatePersonnel(formData)

  if (result.data.status !== 200) {
    ElMessage.error(result.data.msg ? result.data.msg : '修改失败')
  } else {
    ElMessage.success('修改成功')
     //刷新页面
  getPersonnelAllList();
  }

 
  dialogFormVisible.value = false
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  formData.posIds = []
}

//表单校验
const rules = reactive<FormRules<RuleForm>>({
  username: [
    {  message: '请输入用户名', trigger: 'blur' },
    { min: 2, message: '用户名最少为两个字', trigger: 'blur' }
  ],
  email: [
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: "请输入有效的邮箱地址",
      trigger: "blur",
    },
  ],
  phone: [
    {
      pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    }
  ],
  emergencyPhone: [
    {
      pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    }
  ],
})

//重置人员密码模块
const handleResetPwd = (row: { userId: number }) => {
  ElMessageBox.confirm(
    '你确定要重置ID为 ' + row.userId + ' 的密码吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const userId: number = row.userId
      //调用接口
      const result = await resetPassword(userId)
      if (result.data.status !== 200) {
        ElMessage.error(result.data.msg ? result.data.msg : '重置失败')
      } else {
        ElMessage({
          type: 'success',
          message: '重置成功',
        })
      }
    })
    .catch((e) => {
      if (e == 'cancel') {
        ElMessage({
          type: 'info',
          message: '取消重置',
        })
      }
    })
};


//点击修改查询数据通过 UserId查询数据 回显
const handleEdit = async (row: { userId: number }) => {
  title.value = "修改人员信息";
  resetForm(ruleFormRef.value);
  dialogFormVisible.value = true
  const userId: number = row.userId || ids.value[0]
  const { data } = await selectPersonnelByUserId(userId);
  postOptions.value = data.data.posts;
  Object.assign(formData, data.data.data)
};

</script>

<style scoped>
.bigbox {
  height: calc(100vh - 285px);
}

.form {
  /* border-bottom: 1px solid #dcdfe6; */
  margin-bottom: 20px;
}

.action-buttons {
  margin-bottom: 20px;
}

.el-link {
  text-decoration: none;
  margin-right: 10px;
}

.el-pagination {
  text-align: right;
  /* 左对齐 */
  margin-top: 10px;
}
</style>