<template>
    <div>
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>

            <el-card class="box-card">
                <el-row :gutter="20">
                <el-col :span="10">
                        <el-input
                            placeholder="请输入内容"
                            v-model="queryInfo.query"
                            clearable
                            @clear="getUserList"
                        >
                            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                    </el-col>
                </el-row>

                <el-table :data="userList" stripe style="width: 100%">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="username" label="姓名"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="mobile" label="电话"></el-table-column>
                    <el-table-column prop="role_name" label="角色"></el-table-column>
                    <el-table-column prop="mg_state" label="状态">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.mg_state"
                                @change="stateChangge(scope.row)"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="170">
                        <template slot-scope="scope">
                            <el-tooltip
                                effect="dark"
                                content="修改信息"
                                placement="top-end"
                                :enterable="false"
                            >
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    :style="scope.row"
                                    circle
                                    @click="showChanggeUser(scope.row.id)"
                                ></el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                content="删除用户"
                                placement="top"
                                :enterable="false"
                            >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle
                                    @click="removeUserById(scope.row.id)"
                                ></el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                content="分配角色"
                                placement="top-start"
                                :enterable="false"
                            >
                                <el-button
                                    type="warning"
                                    icon="el-icon-setting"
                                    circle
                                    @click="fenpeiJueseBtn(scope.row)"
                                ></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagesize"
                    :page-sizes="[2, 5, 10]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                ></el-pagination>
            </el-card>

            <!-- 添加用户对话框 -->
            <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
            >
                <el-form
                    :model="addUsersFrom"
                    :rules="addUsersFromRules"
                    ref="addFromRef"
                    label-width="100px"
                >
                    <el-form-item label="用户账号" prop="username">
                        <el-input v-model="addUsersFrom.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password">
                        <el-input type="password" v-model="addUsersFrom.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addUsersFrom.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addUsersFrom.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="修改管理员资料"
                :visible.sync="changgeUser"
                width="50%"
                @close="editDialogClosed"
            >
                <el-form
                    ref="editFormRef"
                    :model="editForm"
                    :rules="editFormRules"
                    label-width="100px"
                >
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changgeUser = false">取 消</el-button>
                    <el-button type="primary" @click="editDialogCheck">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="分配角色" :visible.sync="fenpeiJuese" width="40%" @close="clearUserInfo">
                <p>当前的用户：{{nowUserInfo.username}}</p>
                <p>当前的角色：{{nowUserInfo.role_name}}</p>
                <p>
                    分配新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="fenpeiJuese = false">取 消</el-button>
                    <el-button type="primary" @click="setFenpeiJuese">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 添加用户管理员窗口的显示隐藏
      addDialogVisible: false,
      changgeUser: false,
      // 动态获取到最新的当前用户修改的自己的信息--修改按钮
      editForm: {},
      // 修改的表单验证规则。
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }
        ]
      },
      // 添加的用户信息表单
      addUsersFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加的用户信息表单 规则
      addUsersFromRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, max: 15, message: '账号的长度在4~15字符之间' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '账号的长度在6~18字符之间' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }
        ]
      },
      // 分配权限的显示与隐藏
      fenpeiJuese: false,
      // 当前需要被分配的用户的信息
      nowUserInfo: {},
      // 服务器请求的角色列表
      rolesList: [],
      // 已选择分配的用户id
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      // pageSize  每页条数 改变时会触发
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      // currentPage  当前页 改变时会触发
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async stateChangge (e) {
      const { data: res } = await this.$http.put(
        `users/${e.id}/state/${e.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        e.mg_state = !e.mg_state
        return this.$message.error('更新用户状态失败。')
      }
      this.$message.success('状态更新成功')
    },
    addDialogClosed () {
      this.$refs.addFromRef.resetFields()
    },
    // 点击按钮添加新用户并预校验
    addUser () {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return this.$message.error('表单未完整')
        // 验证通过可以发起请求添加用户了
        const { data: res } = await this.$http.post(
          'users',
          this.addUsersFrom
        )
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    async showChanggeUser (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data
      this.changgeUser = true
    },
    // 监听修改用户窗口的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户资料预验证并提交信息
    editDialogCheck () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('表单未完整')
        // 验证通过可以发起请求添加用户了
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败！')
        }
        this.changgeUser = false
        this.getUserList()
        this.$message.success('修改用户成功！')
      })
    },
    // 点击删除按钮。确认删除当前用户
    removeUserById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete('users/' + id)
            .then(() => {
              this.$message.success('删除用户成功！')
              this.getUserList()
            })
            .catch(() => {
              this.$message.error('删除用户失败')
            })
        })
        .catch(() => {
          this.$message.error('已取消删除操作')
        })
    },
    async fenpeiJueseBtn (userInfo) {
      this.nowUserInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色失败')
      }
      this.rolesList = res.data
      this.fenpeiJuese = true
    },
    // 点击按钮，put提交修改分配角色
    async setFenpeiJuese () {
      // 这里有BUG
      if (!this.selectedRoleId) {
        return this.$message.error('请勿重复分配')
      }
      const { data: res } = await this.$http.put(`users/${this.nowUserInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.fenpeiJuese = false
      this.getUserList()
    },
    // 关闭分配角色窗口后自动清空里面数据。
    clearUserInfo () {
      this.nowUserInfo = {}
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
