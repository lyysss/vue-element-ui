<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-alert title="注意：只允许选择第三级的分类" type="warning"></el-alert>
            <span class="fenleiTitle">选择商品分类：</span>
            <el-cascader
                expand-trigger="hover"
                v-model="selectedCateKeys"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
            ></el-cascader>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="dialogAddShuxing=true"
                    >添加参数</el-button>
                    <el-table :data="manyTabData" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="item">
                                <el-tag
                                    v-for="(list,i) in item.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClose(i,item)"
                                >{{list}}</el-tag>
                                <!-- tag标签的新增输入框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="item.row.inputVisible"
                                    v-model="item.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(item)"
                                    @blur="handleInputConfirm(item)"
                                ></el-input>
                                <!-- tag标签的确认框 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(item)"
                                >+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" value="111"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="item">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="showDialogEditShuxing(item)"
                                >编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="deleteEditShuxing(item)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="dialogAddShuxing=true"
                    >添加属性</el-button>
                    <el-table :data="onlyTabData" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="item">
                              <!-- 渲染的tag标签 -->
                                <el-tag
                                    v-for="(list,i) in item.row.attr_vals"
                                    :key="i"
                                    closable
                                >{{list}}</el-tag>
                                <!-- tag标签的新增输入框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="item.row.inputVisible"
                                    v-model="item.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(item)"
                                    @blur="handleInputConfirm(item)"
                                ></el-input>
                                <!-- tag标签的确认框 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(item)"
                                >+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="item">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="showDialogEditShuxing(item)"
                                >编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="deleteEditShuxing(item)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog
            :title="'添加'+showTabData"
            :visible.sync="dialogAddShuxing"
            width="50%"
            @close="closeAddFrom"
        >
            <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
                <el-form-item :label="showTabData" prop="attr_name">
                    <el-input v-model="addFrom.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddShuxing = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            :title="'修改'+showTabData"
            :visible.sync="dialogEditShuxing"
            width="50%"
            @close="closeEditFrom"
        >
            <el-form :model="EditFrom" :rules="EditFromRules" ref="EditFromRef" label-width="100px">
                <el-form-item :label="showTabData" prop="attr_name">
                    <el-input v-model="EditFrom.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEditShuxing = false">取 消</el-button>
                <el-button type="primary" @click="EditParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // Tab标签页默认初始化显示页面
      activeName: 'many',
      manyTabData: [], // 动态参数的数据
      onlyTabData: [], // 静态属性的数据
      dialogAddShuxing: false,
      dialogEditShuxing: false,
      addFrom: {
        attr_name: ''
      }, // 添加参数的表单数据对象集合
      EditFrom: {
        attr_name: '',
        attr_id: 0
      },
      // 添加表单的验证规则对象。
      addFromRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      EditFromRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 级联选择框选中项变化，会触发这个函数
    async handleChange () {
      console.log(this.selectedCateKeys)
      // 发起请求获取动态参数和静态属性。
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        return this.$message('请先选择分类')
      } else {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: this.activeName }
          }
        )
        // params 是参数体。 sel 是API那些写好的标准。用来接收this.acticaName(only/many)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals
            ? item.attr_vals.split(' ')
            : []
          item.inputVisible = false
          item.inputValue = ''
        })
        console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTabData = res.data
        } else {
          this.onlyTabData = res.data
        }
      }
    },
    handleTabClick () {
      console.log(this.activeName)
      this.handleChange()
    },
    closeAddFrom () {
      this.$refs.addFromRef.resetFields()
    },
    closeEditFrom () {
      this.$refs.EditFromRef.resetFields()
    },
    // dialog弹出框确认提交信息
    addParams () {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return this.$message.error('未填写数据')
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加数据失败')
        }
        this.$message.success('添加数据成功')
        this.dialogAddShuxing = false
        this.handleChange()
      })
    },
    // 编辑当前点击的参数属性，把当前参数信息直接渲染到页面
    showDialogEditShuxing (e) {
      this.EditFrom.attr_id = e.row.attr_id
      this.EditFrom.attr_name = e.row.attr_name
      this.dialogEditShuxing = true
    },
    // 提交修改的信息。属性参数。
    EditParams () {
      this.$refs.EditFromRef.validate(async valid => {
        if (!valid) return this.$message.error('未填写数据')
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.EditFrom.attr_id}`,
          {
            attr_name: this.EditFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改数据失败')
        }
        this.$message.success('修改数据成功')
        this.dialogEditShuxing = false
        this.handleChange()
      })
    },
    // 删除当前点击的属性参数
    deleteEditShuxing (e) {
      this.EditFrom.attr_id = e.row.attr_id
      this.$confirm('此操作将永久删除该分类, 是否继续?', '警告', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      })
        .then(async e => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${this.EditFrom.attr_id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改数据失败')
          }
          this.$message.success('删除数据成功')
          this.handleChange()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // tag标签的失去焦点和回车键确认，新增事件
    async handleInputConfirm (item) {
      console.log(item)
      if (item.row.inputValue.trim().length === 0) {
        item.row.inputVisible = false
        item.row.inputValue = ''
        return console.log('输入错误参数')
      }
      // 如果没有执行上面的判断 说明输入的值合法，那就继续正常操作。向服务器发送数据
      item.row.attr_vals.push(item.row.inputValue.trim())
      item.row.inputValue = ''
      item.row.inputVisible = false
      this.saveAttrVals(item)
    },
    async saveAttrVals (item) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${item.row.attr_id}`,
        {
          attr_name: item.row.attr_name,
          attr_sel: item.row.attr_sel,
          // 这里attr_vals服务返回过来的是字符串，但是我们为了渲染分割成了数组。所以这里我们需要转换成字符串给服务器发送过去
          attr_vals: item.row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数失败')
      }
      this.$message.success('添加参数成功')
    },
    // 点击新增tag信息输入框
    showInput (e) {
      console.log(e)
      e.row.inputVisible = true
      // 让文本框自动获得焦点。
      // this.$nextTick 方法的作用，就是当前页面的元素被重新渲染之后，才会指定回调函数的代码
      this.$nextTick(_ => {
        // 不用解释
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 监听tag标签属性的 关闭事件，并执行删除操作
    handleClose (i, item) {
      item.row.attr_vals.splice(i, 1)
      this.saveAttrVals(item)
    }
  },
  // 计算属性
  computed: {
    // 判断选择的是否是第三级从而返回禁用与否
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    showTabData () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader {
    margin: 20px 0;
}
.el-tabs {
    margin: 20px 0;
}
.el-table {
    margin-top: 20px;
}
.el-tag {
    margin: 5px 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
