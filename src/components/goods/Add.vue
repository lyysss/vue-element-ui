<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="商品添加信息" type="info" effect="dark" show-icon :closable="false" center></el-alert>

            <el-steps :active="active-0" finish-status="success" align-center>
                <el-step title="基本属性"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-tabs v-model="active" tab-position="left">
                <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
                <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      active: '0',
      activeName: {}
    }
  },
  created () {},
  methods: {

  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.el-steps {
    margin: 30px 0;
    font-size: 12px;
}
</style>
