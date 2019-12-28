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
                                ></el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                content="删除用户"
                                placement="top"
                                :enterable="false"
                            >
                                <el-button type="danger" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                content="分配角色"
                                placement="top-start"
                                :enterable="false"
                            >
                                <el-button type="warning" icon="el-icon-setting" circle></el-button>
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
            >
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
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
            addDialogVisible: false
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
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
