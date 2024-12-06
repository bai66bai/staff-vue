<template>
    <div class="bigbox">
      <!-- 搜索表单 -->
      <el-form :inline="true" class="form">
        <el-form-item>
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="success" :disabled="!selectedRow" @click="handleEdit">修改</el-button>
        <el-button type="danger" :disabled="!selectedRow" @click="handleDelete">删除</el-button>
      </div>
  
      <!-- 表格 -->
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f8f8f9'}"
        
        style="width: 100% ; height: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="userId" label="用户编号" width="150" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickName" label="用户昵称" />
        <el-table-column prop="deptName" label="部门" />
        <el-table-column prop="posName" label="岗位" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-link type="primary" @click="handleEdit(scope.row)"><el-icon><Edit /></el-icon>修改</el-link>
            <el-link type="danger" @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon>删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      v-model:current-page="pagination.pageNum"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[20, 30, 50]"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />
    </div>
     <!-- 添加弹出框 -->
     <el-dialog v-model="dialogFormVisible" :title="title" width="500"  @closed="resetForm(ruleFormRef)">
      <el-form 
        ref="ruleFormRef" 
        :model="formData" 
        :rules="rules"
        label-width="120px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="title === '修改人员信息'" v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="formData.nickName" placeholder="请输入昵称" />
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 入职来源 -->
        <el-form-item label="入职来源" prop="recruitSource">
          <el-input v-model="formData.recruitSource" placeholder="请输入入职来源" />
        </el-form-item>

        <!-- 入职时间 -->
        <el-form-item label="入职时间" prop="entryTime">
          <el-date-picker 
            v-model="formData.entryTime" 
            type="datetime" 
            placeholder="选择入职时间" 
            style="width: 100%;"
          />
        </el-form-item>

        <!-- 出生日期 -->
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker 
            v-model="formData.birthday" 
            type="date" 
            placeholder="选择出生日期" 
            style="width: 100%;"
          />
        </el-form-item>

        <!-- 银行账号 -->
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input v-model="formData.bankAccount" placeholder="请输入银行账号" />
        </el-form-item>

        <!-- 政治面貌 -->
        <el-form-item label="政治面貌" prop="politicalIdentity">
          <el-input v-model="formData.politicalIdentity" placeholder="请输入政治面貌" />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
      </el-button>
      <el-button  @click="dialogFormVisible = false">取消</el-button>
    </el-form-item>
      </el-form>
    <!-- <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false" >取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          提交
        </el-button>
      </div>
    </template> -->
  </el-dialog>
  
  </template>
  
  <script setup lang="ts">
  import { reactive, ref } from "vue";
  import { getPersonnelList,addPersonnel,deletePersonnel,selectPersonnelByUserId, updatePersonnel } from '@/api/personnel'
  import {Edit, Delete} from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
  import type { RuleForm } from "@/api/personnel/type";
      // 搜索表单
      const searchForm = reactive({
        username: "",
        phone: "",
      });
          // 分页数据
      const pagination = reactive({
        pageNum: 1,
        pageSize: 20,
        total: 3,
      });

