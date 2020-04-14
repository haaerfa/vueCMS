<template>
    <div>
    <el-button type="info" @click="logout">退出登陆</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      logout(){
        sessionStorage.clear()
        this.$router.push('/login')
      }
    }
};
</script>

<style  lang="less" scoped>

</style>
