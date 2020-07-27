<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>会员商城</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
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
                <!-- 是否有效生效 -->
                <template slot="isok" slot-scope="scope">
                    <i
                        class="el-icon-success"
                        style="color:lightgreen;"
                        v-if="scope.row.cat_deleted === false"
                    ></i>
                    <i class="el-icon-error" style="color:red;" v-else></i>
                </template>
                <!-- 第二个模板，排序级别 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="danger" v-else>三级</el-tag>
                </template>
                <template slot="option" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="fenleiBianji(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="openDelete(scope.row)">删除</el-button>
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
        <el-dialog title="添加分类" :visible.sync="addListDialogVisible" width="50%" @close="addCateDialogClosed">
            <el-form
                ref="addCateFormRef"
                :rules="addCateFormRules"
                :model="addCateForm"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader
                        v-model="selectedKeys"
                        expand-trigger="hover"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChanged"
                        clearable
                        change-on-select
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addListDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑分类" :visible.sync="addListDialogVisible1" width="50%" @close="addCateDialogClosed">
            <el-form
                ref="addCateFormRef"
                :rules="addCateFormRules"
                :model="addCateForm"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader
                        v-model="selectedKeys"
                        expand-trigger="hover"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChanged"
                        disabled
                        clearable
                        change-on-select
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addListDialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="bianjiCate">确 定</el-button>
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
        type: 3,
        pagenum: 1,
        pagesize: 3
      },
      catelist: [], // 商品分类的数据列表
      total: 0, // 总数据条数
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
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
      selectedKeys: []
    }
  },
  created () {
    this.getGoodsCategories()
  },
  methods: {
    // 获取商品分类数据!
    async getGoodsCategories () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单失败')
      }
      this.$message.error('成功获取订单数据')
      this.catelist = res.data.result
      this.total = res.data.total
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
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        // 判断valid 验证规则是否通过，
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        // 添加成功提示消息
        this.$message.success('添加分类成功')
        // 添加成功刷新列表
        this.getGoodsCategories()
        // 添加成功隐藏当前对话框
        this.addListDialogVisible = false
      })
    },
    async bianjiCate () {
      const { data: res } = await this.$http.put('categories/' + this.xiugaiId, {
        cat_name: this.addCateForm.cat_name
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
      this.addListDialogVisible1 = false
      this.getGoodsCategories()
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
      this.addCateForm.cat_name = e.cat_name
      this.xiugaiId = e.cat_id
      this.addListDialogVisible1 = true
    },
    async fenleiDelete (e) {
      const { data: res } = await this.$http.delete('categories/' + e.cat_id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsCategories()
    },
    openDelete (e) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '警告', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        this.fenleiDelete(e)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addFenlei {
    margin-bottom: 20px;
}
</style>
