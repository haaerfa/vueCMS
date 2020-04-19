<template>
    <div>
<!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品分类主体 -->
    <el-card>
      <el-button type="primary" size="mini" @click="addCateClick">添加分类</el-button>
      <tree-table  :data = "cateList"
                   :columns='columns'
                   show-index
                   index-text=""
                   stripe
                   border
                  :show-row-hover = "false"
                  :selection-type="false"
                  :expand-type="false"
                  class="treeTable"
      >
      <template v-slot:isOk = "scope">
       <i class="el-icon-success" style="color: green" 
       v-if="scope.row.cat_deleted===false"></i>
       <i class="el-icon-error" style="color: red" v-else></i>
      </template>
      <template v-slot:grade = scope>
        <el-tag type="success" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag type="primary" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
      <template v-slot:handle="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

      </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
      @current-change="handleCurrentChange"
      :current-page="queryParams.pagenum"
      :page-size="queryParams.pagesize"
      layout="total, prev, pager, next, jumper"
      background
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
   >
      <el-form ref="addCateformRef" label-width="80px" :model="addCateForm"  :rules="addCateFormRules" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"  ></el-input>
  </el-form-item>
   <el-form-item label="父类分类" >
   <el-cascader
            v-model="selectedKeys"
            :options="cascaderList"
            :props="cateProps"
            @change="parentCateChanged"
            clearable
            style="width: 100%"
          ></el-cascader>
   </el-form-item>
  </el-form>
   
      <div slot="footer">
        <el-button @click=" addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  
    </div>
 
</template>

<script>
export default {
    data() {
        return {
       cateList:[],
       queryParams:{
         type:3,
         pagenum:1,
         pagesize:8,
       },
       total:0,
      //  树状表的列
      columns:[
        {
          label: '分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          prop:'cat_deleted',
          type:'template',
          template:'isOk'
    
        },
        {
          lable:'等级',
          prop:'cat_level',
          type:'template',
          template:'grade'
        },
        {
          lable:'操作',
          type:'template',
          template:'handle'
        }
      ],
       addCatedialogVisible:false,
       //级联分类列表
       cascaderList:[ ],
       cateProps:{
         expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly:true
       },
       selectedKeys:[],
       addCateForm:{
         cat_pid:0,
         cat_name:'',
         cat_level:0
       },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
        }
      
       
    },
    created() {
     this.getCateList()
    },
   
    methods: {
     async getCateList(){
     const {data:res}  = await this.$http.get('categories',{params:this.queryParams})
     if(res.meta.status!==200) return this.$message.error(res.meta.msg)
     this.cateList = res.data.result
     this.total=res.data.total
     
     },
     //分页功能
     handleCurrentChange(newPage){
        this.queryParams.pagenum = newPage
        this.getCateList()
     },
     
    // 添加分类
    async addCateClick(){
      this.addCateForm.cat_name=''
      this.selectedKeys=[]
       const {data:res} = await this.$http.get('categories',{params:{type:2}})
       if(res.meta.status!==200) return this.$message.error(res.meta.msg)
       this.cascaderList = res.data
       
       this.addCatedialogVisible = true
       
    },
    parentCateChanged(){
     if(this.selectedKeys.length>0){
       this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
       this.addCateForm.cat_level = this.selectedKeys.length
     }else{
       this.addCateForm.cat_pid=0
       this.addCateForm.cat_level=0
     }
    },
    addCate(){
      this.$refs.addCateformRef.validate(async valid=>{
        if(!valid) return 
        const {data:res} = await this.$http.post('categories',this.addCateForm)
        if(res.meta.status!==201) return this.$message.error(res.meta.msg)
        this.$message.success('创建分类成功')
        this.addCatedialogVisible = false
      } )
    }
    }
};
</script>

<style  lang="less" scoped>
.treeTable{
  margin:20px 0;
  font-size: 14px;
}
  
</style>