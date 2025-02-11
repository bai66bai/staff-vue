<template>
    <div>
      <div class="user-info-head" @click="editCropper()"><img v-bind:src="options.img" title="点击上传头像" class="img-circle img-lg" /></div>
      <el-dialog :title="title" :visible.sync="open" v-model="open" width="800px" append-to-body @opened="modalOpened"  @close="closeDialog">
        <el-row>
          <el-col :xs="24" :md="12" :style="{height: '350px'}">
            <vue-cropper
              ref="cropper"
              :img="options.img"
              :info="true"
              :autoCrop="options.autoCrop"
              :autoCropWidth="options.autoCropWidth"
              :autoCropHeight="options.autoCropHeight"
              :fixedBox="options.fixedBox"
              :outputType="options.outputType"
              @realTime="realTime"
              v-if="visible"
            />
          </el-col>
          <el-col :xs="24" :md="12" :style="{height: '350px'}">
            <div class="avatar-upload-preview">
              <img :src="previews.url" :style="previews.img" />
            </div>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :lg="2" :sm="3" :xs="3">
            <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
              <el-button>
                选择
                <i class="el-icon-upload el-icon--right"></i>
              </el-button>
            </el-upload>
          </el-col>
          <el-col :lg="{span: 1, offset: 2}" :sm="2" :xs="2">
            <el-button @click="changeScale(1)"><el-icon><Plus /></el-icon></el-button>
          </el-col>
          <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
            <el-button @click="changeScale(-1)"><el-icon><Minus /></el-icon></el-button>
          </el-col>
          <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
            <el-button @click="rotateLeft()"><el-icon><RefreshLeft /></el-icon></el-button>
          </el-col>
          <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
            <el-button @click="rotateRight()"><el-icon><RefreshRight /></el-icon></el-button>
          </el-col>
          <el-col :lg="{span: 2, offset: 6}" :sm="2" :xs="2">
            <el-button type="primary" @click="uploadImg()">提 交</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { VueCropper } from 'vue-cropper';
import { debounce } from '@/utils/debounce';
import { ElMessage } from 'element-plus';
import { Minus, Plus, RefreshRight ,RefreshLeft } from '@element-plus/icons-vue';
import { uploadAvatar } from '@/api/personnel';


const open = ref(false);
const title = ref('修改头像');
const visible = ref(false);
//裁剪组件
const cropper:any = ref({});

const options = ref({
  img: '',  // 图片地址
  autoCrop: true,      // 是否显示裁剪框
  autoCropWidth: 200,  // 裁剪框宽度
  autoCropHeight: 200, // 裁剪框高度
  fixedBox: true,      // 固定裁剪框大小
  outputType: 'png',  // 返回的图片格式
  filename: 'avatar', // 上传图片文件名
});

const previews = ref<Record<string, any>>({}); // 预览图片
const resizeHandler = ref<Function | null>(null); //裁剪框大小改变时的回调函数


//编辑头像
const editCropper = () => {
  open.value = true;
};

//打开弹出层结束时的回调
const modalOpened = () => {

  visible.value = true;
  if(!resizeHandler.value) {
    resizeHandler.value = debounce(()  =>{
        refresh()
    },100)
  }
    window.addEventListener('resize', resizeHandler.value as EventListener);
};

//刷新组件
const refresh = () =>{
        cropper.value.refresh();
}

//覆盖默认的上传行为
const requestUpload = ()=>{}

//向左旋转
const rotateLeft = () => {
  cropper.value.rotateLeft();
};

//向右旋转
const rotateRight = () => {
  cropper.value.rotateRight();
};

//图片缩放
const changeScale = (scal:number) =>{
    scal = scal || 1;
    cropper.value.changeScale(scal);
}

//上传预处理
const beforeUpload = (File:File) => {
  if (File.type.indexOf("image/") == -1) {
    ElMessage.error('上传头像图片只能是 JPG 格式!');
  }else{
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.onload = (e) => {
      options.value.img = e.target?.result as string;
      options.value.filename = File.name;
    };
  }
};

//上传图片

const uploadImg = () => {
  cropper.value.getCropData((data: any) => {
    let formData = new FormData();
    formData.append("avatarfile", data, options.value.filename);
    uploadAvatar(formData).then(res => {
        open.value = false;
        //options.value.img = process.env.VUE_APP_BASE_API + res.imgUrl;
        //将头像存储到本地
        ElMessage.success('上传成功');
        visible.value = false;
    })
  });
}

//实时预览
const realTime = (data: any) => {
  previews.value = data
};

//关闭窗口
const closeDialog = () => {
  //从本地取出图片 this.options.img = store.getters.avatar
  visible.value = false;
  window.removeEventListener('resize', resizeHandler.value as EventListener);
};
</script>

<style scoped lang="scss">
.user-info-head {
  position: relative;
  display: inline-block;
  line-height: 120px;
  height: 120px;
}

.user-info-head:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
</style>