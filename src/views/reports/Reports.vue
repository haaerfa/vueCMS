<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-card style="min-height:550px"> -->
      <div id="main" style="width: 1000px;height:550px;"></div>

    <!-- </el-card> -->
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
    data() {
        return {
          options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      result:{}
        };
    },
    created() {
    
    },
    async mounted() {
      const myChart = echarts.init(document.getElementById('main'))
      const {data:res} = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$message('获取折线图数据失败!')
        this.result = res.data
         this.result = _.merge(res.data ,this.options)  
      
       myChart.setOption( this.result)

    }
 
    
};
</script>

<style  lang="less" scoped>

</style>