//控制表单开关
      const dialogFormVisible = ref(false)
      // 表格数据
      let tableData = ref();
    //获取人员列表数据
      const getPersonnelAllList = async ()=>{
        const result = await getPersonnelList(pagination.pageNum,pagination.pageSize,searchForm.username)
        console.log(result.data.data.list);
        tableData.value = result.data.data.list
        pagination.pageNum = result.data.data.pageNum
        pagination.pageSize = result.data.data.pageSize
        pagination.total = result.data.data.total
      }

      getPersonnelAllList();
      
      // 选中的行
      const selectedRow = ref(null);
  
      // 搜索逻辑
      const handleSearch = () => {
        console.log("搜索条件：", searchForm);
        // 模拟搜索逻辑
        getPersonnelAllList();
      };
  
      // 重置搜索条件
      const handleReset = () => {
        searchForm.username = "";
        searchForm.phone = "";
        getPersonnelAllList();
      };
  
      // 新增
      const handleAdd = () => {
        title.value = "添加人员信息"
        dialogFormVisible.value = true
      };
  
 
      // 行选择变化
      const handleSelectionChange = (rows: any) => {
        selectedRow.value = rows[0] || null;
      };
  
      // 分页变化
      const handlePageChange = (page: number) => {
        pagination.pageNum = page;
        getPersonnelAllList();
      };
  
      const handlePageSizeChange = (size: number) => {
        pagination.pageSize = size;
        getPersonnelAllList();
      };

      const ruleFormRef = ref<FormInstance>()
      //定义变量 控制标题的引用
      const title = ref('')

      //添加
      const formData = reactive<RuleForm>({
        userId: null,
        username: '',
        nickName: '',
        gender: null,
        recruitSource: '',
        entryTime: null,
        birthday: null,
        bankAccount: '',
        politicalIdentity: '',
        email: '',
        phone: ''
      })


      //添加人员
        const addPersonnelMsg = async ()=>{
          const result = await addPersonnel(formData)
          ElMessage.success(result.data.msg?result.data.msg:'添加成功')
           //刷新页面
           getPersonnelAllList();
          dialogFormVisible.value = false
        }
      //提交表单
      const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
          if (valid) {
            console.log('submit!')
            //添加人员
            title.value === '添加人员信息'? addPersonnelMsg() : updatePersonnelMsg()
            
          } else {
            console.log('error submit!', fields)
          }
        })
      }

      //修改人员信息
      const updatePersonnelMsg = async ()=>{
         const result = await updatePersonnel(formData)

          ElMessage.success(result.data.msg?result.data.msg:'修改成功')
           //刷新页面
           getPersonnelAllList();
          dialogFormVisible.value = false
      }

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
    }


      const rules = reactive<FormRules<RuleForm>>({
          username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, message: '用户名最少为两个字', trigger: 'blur' }
          ],
          gender:[
            {
              required: true,
              message: '请选择性别',
              trigger: 'change'
            }
          ],
          entryTime:[
            {
              type: 'date',
              required: true,
              message: '请选择时间',
              trigger: 'change'
            }
          ],
          email:[
          {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "请输入有效的邮箱地址",  
                trigger: "blur",  
           },
          ],
          bankAccount:[
           {
            pattern:/^[1-9]\d{9,29}$/,
            message: "请输入正确的银行卡号",
            trigger:"blur"
           }
          ],
          phone:[
            {
              pattern:/^(?:(?:\+|00)86)?1[3-9]\d{9}$/ ,
                message: "请输入正确的手机号",  
                trigger: "blur", 
            }
          ]
      })


    // 删除人员模块
    const handleDelete = (row:{userId:number}) => {
          ElMessageBox.confirm(
        '你确定要删除吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async() => {
            //调用接口
        const result =  await  deletePersonnel(row.userId)
        
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          //刷新列表
          getPersonnelAllList();
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })
      };
  
    //点击修改查询数据通过 UserId查询数据 回显
     const handleEdit = async (row: {userId:number}) => {
          title.value = "修改人员信息"
          resetForm(ruleFormRef.value);
          dialogFormVisible.value = true
          const {data} = await selectPersonnelByUserId(row.userId)
          formData.userId = row.userId,
          formData.username = data.data.username,
          formData.birthday = data.data.birthday,
          formData.nickName = data.data.nickName,
          formData.gender = data.data.gender,
          formData.recruitSource = data.data.recruitSource,
          formData.bankAccount = data.data.bankAccount,
          formData.email = data.data.email,
          formData.phone = data.data.phone,
          formData.entryTime = data.data.entryTime,
          formData.politicalIdentity = data.data.politicalIdentity

          
      };

  </script>
  
  <style scoped>
  .bigbox{
    height: 85%;
  }
  .form {
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
  text-align: right; /* 左对齐 */
  margin-top: 10px;
}

  </style>
  