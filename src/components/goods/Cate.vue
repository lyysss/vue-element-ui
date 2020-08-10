<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员商城</el-breadcrumb-item>
      <el-breadcrumb-item>已付款待发货</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        show-index
        border
        :show-row-hover="false"
        index-text="#"
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="option" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-s-promotion"
            size="mini"
            @click="fenleiBianji(scope.row)"
          >发货</el-button>
          <!-- <el-button
            type="danger"
            icon="el-icon-more"
            size="mini"
            @click="openDelete(scope.row)"
          >待定</el-button>-->
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog
      title="确认发货"
      :visible.sync="addListDialogVisible1"
      width="50%"
      @close="addCateDialogClosed"
    >
      <div class="order-list">
        <div>
          <span>订单编号：</span>
          {{this.deliverGoods.orderNumber}}
        </div>
        <div>
          <span>商品名称：</span>
          {{this.deliverGoods.title}}
        </div>
        <div>
          <span>商品价格：</span>
          {{this.deliverGoods.price}}
        </div>
        <div>
          <span>商品数量：</span>
          {{this.deliverGoods.count}}
        </div>
        <div style="margin:10px 0">---</div>
        <div>
          <span>收货人：</span>
          {{this.deliverGoods.consignee}}
        </div>
        <div>
          <span>联系人电话：</span>
          {{this.deliverGoods.mobile}}
        </div>
        <div>
          <span>收货人地址：</span>
          {{this.deliverGoods.regionName}} / {{this.deliverGoods.regionAddress}}
        </div>
        <div>
          <span>地址补充：</span>
          {{this.deliverGoods.detailed}}
        </div>
        <div>
          <span>订单创建时间：</span>
          {{this.deliverGoods.createdTime*1000 | dateFormat}}
        </div>
        <div class="express-info">
          <span>快递信息：</span>
          <el-input v-model="deliverGoodsForm.shippingInformation" placeholder="请输入发货快递以及快递编号。"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addListDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="deliverGoodsBtn">确认发货</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询商品分类的条件
      querInfo: {
        token: '',
        status: 0,
        page: 0
      },
      catelist: [], // 商品分类的数据列表
      total: 0, // 总数据条数
      columns: [
        {
          label: '商品名称',
          prop: 'title'
        },
        {
          label: '商品价格',
          prop: 'price'
        },
        {
          label: '收货人',
          prop: 'consignee'
        },
        {
          label: '联系电话',
          prop: 'mobile'
        },
        {
          label: '收货地址',
          prop: 'regionAddress'
        },
        {
          label: '订单编号',
          prop: 'orderNumber'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      addListDialogVisible: false,
      addListDialogVisible1: false,
      addCateForm: {
        cat_pid: 0,
        cate_name: '',
        cat_level: 0
      },
      xiugaiId: null,
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 添加分类的获取要添加的头部数据
      parentCateList: [],
      // 添加分类的获取选择的当前id Name 数据名
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      deliverGoods: {},
      deliverGoodsForm: {
        token: '',
        orderNumber: '',
        shippingInformation: ''
      }
    }
  },
  created () {
    this.getGoodsCategories()
    this.querInfo.token = window.sessionStorage.getItem('token')
    this.deliverGoodsForm.token = window.sessionStorage.getItem('token')
  },
  methods: {
    // 获取商品分类数据!
    async getGoodsCategories () {
      const { data: res } = await this.$http.get(
        'app-bwm-admin/getOrders',
        {
          params: this.querInfo
        }
      )
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取订单失败')
      }
      this.$message.success('成功获取订单数据')
      this.catelist = res.data.data
    },
    // 分页改变触发
    handleSizeChange (page) {
      this.querInfo.pagesize = page
      this.getGoodsCategories()
    },
    // 分页数字点击触发
    handleCurrentChange (num) {
      this.querInfo.pagenum = num
      this.getGoodsCategories()
    },
    showAddListDialogVisible () {
      // 先获取需要的一级或者二级分类的名字。
      this.getParentCateList()
      // 在显示出来添加分类对话框
      this.addListDialogVisible = true
    },
    // 获取添加分类父级分类的一级二级菜单选项数据列表。
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取层级列表失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    parentCateChanged () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async deliverGoodsBtn () {
      console.log(this.deliverGoodsForm)
      this.deliverGoodsForm.orderNumber = this.deliverGoods.orderNumber
      if (this.deliverGoodsForm.shippingInformation) {
        const { data: res } = await this.$http.get(
          'app-bwm-admin/setOrderSend',
          {
            params: this.querInfo
          }
        )
        console.log(res)
        if (res.code !== 200) {
          return this.$message.error('发货失败')
        }
        this.$message.success('发货成功')
        this.addListDialogVisible1 = false
        this.getGoodsCategories()
      } else {
        this.$message.error('请输入发货信息')
      }
    },
    // 监听添加分类的弹出框关闭事件
    addCateDialogClosed () {
      // 清空form表单内的数据
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_name = ''
      // 清空显示的数据name
      this.selectedKeys = []
      // 清空已绑定到data里面的当前绑定等级和父类id
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 分类的编辑和删除
    fenleiBianji (e) {
      console.log(e)
      this.deliverGoods = e
      // this.addCateForm.cat_name = e.cat_name
      // this.xiugaiId = e.cat_id
      this.addListDialogVisible1 = true
    },
    async fenleiDelete (e) {
      const { data: res } = await this.$http.delete(
        'categories/' + e.cat_id
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsCategories()
    },
    openDelete (e) {
      // this.$confirm('此操作将永久删除该分类, 是否继续?', '警告', {
      //   confirmButtonText: 'YES',
      //   cancelButtonText: 'NO',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.fenleiDelete(e)
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     })
      //   })
    }
  }
}
</script>
<style lang="scss" scoped>
.addFenlei {
    margin-bottom: 20px;
}
.order-list {
    > div {
        margin: 6px 0;
        > span {
            font-weight: bold;
        }
    }
}
.express-info {
    display: flex;
    align-items: center;
    height: 60px;
    padding-top: 20px;
    > span {
        width: 120px;
    }
}
</style>
