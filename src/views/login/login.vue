<template>
    <div id="login-container">      
   <div class=login-box>
     <img src="../../assets/img/avater.svg" alt="dengsicode" class="avater">
   <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
    <el-form-item prop="username" >
      <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" placeholder="请输入用户名" ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" show-password prefix-icon="el-icon-lock"></el-input>
    </el-form-item>
    <el-form-item class="btns">
      <el-button  @click="login" style="background:#D7A26A;color:#fff;">登陆</el-button>
      <el-button type="info" @click="resetClick">重置</el-button>
    </el-form-item>
   </el-form>
      </div>
      
    </div>
</template>

<script>
export default {
    data() {
        return {
          loginForm:{
            username:'admin',
            password:'123456'
          },
          loginRules:{
            username:[ { required: true, message: '请输入用户名', trigger: 'blur' },
                       { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
             ],
            password:[ { required: true, message: '请输入用密码', trigger: 'blur' },
                       { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
             ] 
          }
           
        }
    },
  
    methods: {
      resetClick(){
        this.$refs.loginForm.resetFields()
      },
      //点击登陆按钮登陆
        login(){
      //验证数据格式是否符合
      this.$refs.loginForm.validate(async valid=>{
        if(!valid) return false
        //请求登陆数据
        const {data:res} = await this.$http.post('login',this.loginForm)
        if(res.meta.status!==200) return this.$message.error('登陆失败')
        //登陆成功保存token 跳转到首页
        sessionStorage.setItem('token',res.data.token)
        this.$message.success('登陆成功')
        this.$router.push('/home')
      })
    }
    }
  
};
</script>

<style  lang="less" scoped>
#login-container{
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box{
  text-align: center;
  position: relative;
  width: 400px;
  height: 500px;
  background-color: #fff;
  border-radius: 5px; 
  padding:50px
}
.avater{
  width:100px;
}
.login-form{
  position: absolute;
  bottom:50px;
  left:5px;
  right:5px;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
