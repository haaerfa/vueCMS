<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="query" @keyup.enter.native="queryGoodsList" @clear="queryGoodsList">
            <el-button slot="append" icon="el-icon-search" class="serachBtn" @click="queryGoodsList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width:100%;font-size:13px;" fit stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="380"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="60"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="60"> </el-table-column>        
        <el-table-column prop="goods_weight" label="商品重量" width="60"> </el-table-column>
        <el-table-column label="创建时间" min-width='130'>
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click = editGoodsClick(scope.row)></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页显示 -->
      <el-pagination :current-page.sync="queryform.pagenum" :page-size="queryform.pagesize" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <el-dialog
      title="编辑商品"
      :visible.sync="editGoodsdialogVisible"
      width="50%"
     >
      <el-form ref="editGoods" :model="editGoodsform" label-width="80px" >
        <el-form-item label="商品名称">
          <el-input v-model="editGoodsform.goods_name" required></el-input>
        </el-form-item>
          <el-form-item label="商品价格">
          <el-input v-model="editGoodsform.goods_price" required></el-input>
        </el-form-item>
         <el-form-item label="商品数量">
          <el-input v-model="editGoodsform.goods_number" required></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="editGoodsform.goods_weight" required></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editGoodsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {FormatTime} from '../../common/utils'
export default {
    data() {
        return {
       queryform:{
         pagenum:1,
         pagesize:6
       },
       query:'',
       total:0,
       goodsList:[],
       editGoodsdialogVisible:false,
       editGoodsform:{},
        }
    },
    created() {
    this.getGoodsList()
    },
 filters:{
   dateFormat(time){
     return FormatTime('yyyy-MM-dd hh:mm:ss',time*1000)
   }
 },
    methods: {
      //获取商品列表
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{
        params:this.queryform
      })
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
      
     },
     //搜索
     queryGoodsList(){
            this.queryform.query =this.query
            this.queryform.pagenum=1
            this.getGoodsList()
          },
            //  分页
      handleCurrentChange(newPage){
        this.queryform.pagenum = newPage
       this.getGoodsList()
       },
      //删除商品 
      async deleteGoods(id){
          const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
        }).catch(err=>err)
        if(confirmResult !=='confirm') return this.$message.info('取消了删除')
        const {data:res} =await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200) this.$message.error(res.meta.msg)
        this.getGoodsList()
     
      },
      goAddPage(){
        this.$router.push('/home/goods/add')
      },
       //编辑商品
       editGoodsClick(row){
         this.editGoodsdialogVisible = true
         this.editGoodsform = row
       },
     editGoods(){
       this.$refs.editGoods.validate(async valid=>{
         if(!valid) return
         const {data:res} = await this.$http.put(`goods/${this.editGoodsform.goods_id}`,{
           goods_name:this.editGoodsform.goods_name,
           goods_price:this.editGoodsform.goods_price,
           goods_number:this.editGoodsform.goods_number,
           goods_weight:this.editGoodsform.goods_weight    
         })
         if(res.meta.status!==201) return this.$message.error(res.meta.msg)
         this.getGoodsList()
         this.editGoodsdialogVisible = false
       })
      }



    }
}
</script>

<style  lang="less" scoped>

</style>
