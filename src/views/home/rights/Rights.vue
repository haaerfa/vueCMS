<template>
    <div>
   <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-card>
       <el-table
        :data="rightsList"
        style="width: 100%"
        fit
        border
        stripe>
        <el-table-column label="" type="index"></el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称"
            min-width="150">
        </el-table-column>
        <el-table-column
            label="权限等级"
            min-width="150"
            :filter-method="filterHandler"
            :filters="[{text:'一级权限',value:0},{text:'二级权限',value:1},{text:'三级权限',value:2}]"
            >
            <template v-slot="scope"> 
                <el-tag type="success" v-if="scope.row.level==0">一级权限</el-tag>
                <el-tag type="warning" v-else-if="scope.row.level==1">二级权限</el-tag>
                <el-tag type="danger" v-else>三级权限</el-tag>
            </template>
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径"
            min-width="150">
        </el-table-column>
    </el-table> 
    </el-card>
    
    </div>
</template>

<script>
export default {
    data() {
        return {
        rightsList:[]
        };
    },
    created() {
     this.getRightsList()
    },
    
    methods: {
      async getRightsList(){
          const { data:res} = await this.$http.get('rights/list')
          if(res.meta.status!==200) return this.$message.error(res.mata.msg)
          this.rightsList = res.data
      },
    //根据权限等级筛选权限
       filterHandler(value, row) { 

         return row.level == value     
      }
    }
};
</script>

<style  lang="less" scoped>

</style>
