<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员商城</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="goods_TopSeach">
        <el-button type="primary" @click="addGoodsShow=true">添加商品</el-button>
      </div>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="carousel" label="商品图" width="110px">
          <template v-slot="item">
            <!-- 前面数据源，后面用竖杠 调用过滤器 -->
            <img :src="item.row.carousel" width="80px" height="80px" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="商品价格(元)" width="80px"></el-table-column>
        <el-table-column prop="details" label="商品说明"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="170px">
          <template v-slot="item">
            <!-- 前面数据源，后面用竖杠 调用过滤器 -->
            {{item.row.createdTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="170px">
          <template v-slot="item">
            <el-tooltip
              class="item"
              v-if="!item.row.status==0"
              effect="dark"
              content="上架商品"
              placement="top-end"
            >
              <el-button type="success" icon="el-icon-sell" circle @click="shangjiaGoods"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              v-if="item.row.status==0"
              effect="dark"
              content="下架商品"
              placement="top-end"
            >
              <el-button type="warning" icon="el-icon-sold-out" circle @click="xiajiaGoods"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑商品" placement="top-end">
              <el-button type="primary" icon="el-icon-edit" circle @click="bianjiGoods"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除商品" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle @click="goodsDeleteBtn(item)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
      title="添加会员商品"
      :visible.sync="addGoodsShow"
      width="50%"
    >
      <el-form ref="addCateFormRef" :model="addGoodsForm" label-width="100px">
        <el-form-item label="商品名">
          <el-input v-model="addGoodsForm.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="addGoodsForm.hint"></el-input>
        </el-form-item>
        <el-form-item label="商品图">
          <el-input v-model="addGoodsForm.carousel"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-input v-model="addGoodsForm.details"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="addGoodsForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品库存量">
          <el-input v-model="addGoodsForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="商品排序">
          <el-input v-model="addGoodsForm.sort" placeholder="输入数字越大则越排前面"></el-input>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-input v-model="addGoodsForm.status"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsShow = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsBtn">确 定</el-button>
      </span>
    </el-dialog>

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
        token: '',
        page: 1 // 查询的页数
      },
      goodsList: [],
      total: 0,
      addGoodsShow: false,
      addGoodsForm: {
        carousel: '',
        createdTime: null,
        details: '',
        hint: '',
        id: null,
        price: null,
        sort: null,
        status: 0,
        stock: null,
        title: '',
        token: null,
        updatedTime: null
      }
    }
  },
  created () {
    this.getGoodsData()
    this.queryInfo.token = window.sessionStorage.getItem('token')
  },
  methods: {
    // 根据分类获取对应的商品列表
    async getGoodsData () {
      const { data: res } = await this.$http.get('getCommodity', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      this.goodsList = res.data.data
      // this.total = res.data.total
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
      const { data: res } = await this.$http.get('deleteCommodity?id=' + e.row.id + '&token=' + this.queryInfo.token)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsData()
    },
    goodsDeleteBtn (e) {
      console.log(e)
      this.$confirm('此操作将永久删除该分类, 是否继续?', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
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
    shangjiaGoods () {

    },
    xiajiaGoods () {

    },
    bianjiGoods () {

    },
    async addGoodsBtn () {
      // addCommodity
      const { data: res } = await this.$http.get('addCommodity', {
        params: this.addGoodsForm
      })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('添加商品失败')
      }
      this.$message.success('添加商品成功')
      this.getGoodsData()
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
