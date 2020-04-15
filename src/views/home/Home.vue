<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div class="logo">
                <img src="../../assets/img/avater.svg" title="dengsiCode" class="avater">
                电商后台管理系统
            </div>
            <el-button type="info" @click="logout">退出登陆</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏菜单 -->
            <el-aside :width="isFold?'64px':'200px'">
                <!-- 折叠菜单按钮 -->
                 <div class="toggleMenu" @click="toggleFold" :title="!isFold?'折叠菜单':'展开菜单'">|||</div>
                <el-menu background-color="#333744"
                         text-color="#fff" 
                         active-text-color="#ffd04b"
                         unique-opened
                         :collapse="isFold"
                         :collapse-transition="false"
                         router
                         :default-active="activePath"
                         >
                  <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class = "item.icon"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.path" 
                                      v-for="subItem in item.children"
                                      :key="subItem.id"
                                      @click="menuItemClick(subItem.path)"
                                       >
                            <i class="el-icon-s-operation"></i>{{subItem.authName}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
               <keep-alive>
                <router-view></router-view>
               </keep-alive>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                icons: ['el-icon-user-solid', 'el-icon-s-tools', 'el-icon-shopping-bag-1',
                    'el-icon-s-order', 'el-icon-s-data'
                ],
                menuList:[],
                isFold:false,
                activePath:''

            };
        },
        created() {
            //获取侧边栏列表数据
            this.getMuneList()
        },
        mounted() {

        },
        methods: {
            //退出登陆
            logout() {
                sessionStorage.clear()
                this.$router.push('/login')
            },
            //获取侧边栏列表数据方法
            async getMuneList() {
                const {
                    data: res
                } = await this.$http.get('menus')
                this.menuList =res.data
                this.menuList.forEach((ele,index)=>{
                    // 为每个菜单动态添加icon类名
                    ele.icon = this.icons[index]
                })
                  
            },
            //点击折叠菜单按钮，切换isFold
            toggleFold(){
                this.isFold = !this.isFold
            },
          menuItemClick(index){
              this.activePath = index
          }
        }
    };
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #333744;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
    }

    .logo {
        height: 90%;
        font-size: 22px;
    }

    .avater {
        height: 100%;
        vertical-align: middle;
    }

    .el-aside {
        background-color: #333744;
        .el-menu{
            border-right:none;
        
    }
    .toggleMenu{
        padding:5px;
        background-color: #666;
        color: #fff;
        font-size: 18px;
        letter-spacing: .2rem;
        text-align: center;
        cursor: pointer;
    }
}
    .el-main {
        background-color: #EAEDF1;
    }
</style>