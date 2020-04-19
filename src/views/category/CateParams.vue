<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon>
      </el-alert>
      <div class="cateCascader">
        <span>选择商品分类：</span>

        <el-cascader :options="cateList" :props="cateProps" style="width:40%" v-model="selectedKeys" @change="cascaderChange">
        </el-cascader>
      </div>
      <!-- 添加参数的tab区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="paramsClick">添加参数</el-button>
          <el-table :data="manyParamsList" style="width:100%" fit border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag :key="i" v-for="(item , i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(i , scope.row)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index" label="">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" min-width="100">
            </el-table-column>
            <el-table-column label="操作" min-width="150">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editpramsClick(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="paramsClick">增加属性</el-button>
          <el-table :data="onlyParamsList" style="width:100%" fit border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag :key="i" v-for="(item , i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(i , scope.row)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index" label="">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" min-width="100">
            </el-table-column>
            <el-table-column label="操作" min-width="150">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editpramsClick(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+title" :visible.sync="paramsDialogVisible" width="50%">
      <el-form ref="paramsFormRef" :model="paramsForm" label-width="80px" :rules="paramsRules">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+title" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editFormRef" :model="editParamsForm" label-width="80px" :rules="paramsRules">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
          cateList:[],
         cateProps:{
           expandTrigger: 'hover',
           value: 'cat_id',
           label: 'cat_name',
           children: 'children',
           
       },
       selectedKeys:[],
       isDisabled:true,
       activeName:'many',
       manyParamsList:[],
       onlyParamsList:[],
       paramsDialogVisible:false,
       paramsForm:{
         attr_name:''
       },
       paramsRules:{
         attr_name:[{required: true, message: '请输入分类名称', trigger: 'blur'}]
       },
       editDialogVisible:false,
       editParamsForm:{
         attr_name:''
       }
        }
        
    },
    computed:{
      cat_id(){
        return this.selectedKeys.length===3?this.selectedKeys[2]:null
      },
      title(){
        return this.activeName==='many'?'动态参数':"静态属性"
      }
    },
    created() {
      this.getCateList()
    },
    
    methods: {
      //获取分类列表
  async getCateList(){
    const {data:res} =await this.$http.get('categories')
    if(res.meta.status!==200) return this.$message.error('获取参数列表失败')
    this.cateList = res.data   
  },
  //监听级联选择器的改变
  cascaderChange(){
    if(this.selectedKeys.length!==3){
    this.selectedKeys = []  
    this.isDisabled = true 
    }
  else{
   this.isDisabled = false
   this.getParamsList()
  }
    },
     handleTabClick(){
       if(this.selectedKeys.length===3)   this.getParamsList()
     

    },
    //获取动态参数和静态参数列表
async getParamsList(){
  const {data:res} = await this.$http.get(`categories/${this.cat_id}/attributes`,
      {params:{sel:this.activeName}})     
      if(res.meta.status!==200) return 
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') :[]
        //控制文本框的显示和隐藏
        item.inputVisible = false
        //文本框的输入值
        item.inputValue = ''
      })
      if(this.activeName === 'many'){this.manyParamsList = res.data}
      else{this.onlyParamsList = res.data}
},
paramsClick(){
  this.paramsDialogVisible=true
  
},
addParams(){
  this.$refs.paramsFormRef.validate(async valid=>{
    if(!valid) return 
    const {data:res} =await this.$http.post(`categories/${this.cat_id}/attributes`,{
      attr_name:this.paramsForm.attr_name,
      attr_sel:this.activeName
    })
    if(res.meta.status !== 201) return this.$message.error("添加参数失败")
    this.$message.success("添加参数成功")
    this.getParamsList() 
    this.paramsDialogVisible = false
  })
},
//编辑参数
editpramsClick(info){
  this.editParamsForm = info
  
  this.editDialogVisible = true
},

editParams(){
this.$refs.editFormRef.validate(async valid=>{
  if(!valid) return
  const {data:res} = await this.$http.put(`categories/${this.cat_id}/attributes/${this.editParamsForm.attr_id}`,
  {attr_name:this.editParamsForm.attr_name,
  attr_sel:this.editParamsForm.attr_sel,
  })
  if(res.meta.status!==200) return this.$message.error('编辑参数失败')
  this.$message.success('编辑参数成功')
  console.log(res.data);
  this.editDialogVisible = false
})
},

//删除参数
async deleteParams(attrId){
 const confirmResult =await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
 if(confirmResult==='cancel') return this.$message.info('已取消删除')
 const {data :res} = await this.$http.delete(`categories/${this.cat_id}/attributes/${attrId}`)    
 if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
 this.$message.success('已成功删除参数')
 this.getParamsList()
},
//展开行标签方法----------------------------------------

//删除标签
handleClose(i , info){
  info.attr_vals.splice(i,1)
  this.addAttrVals(info)
},
//按下enter键或者失去焦点同步新标签,文本框变成标签
handleInputConfirm(info){
  info.inputVisible = false
  if(info.inputValue.trim().length===0) {
    info.inputValue=''
    return 
  }
  info.attr_vals.push(info.inputValue.trim())
  this.addAttrVals(info)
  info.inputValue = ''
},
//添加属性
async addAttrVals(info){
  const {data:res} = await this.$http.put(`categories/${this.cat_id}/attributes/${info.attr_id}`,{
    attr_name :info.attr_name ,
    attr_sel : this.activeName ,
    attr_vals :info.attr_vals .join(' ')
  })
  if(res.meta.status !==200) return this.$message.error('添加失败')
  this.getParamsList()
},
//点击添加新标签 变成文本框
showInput(info){
  info.inputVisible = true
  //必须在浏览器下次渲染之后再获取输入框 之前dom里面还没渲染出来
  this.$nextTick(()=>{
    this.$refs.saveTagInput.$refs.input.focus()
  })
  
}
}
}

</script>

<style  lang="less" scoped>
.cateCascader{
  margin-top: 15px;
  display: flex;
  align-items: center;
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
