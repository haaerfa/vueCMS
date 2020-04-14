<template>
    <div id="login-container">
      <div class=login-box>
        <div class="logo">
      <img src="../../assets/img/cms.svg"  id="logoImg">
    </div>
   <!-- 登陆表单模块 -->
   <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
    <el-form-item prop="username" >
      <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" show-password prefix-icon="el-icon-lock"></el-input>
    </el-form-item>
    <el-form-item class="btns">
      <el-button type="primary" @click="login">登陆</el-button>
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
        login(){
      this.$refs.loginForm.validate(async valid=>{
        if(!valid) return false
        const {data:res} = await this.$http.post('login',this.loginForm)
        console.log(res);
        if(res.meta.status!==200) return this.$message.error('登陆失败')
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
  position: relative;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px; 
  .logo{
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    top:-50px;
    left:175px;
    background-color: #eee;
    border:10px solid #fff;
    box-shadow: 0 0 10px #eee;
    #logoImg{
      width: 100%;
      height: 100%;
    }
  }
}
.login-form{
  position: absolute;
  bottom: 30px;
  left: 10px;
  right: 10px;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
