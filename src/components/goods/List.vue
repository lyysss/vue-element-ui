<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="goods_TopSeach">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsData">
                    <el-button slot="append" icon="el-icon-search"  @click="getGoodsData"></el-button>
                </el-input>
                <el-button type="primary" @click="addGoodsBtn">添加商品</el-button>
            </div>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="105px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="95px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="100px">
                    <template v-slot="item">
                        <!-- 前面数据源，后面用竖杠 调用过滤器 -->
                        {{item.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column prop label="操作" width="112px">
                    <template v-slot="item">
                        <el-tooltip class="item" effect="dark" content="编辑商品" placement="top-end">
                            <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除商品" placement="top-start">
                            <el-button type="danger" icon="el-icon-delete" circle @click="goodsDeleteBtn(item)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
            ></el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      seachValue: '',
      queryInfo: {
        query: '', // 查询的商品信息关键字
        pagenum: 1, // 查询的页数
        pagesize: 10 // 每页的数量
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsData()
  },
  methods: {
    // 根据分类获取对应的商品列表
    async getGoodsData () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页监听每页的显示数量
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsData()
    },
    // 监听分类的位置
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsData()
    },
    async goodsDelete (e) {
      const { data: res } = await this.$http.delete('goods/' + e.row.goods_id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsData()
    },
    goodsDeleteBtn (e) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '警告', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        this.goodsDelete(e)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addGoodsBtn () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
.goods_TopSeach {
    display: flex;
    margin-bottom: 20px;
    .el-input {
        width: 60%;
        margin-right: 20px;
    }
}
</style>
