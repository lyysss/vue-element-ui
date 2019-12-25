<template>
    <div>
        <h1>this is home 鼻涕虫！</h1>
        <el-button type="info" @click="tuichu">退出</el-button>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        tuichu: function () {
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
