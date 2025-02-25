<template>
    <div class="bigbox">
        <!-- 搜索表单 -->
        <el-form :inline="true" class="form">
            <el-form-item label="公司名称：" label-width="85px">
                <el-input v-model="searchForm.comName" placeholder="请输入公司名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="handleSearch"><el-icon>
                        <Search />
                    </el-icon>搜索</el-button>
                <el-button @click="handleReset"><el-icon>
                        <Refresh />
                    </el-icon>重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div class="action-buttons">
            <el-button type="primary" @click="handleAdd" v-hasPermi="['staff:company:add']" plain> <el-icon style="margin-right: 5px;">
                    <Plus />
                </el-icon> 新增</el-button>
            <el-button type="success" :disabled="single" v-hasPermi="['staff:company:edit']" @click="handleEdit" plain> <el-icon style="margin-right: 5px;">
                    <Edit />
                </el-icon> 修改</el-button>
            <el-button type="danger" :disabled="multiple" v-hasPermi="['staff:company:delete']" @click="handleDelete" plain><el-icon
                    style="margin-right: 5px;">
                    <Delete />
                </el-icon> 删除</el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="tableData" :header-cell-style="{ background: '#f8f8f9' }" style="width: 100% ; height: 100%;"
            @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" fixed prop="comId" label="编码" />
            <el-table-column align="center" prop="comName" label="公司名称" />
            <el-table-column align="center" prop="socialCode" label="统一社会信任代码" />
            <el-table-column align="center" :show-overflow-tooltip="true" prop="businessAddress" label="营业执照注册地址" />
            <el-table-column align="center" prop="accountName" label="收款账户名称" />
            <el-table-column align="center" prop="legalRepresentative" label="公司法人" />
            <el-table-column align="center" prop="createdTime" label="信息创建时间">
                <template #default="scope">
                    {{ scope.row.createTime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template #default="scope">
                    <el-link type="primary" v-hasPermi="['staff:company:edit']" @click="handleEdit(scope.row)"><el-icon>
                            <Edit />
                        </el-icon>修改</el-link>
                    <el-link type="primary" v-hasPermi="['staff:company:delete']" @click="handleDelete(scope.row)"><el-icon>
                            <Delete />
                        </el-icon>删除</el-link>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Pagination :current-page="pagination.pageNum" :page-size="pagination.pageSize" :total="pagination.total"
            @update:currentPage="handlePageChange" @update:pageSize="handlePageSizeChange" />
    </div>



    <!-- 添加弹出框 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="50rem" @closed="resetForm(ruleFormRef)">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="9rem">
            <!-- 公司名 -->
            <el-form-item label="公司名称" prop="comName">
                <el-input v-model="formData.comName" placeholder="请输入公司名称" />
            </el-form-item>

            <el-form-item label="归属部门" prop="organizationId">
                <el-tree-select  v-model="formData.organizationId" check-strictly :data="deptTree"
                  :props="{ label: 'deptName', value: 'uniId' }" />
            </el-form-item>
            <!-- 统一社会信用编码 -->
            <el-form-item label="统一社会信用代码" prop="socialCode">
                <el-input v-model="formData.socialCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>

            <!-- 营业执照注册地址 -->
            <el-form-item label="营业执照注册地址" prop="businessAddress">
                <el-input v-model="formData.businessAddress" placeholder="请输入营业执照注册地址" />
            </el-form-item>

            <!-- 收款账户名称 -->
            <el-form-item label="收款账户名称" prop="accountName">
                <el-input v-model="formData.accountName" placeholder="请输入收款账户名称" />
            </el-form-item>

            <!-- 开户银行名称 -->
            <el-form-item label="开户银行名称" prop="bankName">
                <el-input v-model="formData.bankName" placeholder="请输入开户银行名称" />
            </el-form-item>

            <!-- 银行账户 -->
            <el-form-item label="银行账户" prop="bankAccount">
                <el-input v-model="formData.bankAccount" placeholder="请输入银行账户" />
            </el-form-item>

            <!-- 法人代表 -->
            <el-form-item label="法人代表" prop="legalRepresentative">
                <el-input v-model="formData.legalRepresentative" placeholder="请输入法人代表" />
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
import { getCompanyList, addCompanyInfo, updateCompanyInfo, selectCompanyByComId , deleteCompanyInfo , getDeptTree } from "@/api/company"
import { Edit, Delete, Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox,  type FormInstance, type FormRules } from "element-plus"
import Pagination from '@/components/Pagination/index.vue'
import type { CompanyForm } from "@/api/company/type";
import type { DeptTree } from "@/api/company/type";
// 搜索表单
const searchForm = reactive({
    comName: "",
});


// 分页数据
const pagination = reactive({
    pageNum: 1,
    pageSize: 20,
    total: 0,
});

// 分页变化
const handlePageChange = (page: number) => {
    pagination.pageNum = page;
    getCompanyAllList();
};

//页面显示条数变化
const handlePageSizeChange = (size: number) => {
    pagination.pageSize = size;
    getCompanyAllList();
};

//控制表单开关
const dialogFormVisible = ref(false)
const single = ref(true) //控制修改
const multiple = ref(true) //控制批量删除
// 表格数据
let tableData = ref();

//获取岗位列表数据
async function getCompanyAllList() {
    const result = await getCompanyList(pagination.pageNum, pagination.pageSize, searchForm.comName);
    tableData.value = result.data.data.rows;
    pagination.total = result.data.data.total;
}

//页面加载时获取数据
onMounted(async () => {
    getCompanyAllList();
    const deptRet = await getDeptTree();
    deptTree.value = [deptRet.data.data];
});

// 搜索逻辑
const handleSearch = () => {
    getCompanyAllList();
};

// 重置搜索条件
const handleReset = () => {
    searchForm.comName = "";
    getCompanyAllList();
};


//获取部门树
const deptTree = ref<DeptTree[]>([]);


interface Tree {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}


// 新增打开弹窗
const handleAdd = async () => {
    title.value = "添加公司信息";

    dialogFormVisible.value = true

};


const ids = ref<any>([])

// 行选择变化
const handleSelectionChange = (rows: any[]) => {
    ids.value = rows.map(item => item.comId)
    single.value = rows.length != 1
    multiple.value = !rows.length
};



const ruleFormRef = ref<FormInstance>()


//定义变量 控制标题的引用
const title = ref('')



//添加公司信息
const formData = reactive<CompanyForm>({
    comName: '',
    socialCode: '',
    businessAddress: '',
    organizationId: undefined,
    accountName: '',
    bankName: '',
    bankAccount: '',
    legalRepresentative: '',
})

//添加公司信息
const addCompanyMsg = async () => {
    const result = await addCompanyInfo(formData)

    if (result.data.status !== 200) {
        ElMessage.error(result.data.msg ? result.data.msg : '公司信息添加失败')
    } else {
        ElMessage.success('公司信息添加成功')
        //刷新页面
        getCompanyAllList();
    }

    dialogFormVisible.value = false
}
//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            //添加人员
            title.value === '添加公司信息' ? addCompanyMsg() : updateCompanyMsg()

        } else {
            console.log('error submit!', fields)
        }
    })
}


