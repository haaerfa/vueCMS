<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input placeholder="输入订单号查询" class="input-with-select" v-model="query" clearable @clear="queryOrderList" @keyup.enter.native="queryOrderList" style="width:500px">
        <el-button slot="append" icon="el-icon-search" class="serachBtn" @click="queryOrderList">
        </el-button>
      </el-input>
      <!-- 订单表 -->
      <el-table :data="orderList" style="width: 100%" fit stripe border>
        <el-table-column type="index" label=" ">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" min-width="200">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" min-width="50">
        </el-table-column>
        <el-table-column label="是否付款" min-width="80">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.order_pay===1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_send" label="是否发货" min-width="80">
        </el-table-column>
        <el-table-column label="下单时间" min-width="150">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" circle title="修改地址" @click="editDdressClick"></el-button>
          <el-button type="success" icon="el-icon-location" circle title="物流进度" @click="logisticClick"></el-button>
        </el-table-column>

      </el-table>
      <!-- 分页显示 -->
      <el-pagination :current-page.sync="queryInfo.pagenum" :page-size="queryInfo.pagesize" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <el-dialog title="修改订单地址" :visible.sync="adressdialogVisible" width="50%">
      <el-form ref="adressformRef" :model="adress" label-width="80px">
        <el-form-item label="省市区/县">
          <el-cascader :options="citydata" v-model="adress.cityAdress" :props="props" style="width:100%">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="adress.detailAdress"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="adressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adressdialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看物流信息 -->
    <el-dialog title="物流进度" :visible.sync="dialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in logistic" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import {FormatTime} from '../../common/utils.js'
import citydata from '@/common/citydata'
export default {
    data() {
        return {
        query:'',
        queryInfo:{
          pagenum:1,
          pagesize :6
        },
        total:0,
        orderList:[],
        citydata,
        adressdialogVisible:false,
        adress:{
          cityAdress:[],
          detailAdress:''
        },
        selectCity:[],
        props:{
          expandTrigger:'hover',
          label:'label',
          value:'value',
          chidren:'children'
        },
        dialogVisible:false,
        logistic:[]
        };
    },
    created() {
     this.getOrderList()
    },
     filters:{
   dateFormat(time){
     return FormatTime('yyyy-MM-dd hh:mm:ss',time*1000)
   }},
    methods: {
    queryOrderList(){
     this.queryInfo.query = this.query
     this.queryInfo.pagenum = 1
     this.getOrderList()
},
    
    //请求订单数据
    async getOrderList(){
      const {data : res} = await this.$http.get('orders',{
        params:this.queryInfo
      })
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    
},
handleCurrentChange(page){
  this.queryInfo.pagenum = page
  this.getOrderList()
},
editDdressClick(){
  this.adressdialogVisible = true
},
  async  logisticClick(){
    const {data :res} =  await this.$http.get('/kuaidi/1106975712662')
    if(res.meta.status !==200) return this.$message.error(res.meta.msg)
    this.logistic = res.data
    this.dialogVisible = true
   }   
    }
};
</script>

<style  lang="less" scoped>

</style>
