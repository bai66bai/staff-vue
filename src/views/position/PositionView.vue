<template>
    <div class="bigbox">
        <!-- 搜索表单 -->
        <el-form :inline="true" class="form">
            <el-form-item label="岗位编码：" label-width="85px">
                <el-input v-model="searchForm.posCode" placeholder="请输入岗位编码"></el-input>
            </el-form-item>
            <el-form-item label="岗位名称：" label-width="85px">
                <el-input v-model="searchForm.posName" placeholder="请输入岗位名称"></el-input>
            </el-form-item>
            <el-form-item label="状态：" label-width="85px">
                <el-select v-model="searchForm.status" clearable placeholder="岗位状态" style="width: 240px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
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
            <el-button type="primary" @click="handleAdd" plain> <el-icon style="margin-right: 5px;">
                    <Plus />
                </el-icon> 新增</el-button>
            <el-button type="success" :disabled="single" @click="handleEdit" plain> <el-icon style="margin-right: 5px;">
                    <Edit />
                </el-icon> 修改</el-button>
            <el-button type="danger" :disabled="multiple" @click="handleDelete" plain><el-icon
                    style="margin-right: 5px;">
                    <Delete />
                </el-icon> 删除</el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="tableData" :header-cell-style="{ background: '#f8f8f9' }" style="width: 100% ; height: 100%;"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column fixed prop="posId" label="岗位编号" />
            <el-table-column prop="posCode" label="岗位编码" />
            <el-table-column prop="posName" label="岗位名称" />
            <el-table-column prop="status" label="岗位状态">
                <template #default="scope">
                    <el-tag :type="scope.row.status == '0' ? 'primary' : 'danger'"
                        :style="{ width: '55px', height: '30px' }">
                        {{ scope.row.status == "0" ? '正常' : '停用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="创建时间">
                <template #default="scope">
                    {{ scope.row.createTime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-link type="primary" @click="handleEdit(scope.row)"><el-icon>
                            <Edit />
                        </el-icon>修改</el-link>
                    <el-link type="danger" @click="handleDelete(scope.row)"><el-icon>
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
    <el-dialog v-model="dialogFormVisible" :title="title" width="500" @closed="resetForm(ruleFormRef)">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="120px">
            <!-- 岗位名 -->
            <el-form-item label="岗位名称" prop="posName">
                <el-input v-model="formData.posName" placeholder="请输入岗位名称" />
            </el-form-item>

            <!-- 岗位编码 -->
            <el-form-item label="岗位编码" prop="posCode">
                <el-input v-model="formData.posCode" placeholder="请输入岗位编码" />
            </el-form-item>

            <!-- 岗位状态 -->
            <el-form-item label="岗位状态" prop="status">
                <el-radio-group v-model="formData.status">
                    <el-radio :value="'0'">正常</el-radio>
                    <el-radio :value="'1'">停用</el-radio>
                </el-radio-group>
            </el-form-item>

            <!-- 岗位备注 -->
            <el-form-item label="岗位备注" prop="description">
                <el-input v-model="formData.description" type="textarea" placeholder="请输入岗位备注" />
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
import { reactive, ref } from "vue";
import { getPositionList , addPosition , updatePosition , selectPositionByPosId , deletePosition} from "@/api/position"
import { Edit, Delete, Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus"
import type { PostRuleForm } from "@/api/position/type"
import Pagination from '@/components/Pagination/index.vue'
// 搜索表单
const searchForm = reactive({
    posName: "",
    posCode: "",
    status: "",
});

//选择框状态搜做选择框
const options = [
    {
        value: 0,
        label: '正常'
    },
    {
        value: 1,
        label: '停用'
    }
]

// 分页数据
const pagination = reactive({
    pageNum: 1,
    pageSize: 20,
    total: 0,
});

// 分页变化
const handlePageChange = (page: number) => {
    pagination.pageNum = page;
    getPositionAllList();
};

//页面显示条数变化
const handlePageSizeChange = (size: number) => {
    pagination.pageSize = size;
    getPositionAllList();
};

//控制表单开关
const dialogFormVisible = ref(false)
const single = ref(true) //控制修改
const multiple = ref(true) //控制批量删除
// 表格数据
let tableData = ref();

//获取岗位列表数据
async function getPositionAllList() {
    const result = await getPositionList(pagination.pageNum, pagination.pageSize, searchForm.posName, searchForm.posCode, searchForm.status);
    tableData.value = result.data.data.rows;
    pagination.total = result.data.data.total;
}

getPositionAllList();


// 搜索逻辑
const handleSearch = () => {
    getPositionAllList();
};

// 重置搜索条件
const handleReset = () => {
    searchForm.posName = "";
    searchForm.posCode = "";
    searchForm.status = "";
    getPositionAllList();
};

// 新增打开弹窗
const handleAdd = async () => {
    title.value = "添加岗位信息";
    dialogFormVisible.value = true
};


const ids = ref<any>([])

// 行选择变化
const handleSelectionChange = (rows: any[]) => {
    ids.value = rows.map(item => item.posId)
    single.value = rows.length != 1
    multiple.value = !rows.length
};



const ruleFormRef = ref<FormInstance>()
//定义变量 控制标题的引用
const title = ref('')

//添加
const formData = reactive<PostRuleForm>({
    posName: '',
    posCode: '',
    status: '0',
    description: ''
})

//添加岗位信息
const addPositionMsg = async () => {
    const result = await addPosition(formData)

    if(result.data.status !== 200){
        ElMessage.error(result.data.msg ? result.data.msg : '岗位添加失败')
    }else{
        ElMessage.success('岗位添加成功')
    //刷新页面
    getPositionAllList();
    }
    
    dialogFormVisible.value = false
}
//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            //添加人员
            title.value === '添加岗位信息' ? addPositionMsg() : updatePositionMsg()

        } else {
            console.log('error submit!', fields)
        }
    })
}


//点击修改查询数据通过 UserId查询数据 回显
const handleEdit = async (row: { posId: number }) => {
    title.value = "修改岗位信息";
    resetForm(ruleFormRef.value);
    dialogFormVisible.value = true
    const posId: number = row.posId || ids.value[0]
    const { data } = await selectPositionByPosId(posId);
    console.log(data);
    
    Object.assign(formData, data.data)
    console.log(formData);
};


//修改岗位信息
const updatePositionMsg = async () => {
    const result = await updatePosition(formData)

    if (result.data.status !== 200) {
        ElMessage.error(result.data.msg ? result.data.msg : '修改失败')
    } else {
        ElMessage.success('修改成功')
    }

    //刷新页面
    getPositionAllList();
    dialogFormVisible.value = false
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//表单校验
const rules = reactive<FormRules<PostRuleForm>>({
    posName: [
        { required: true, message: '岗位名称不能为空', trigger: 'blur' }
    ],
    posCode: [
        { required: true, message: '岗位编码不能为空', trigger: 'blur' }
    ]
})


// 删除岗位信息
const handleDelete = (row: { posId: number }) => {
    const posId: number | any[] = row.posId || ids.value
    ElMessageBox.confirm(
        '你确定要删除岗位编号为"' + posId + '"的数据吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {    
            //调用接口
           const result =  await deletePosition(posId)

           if(result.data.status == 200){
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            getPositionAllList();
           } else{
            ElMessage.error(result.data.msg ? result.data.msg : '删除失败')
           }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
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