//点击修改查询数据通过 UserId查询数据 回显
const handleEdit = async (row: { comId: number }) => {
    title.value = "修改公司信息";
    resetForm(ruleFormRef.value);
    dialogFormVisible.value = true
    const comId: number = row.comId || ids.value[0]
    const { data } = await selectCompanyByComId(comId);

    Object.assign(formData, data.data)
};


//修改岗位信息
const updateCompanyMsg = async () => {
    const result = await updateCompanyInfo(formData)

    if (result.data.status !== 200) {
        ElMessage.error(result.data.msg ? result.data.msg : '修改失败')
    } else {
        ElMessage.success('修改成功')
    }

    //刷新页面
    getCompanyAllList();
    dialogFormVisible.value = false
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//表单校验
const rules = reactive<FormRules<CompanyForm>>({
    comName: [
        { required: true, message: '公司名称不能为空', trigger: 'blur' }
    ],
    organizationId:[
        { required: true, message: '归属部门不能为空', trigger: 'blur' }
    ],
    socialCode: [
        { required: true, message: '统一社会信任代码不能为空', trigger: 'blur' }
    ],
    businessAddress: [
        { required: true, message: '营业执照注册地址不能为空', trigger: 'blur' }
    ],
    accountName: [
        { required: true, message: '收款账户名称不能为空', trigger: 'blur' }
    ],
    bankName: [
        { required: true, message: '开户银行名称不能为空', trigger: 'blur' }
    ],
    bankAccount: [
        { required: true, message: '银行账户不能为空', trigger: 'blur' }
    ],
    legalRepresentative: [
        { required: true, message: '法人代表不能为空', trigger: 'blur' }
    ]
})


// 删除信息
const handleDelete = (row: { comId: number }) => {
    const comId: number | any[] = row.comId || ids.value
    ElMessageBox.confirm(
        '你确定要删除编号为"' + comId + '"的公司信息吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用接口
            const result = await deleteCompanyInfo(comId)

            if (result.data.status == 200) {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                //刷新列表
                getCompanyAllList();
            } else {
                ElMessage.error(result.data.msg ? result.data.msg : '删除失败')
            }
        })
        .catch((e) => {
            if(e == 'cannel'){
                ElMessage({
                type: 'info',
                message: '取消删除',
            })
            } 
        })
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