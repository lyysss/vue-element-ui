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

            <el-form
                :model="addForm"
                :rules="addFormrules"
                ref="addFormRef"
                label-width="100px"
                label-position="top"
            >
                <el-tabs v-model="active" tab-position="left" :before-leave="beforeTabLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <!-- 级联选择器 -->
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateLists"
                                expandTrigger='hover'
                                :props="cateProps"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      active: '0',
      activeName: {},
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: []
      },
      // 级联选择器的指定数据显示和内容和子选项
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addFormrules: {
        goods_name: [
          {
            required: true,
            message: '请输入添加的商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品的价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品的重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品的备货数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      cateLists: []
    }
  },
  created () {
    this.getGoodsFenlei()
  },
  methods: {
    async getGoodsFenlei () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.cateLists = res.data
      console.log(this.cateLists)
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
    },
    // el-tab 标签页的切换监听钩子函数。
    beforeTabLeave (a, b) {
      console.log('即将进入的是' + a)
      console.log('即将离开的是' + b)
    //   return false
    // 只要返回值是false 就会阻止切换标签页
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.el-steps {
    margin: 30px 0;
    font-size: 12px;
}
.el-form-item {
    margin-left: 30px;
    width: 80%;
}
</style>
