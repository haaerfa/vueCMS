<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center :closable="false" />

      <el-steps :active="activeTab-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="详细描述"></el-step>
      </el-steps>
      <!-- 侧边栏 -->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsRef" label-width="100px">
        <el-tabs tab-position="left" v-model="activeTab" :before-leave="beroreTabLeave" style="min-height:400px;" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类 " >
              <el-cascader :options="cateList" v-model="selectedKeys" :props="cascaderProps" style="width:500px" >
              </el-cascader>
            </el-form-item>
            <el-form-item label="商品名称 " prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
           <el-form-item label="商品价格 " prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量 " prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量 " prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品图片 " >
              <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePicturePreview" :on-remove="handleRemove" multiple :limit="9" :headers="uploadHeaders" :on-success="uploadSuccess" >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">最多只能上传9张图片</div>
              </el-upload>

            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
             <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id" >
              
               <el-tag :key="i" v-for="(item1 , i) in item.attr_vals" closable :disable-transitions="false" @close="handleClose(i,item.attr_vals)" effect="dark" type="success">
                  {{item1}}
                </el-tag>
                <el-input class="input-new-tag" v-if="item.inputVisible" v-model="item.inputValue" ref="tagInput"  @keyup.enter.native="handleInputConfirm(item)" @blur="handleInputConfirm(item)">
                </el-input>
                <el-button v-else class="button-new-tag" size="medium" @click="showInput(item)" type="success" plain>+ New Tag</el-button>
             </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name " v-for="item in onlyList" :key="item.attr_id" label-width="150px">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="详细描述" name="3">
             <quill-editor
    :content=" addGoodsForm.goods_introduce"
  />
  <el-button type="primary" style="margin:10px;" @click="addGoodsClick">点击上传</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog :visible.sync="picDialogVisible">
      <img width="100%" :src="previewUrl">
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
          activeTab:0,
          addGoodsForm:{
            goods_cat:[],
            goods_name:'',
            goods_price:0,
            goods_number:0,
            goods_weight:0,
            pics:[],
            attrs:[],
            goods_introduce:''
          },
           selectedKeys:[],
          addGoodsRules:{
            goods_name:[ { required: true, message:'请输入商品名称',trigger:'blur'}],
            goods_number:[ { required: true, message:'请输入商品数量',trigger:'blur'}],
            goods_price:[ { required: true, message:'请输入商品价格',trigger:'blur'}],
            goods_weight:[ { required: true, message:'请输入商品重量',trigger:'blur'}],

          },
         
          cascaderProps:{
            expandTrigger: 'hover',
            label:'cat_name' ,
            value:'cat_id',
            children:'children'
          },
          //上传图片数据
          uploadUrl:'http://timemeetyou.com:8889/api/private/v1/upload',
          uploadHeaders:{Authorization:sessionStorage.getItem('token')},
          previewUrl:'',
          picDialogVisible:false,
          manyList:[],
          onlyList:[],
         cateList:[]
        };
    },
    created() {
      this.getCate()
    },
    mounted() {

    },
    methods: {
     async getCate(){
       const {data:res} =await  this.$http.get('categories')
       if(res.meta.status !==200)  return this.$message.error(res.meta.msg)
       this.cateList = res.data
     },
     //没有选择商品分类之前阻止用户切换到其他tab栏
     beroreTabLeave(to,from){  
       if(from === '0' && this.selectedKeys.length!==3)
       {
         this.$message.error('请先选择商品分类')
         return false
       } },
       //上传图片
       handlePicturePreview(file){
         this.previewUrl = file.response.data.url
         this.picDialogVisible = true
       },  
       handleRemove(file){
         const tep_path = file.response.data.tep_path
         const i = this.addGoodsForm.pics.findIndex(item=>item.pic === tep_path  )
         this.addGoodsForm.pics.splice(i , 1)
         
       },
       uploadSuccess(response){
       const tmp_path = response.data.tmp_path
       this.addGoodsForm.pics.push({pic:tmp_path})    
     },
    async tabClick(){
      if(this.activeTab==='1'){
         const {data:res} = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes`,{params:{sel:'many'}})
        if(res.meta.status !==200) return this.$message.error(res.meta.msg)
         res.data.forEach(item=>{
           item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(',')
            item.inputVisible = false
           //文本框的输入值
           item.inputValue = ''
           })
         
         this.manyList = res.data
        
      }
       if(this.activeTab==='2'){
         const {data:res} = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes`,{params:{sel:'only'}})
         if(res.meta.status !==200) return this.$message.error(res.meta.msg)
         this.onlyList = res.data
        
      }
    },
    handleClose(i , item){
      item.splice(i,1)
    },
    showInput(info){
  info.inputVisible = true
  //必须在浏览器下次渲染之后再获取输入框 之前dom里面还没渲染出来
  this.$nextTick(()=>{
    this.$refs.tagInput.$refs.input.focus()
  })
},
handleInputConfirm(info){
  info.inputVisible = false
  if(info.inputValue.trim().length===0) {
    info.inputValue=''
    return 
  }
  info.attr_vals.push(info.inputValue.trim())
  info.inputValue = ''
},
//上传商品
addGoodsClick(){
  this.$refs.addGoodsRef.validate(async valid=>{
    if(!valid) return this.$message.error('请填写必填项')
    this.addGoodsForm.goods_cat = this.selectedKeys.join(',')
    this.manyList.forEach(item=>{
      const attrInfo = {
        attr_id:item.attr_id,
        attr_value: item.attr_vals.join(' ')
      }
      this.addGoodsForm.attrs.push(attrInfo)
    })
    this.onlyList.forEach(item=>{
      const attrInfo = {
        attr_id:item.attr_id,
        attr_value: item.attr_vals
      }
      this.addGoodsForm.attrs.push(attrInfo)
    })
    const {data:res} = await this.$http.post('goods' ,this.addGoodsForm)
    if(res.meta.status!==201) return this.$message.error(res.meta.msg)
    this.$message.success('上传商品成功')
    this.$router.push('/home/goods')   
  })
}
     
    }
}
</script>

<style  lang="less" scoped>
.el-steps{
  margin:25px 0; 
}
.el-input{
  width:500px;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 130px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  
</style>
