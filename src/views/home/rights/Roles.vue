<template>
    <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表内容区 -->
    <el-card>
            <el-button type="primary" size="mini"  @click="dialogAddRole =true" >添加角色</el-button>  
            <el-table
                :data="roleList"
                 style="width: 100%"
                fit
                border
                stripe            
                >
                <!-- 展开列 -->
                <el-table-column
                    type="expand" >
                    <template v-slot="scope">
                        <el-row v-for="(item1 , i1) in scope.row.children" :key="item1.id"
                                :class="['borderBottom',i1===0?'borderTop':'','vcenter']"  >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5" >
                             <el-tag closable @close="deleteRights(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>

                            </el-col>
                            <el-col :span="19">
                                <el-row     v-for="(item2 , i2) in item1.children" :key="item2.id"
                                   :class="[i2===0?'':'borderTop','vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="deleteRights(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                       <i class="el-icon-caret-right"></i>

                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id"
                                          closable @close="deleteRights(scope.row,item3.id)"
                                        >{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type=index  label="" width="50px">
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    label="角色名称"
                    min-width="100px">
                </el-table-column>
                 <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                    min-width="150px">
                </el-table-column>
                 <el-table-column
                    label="操作"
                    min-width="180px"
                  align="center">
                    <template v-slot="scope">
                     <el-button type="primary" circle @click="editRoleDialog(scope.row.id)">编辑</el-button>  
                     <el-button type="danger" circle @click="deleteRole(scope.row.id)">删除</el-button>  
                     <el-button type="warning" circle @click="rollatRightsClick(scope.row)">分配权限</el-button>                       
                    </template>
                </el-table-column>
            </el-table> 
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogAddRole" width="50%" @close="addDialogClose">
            <el-form :model="addRoleInfo" status-icon  ref="addRoleRef" label-width="80px"  :rules="addRoleRules"
                >
                <!-- 角色表单 -->
                <el-form-item label="角色名" prop="roleName" >
                    <el-input type="text" v-model="addRoleInfo.roleName" autocomplete="off"  ></el-input>
                </el-form-item>
                <el-form-item label="角色描述" >
                    <el-input type="text" v-model="addRoleInfo.roleDesc" autocomplete="off" ></el-input>
                </el-form-item>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddRole = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        
        <!-- 编辑角色的对话框 -->
        <el-dialog title="编辑角色" :visible.sync="dialogEditRole" width="50%" > 
            <el-form :model="editRoleInfo" status-icon  ref="editRoleRef" label-width="80px"  :rules="addRoleRules"
                >
                <!-- 角色表单 -->
                <el-form-item label="角色名" prop="roleName" >
                    <el-input type="text" v-model="editRoleInfo.roleName" autocomplete="off"  ></el-input>
                </el-form-item>
                <el-form-item label="角色描述" >
                    <el-input type="text" v-model="editRoleInfo.roleDesc" autocomplete="off" ></el-input>
                </el-form-item>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditRole = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配角色" :visible.sync="dialogallotRights" width="50%" > 
            <el-tree
               :data="rightsList"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="keyLefs"
               :props="treeProps"
               check-on-click-node
               ref="treeRef"
               >
        
           </el-tree>
               
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogallotRights = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
          roleList:[],
          //控制添加用户对话框的显示
          dialogAddRole:false,
          addRoleInfo:{
              roleName:'',
              roleDesc:''
          },
          addRoleRules :{
              roleName:
                  [{required:true , message:'请输入角色名' , trigger:'blur' },
                      { min: 2, max: 10, message: '长度在 2到 10 个字符', trigger: 'blur' }
                    ]
          },
          //控制编辑对话框的显示
          dialogEditRole: false,
          editRoleInfo: {},
          //控制分配角色对话框的隐藏
          dialogallotRights:false,
          roleId:'',
          rightsList:[],
          //选中的树节点     
          keyLefs:[],
          treeProps:{
              children:'children' ,
              label:'authName'
          }       
        }
    },
    created() {
    this.getRoleList()
    },
  
    methods: {
      async getRoleList(){
          const {data :res} =await this.$http.get('roles')
            if(res.meta.status !== 200) this.$message.error(res.meta.msg)
          this.roleList = res.data
      },
    //添加角色
     addRole(){
        this.$refs.addRoleRef.validate(async valid=>{
            if(!valid) return false
            const {data :res} =await this.$http.post('roles',this.addRoleInfo)
           
           if(res.meta.status !==201) return this.$message.error('添加角色失败')
           this.$message.success('添加角色成功')
           this.dialogAddRole = false
           this.getRoleList()
        })
    },
    addDialogClose(){    
        this.$refs.addRoleRef.resetFields()
    },
    // 编辑角色
   async  editRoleDialog(id){
     const { data: res } = await this.$http.get('roles/' + id)
     
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.editRoleInfo = res.data
      this.dialogEditRole = true
    },
    editDialogClose(){   
         this.$refs.editRoleRef.resetFields() 
    },
    editRole(){
        this.$refs.editRoleRef.validate(async valid=>{
            if(!valid) return false
            
            
            const {data:res} =await this.$http.put('roles/'+this.editRoleInfo.roleId,{
                roleName:this.editRoleInfo.roleName,
                roleDesc:this.editRoleInfo.roleDesc
            })
            if(res.meta.status !==200) return this.$message.error('修改失败')
            this.$message.success('修改成功')
            this.dialogEditRole = false
            this.getRoleList()
        })
    },
    //删除用户
   async deleteRole(id){
            const confirmResult=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
        }).catch(err=>err)
        if(confirmResult !=='confirm') 
        return this.$message.info('取消了删除')

        const res =await  this.$http.delete('roles/'+id)
         
         if(res.data.meta.status!==200) return this.$message.error(res.data.meta.msg)
         this.$message.success('删除角色成功')
         this.getRoleList()
          },
          //删除权限
          deleteRights(role , rightsId){
             this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`roles/${role.id}/rights/${rightsId}`).then((res)=>{
            role.children  = res.data.data   
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        })
        
          },
          //点击分配权限按钮之后获取权限树，显示对话框
          async rollatRightsClick(info){ 
             this.keyLefs=[]
              this.roleId = info.id
            
              const {data:res} = await this.$http.get('rights/tree')
              if(res.meta.status !==200) return this.$message.error('获取权限列表失败')
              this.rightsList = res.data
              //找出当前角色已经拥有的权限 权限id push到keyLeafs中
              this.findRightsID(info,this.keyLefs)
                this.dialogallotRights = true
          },
          findRightsID(node,arr){
              if(!node.children){
                return  arr.push(node.id)
              }
              node.children.forEach(ele=>{
                  this.findRightsID(ele,arr)
              })
          },
          //添加权限后同步到数据库
          async allotRights(){
               
         const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
 
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysStr})
          if(res.meta.status!==200) return this.$message.error('分配权限失败')
          this.$message.success('分配权限成功')
          this.getRoleList()
          this.dialogallotRights = false
          }
    }
    
};
</script>

<style  lang="less" scoped>

.el-tag{
    margin: 7px;
}
.borderTop{
    border-top:1px solid #eee;
}
.borderBottom{
    border-bottom:1px solid #eee;

}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
