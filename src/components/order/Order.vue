<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="12">
                    <el-input placeholder="请输入搜索的订单">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInof: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersList: [],
      total: null
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInof })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单失败')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
      console.log(this.ordersList)
      console.log(this.total)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
