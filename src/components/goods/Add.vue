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
                                expandTrigger="hover"
                                :props="cateProps"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数上传数据添加商品 为啥从后台获取 。 失败。只能自己写</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">商品属性 上传数据添加商品 为啥从后台获取 。 失败。只能自己写</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="uploadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="qingqiutou"
                            :on-success="uploadSuccess"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                      <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                      <el-button type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <el-dialog title="图片预览" :visible.sync="dialogPreview" width="50%">
          <img :src="yulanPreview" alt="" class='yulanImageSize'>
        </el-dialog>
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
        goods_cat: [],
        pics: [],
        goods_introduce: ''
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
      cateLists: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 因为el-upload 内有自己内部封装的ajax请求。没有把我们main设置的默认请求附带的token值设置进去。所以会请求失败。可以用请求头把我们本身的token值带进去。
      qingqiutou: {
        Authorization: window.sessionStorage.getItem('token')
      },
      dialogPreview: false,
      yulanPreview: ''
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
    },
    // 点击预览图片操作 当前点击已上传文件名的钩子函数
    handlePreview (file) {
      this.yulanPreview = file.response.data.url
      this.dialogPreview = true
    },
    // 点击删除当前不满意的图片操作
    handleRemove (e) {
      // 获取当前点击的图片的地址
      const filePath = e.response.data.tmp_path
      // 从addfrom暂存发送信息里面找到 当前点击的图片地址，得到索引值
      let i = this.addForm.pics.findIndex(item => item.pic === filePath)
      // 从暂存信息里面删除当前索引值
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // on-success 是upload文件上传的成功钩子函数。将执行上传成功的文件组成一个对象，然后push到 要上文的数组对象中去。可添加多个图片
    uploadSuccess (e) {
      const picInfo = { pic: e.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 提交商品添加 编程式导航跳转出去
    addGoods () {
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      console.log(this.addForm)
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
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
    margin-left: 50px;
    width: 80%;
}
.yulanImageSize{
  width: 100%;
}
.el-button{
  margin-top: 12px;
}
</style>
