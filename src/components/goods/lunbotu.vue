<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员商城</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row class="addFenlei">
        <el-col>
          <el-button type="primary" @click="showAddListDialogVisible()">添加会员商城轮播图</el-button>
        </el-col>
      </el-row>
      <div class="img-box">
        <div class="img-box-list" v-for="item in lunbotuList" :key="item.id">
          <img :src="item.imgUrl" />
          <div class="option-box" @click="deleteImg(item.id)">
            <div>
              <i class="el-icon-delete"></i>删除
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog
      title="添加轮播图"
      :visible.sync="addListDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form ref="addCateFormRef" :model="addLunbo" label-width="100px">
        <el-form-item label="图片地址">
          <el-input v-model="addLunbo.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input v-model="addLunbo.commodity"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addLunbo.sort"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="addLunbo.createdTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addListDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLunboBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      lunbotuList: {},
      addLunbo: {
        imgUrl: '',
        commodity: '',
        sort: '',
        createdTime: '',
        token: ''
      },
      addListDialogVisible: false,
      token: ''
      //   seachValue: '',
      //   queryInfo: {
      //     query: '', // 查询的商品信息关键字
      //     pagenum: 1, // 查询的页数
      //     pagesize: 10 // 每页的数量
      //   },
      //   goodsList: [],
      //   total: 0
    }
  },
  created () {
    this.token = window.sessionStorage.getItem('token')
    this.getGoodsData()
  },
  methods: {
    async getGoodsData () {
      const { data: res } = await this.$http.get(
        'app-bwm-admin/getCarousel?token=' + this.token,
        {}
      )
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取轮播图列表失败')
      }
      this.$message.success('获取轮播图列表成功')
      this.lunbotuList = res.data.data

      //   if (res.meta.status !== 200) {
      //     return this.$message.error('获取商品列表失败')
      //   }
      //   this.$message.success('获取商品列表成功')
    },
    deleteImg (id) {
      this.$confirm('此操作将删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('app-bwm-admin/deleteCarousel?id=' + id + '&token=' + this.token, {})
        console.log(res)
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
        this.getGoodsData()

        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showAddListDialogVisible () {
      this.addListDialogVisible = true
    },
    async addLunboBtn () {
      let token = window.sessionStorage.getItem('token')
      this.addLunbo.token = token
      const { data: res } = await this.$http.get('app-bwm-admin/addCarousel', {
        params: this.addLunbo
      })
      console.log(res)
      console.log(this.addLunbo)
      if (res.code !== 200) {
        return this.$message.error('添加轮播图失败')
      }
      this.$message.success('添加轮播图成功')
      this.addListDialogVisible = false
      this.getGoodsData()
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .img-box-list {
        width: 300px;
        height: 200px;
        position: relative;
        margin: 0 30px 30px 30px;
        img {
            width: 100%;
            height: 100%;
        }
        .option-box {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 22px;
            font-weight: bold;
            color: #ffffff;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
        }
    }
    .img-box-list:hover {
        .option-box {
            opacity: 1;
        }
    }
}
</style>
