<template>
    <div>
        <!-- 面包屑导航 -->

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 用户列表主体内容 -->

        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="10">
                    <!-- 搜索框 -->
                    <el-input placeholder="输入用户名查询" class="input-with-select" v-model="userParams.query" clearable
                        @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" class="serachBtn" @click=getUserList>
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表 -->
            <el-table :data="userList" stripe style="width: 100%" border fit>
                <el-table-column type="index" label="" width="50"></el-table-column>
                <el-table-column prop="username" label="用户名" min-width="150px">
                </el-table-column>
                <el-table-column prop="role_name" label="角色" min-width="100px">
                </el-table-column>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                      
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" min-width="180px">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="180px">
                </el-table-column>
                <el-table-column label="操作" min-width="180px">
                    <template v-slot="scope">
                        <el-tooltip content="编辑用户" placement="top" effect="light" enterable>
                            <el-button type="primary" icon="el-icon-edit" circle @click="editUserClick(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除用户" placement="bottom" effect="light" enterable>
                            <el-button type="danger" icon="el-icon-delete" circle  @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="分配角色" placement="top" effect="light" enterable>
                            <el-button type="warning" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页显示 -->
            <el-pagination :current-page.sync="userParams.pagenum" :page-size="userParams.pagesize"
                @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total"
                background>
            </el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" @close="dialogClose">
            <el-form :model="addUserInfo" status-icon :rules="addUserrules" ref="addUserRef" label-width="80px"
                >
                <!-- 用户表单 -->
                <el-form-item label="用户名" prop="username" >
                    <el-input type="text" v-model="addUserInfo.username" autocomplete="off"  ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="text" v-model="addUserInfo.password" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="email" v-model="addUserInfo.email" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input type="number" v-model="addUserInfo.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form :model="editUserInfo" status-icon :rules="addUserrules" ref="editUserRef" label-width="80px"
                >
                <!-- 用户表单 -->
                <el-form-item label="用户名" prop="username" >
                    <el-input type="text" v-model="editUserInfo.username" autocomplete="off"  disabled></el-input>
                </el-form-item>
                 <el-form-item label="邮箱" prop="email">
                    <el-input type="email" v-model="editUserInfo.email" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input type="number" v-model="editUserInfo.mobile" autocomplete="off"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false" >取 消</el-button>
                <el-button type="primary" @click="editUser" >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //请求用户列表的参数
                userParams: {
                    query: '',
                    pagenum: 1,
                    pagesize: 6
                },
                //用户列表数据
                userList: [],
                total: 0,
                dialogFormVisible: false,
                editDialogVisible:false,
                //添加的用户数据
                addUserInfo: {
                    username: 'yanfeifei',
                    password: 'yanfeifei',
                    email: '37773737@qq.com',
                    mobile: '17639820934'
                },
                // 修改用户的表单数据
                editUserInfo:{},
               
                //添加用户表单验证规则
                addUserrules: {
                    username:[{required:true , message:'请输入用户名' , trigger:'blur' },
                      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                     password:[{required:true , message:'请输入密码' , trigger:'blur' },
                      { pattern:/[a-zA-Z]\w{5,17}$/, message: '密码必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur' }
                    ],
                    mobile:[{required:true , message:'请输入手机号' , trigger:'blur' },{
                        pattern:/^1[3456789]\d{9}$/,
                        message:"请输入合法的手机号", trigger:'blur'
                    }],
                    
                      email:[{required:true , message:'请输入邮箱' , trigger:'blur' },
                    {type:'email', message:'请输入合法的邮箱',trigger:'blur'}],

                }
            }
        },
       
        created() {
            //获取用户列表
            this.getUserList();
        },
        mounted() {

        },
        methods: {
            async getUserList() {
                const {
                    data: res
                } = await this.$http.get('users', {
                    params: this.userParams
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败！')
                }
                this.userList = res.data.users
                this.total = res.data.total
            },
            //页码发生改变时
            handleCurrentChange(newPage) {
                this.userParams.pagenum = newPage
                this.getUserList()
            },
            //用户状态发生变化时数据库同步更新
            async userStateChange(user) {
                const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
                console.log(res)
                if (res.data.meta.status !== 200) return this.$message.error('更改用户状态失败')
            },
            //对话框关闭清空表单
            dialogClose(){
                this.$refs.addUserRef.resetFields()
            },
            //添加用户
            addUser(){
               this.$refs.addUserRef.validate(async valid=>{
                   if(!valid) return false
                   //数据合法将用户数据同步到数据库
                   const {data:res} =  await this.$http.post('users',this.addUserInfo)
                   console.log(res)
                   if(res.meta.status !==201) return this.$message.error(res.meta.msg)
                   this.$message.success('添加用户成功')
                   this.getUserList()
               })
            },
          //点击编辑用户按钮 显示编辑对话框
          editUserClick(info){
              this.editDialogVisible = true
              this.editUserInfo = info     
          },
          //将编辑的用户信息同步到数据库
          editUser(){
              this.$refs.editUserRef.validate(async valid=>{
                  if(!valid) return false
                  const res = await this.$http.put(`users/${this.editUserInfo.id}`,{
                      email:this.editUserInfo.email,
                      mobile:this.editUserInfo.mobile
                  })
                 if(res.data.meta.status !==200) return this.$message.error(res.data.meta.msg)
                  this.$message.success("修改用户成功")
                  this.getUserList()
              })
          },
          //关闭修改对话框的时候重置对话框
          editDialogClose(){
              this.$refs.editUserRef.resetFields()
          },
          //删除用户操作
          removeUserById(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
        }).then(async () => {
          const res =await  this.$http.delete('users/'+id)
         if(res.data.meta!==200) return this.$message.error(res.data.meta.msg)
         this.$message.success('删除用户成功')
         this.getUserList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })       
        })
          }
        }

    };
</script>

<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 20px;
    }

    .searchBtn:hover {
        background-color: #fff;
    }
</style>