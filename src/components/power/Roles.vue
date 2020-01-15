<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row class="addOneJuese">
                <el-col>
                    <el-button type="primary" @click="addUser(0)">添加角色</el-button>
                </el-col>
            </el-row>

            <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="50%"
                center
                @close="addDialogClosed"
            >
                <el-form
                    :model="addJueseFrom"
                    :rules="addJueseFromRules"
                    ref="addFromRef"
                    label-width="80px"
                >
                    <el-form-item label="角色名" prop="roleName">
                        <el-input
                            v-model="addJueseFrom.roleName"
                            :disabled="this.changeNowId !== 0?true:false"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addJueseFrom.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="tijiaoJuese">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 角色列表 -->
            <el-table :data="rolelist" border stripe style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row
                            :class="['borderBottom',i1===0?'borderTop':'','vcenter']"
                            v-for="(item1,i1) in scope.row.children"
                            :key="item1.id"
                        >
                            <el-col :span="5">
                                <el-tag
                                    closable
                                    @close="removeRightByid(scope.row,item1.id)"
                                >{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row
                                    :class="[i2===0?'':'borderTop','vcenter']"
                                    v-for="(item2,i2) in item1.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            type="success"
                                            closable
                                            @close="removeRightByid(scope.row,item2.id)"
                                        >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            closable
                                            @close="removeRightByid(scope.row,item3.id)"
                                            type="warning"
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                        >{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            v-if="scope"
                            icon="el-icon-edit-outline"
                            @click="addUser(scope.row.id,scope.row.roleName,scope.row.roleDesc)"
                        >编辑</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="removeJueseById(scope.row.id)"
                        >删除</el-button>
                        <el-button
                            size="mini"
                            type="warning"
                            icon="el-icon-setting"
                            @click="showSetRightDialog(scope.row)"
                        >分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 显示隐藏的权限弹出框 -->
            <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
            >
                <el-tree :data="rightsList" :props="rightListProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            rolelist: [],
            centerDialogVisible: false,
            addJueseFrom: {
                roleName: '',
                roleDesc: ''
            },
            addJueseFromRules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入角色名',
                        trigger: 'blur'
                    },
                    { min: 2, max: 11, message: '账号的长度在2~11字符之间' }
                ]
            },
            changeNowId: 0,
            changeNowName: '',
            changeNowDesc: '',
            // 分配权限弹出框的显示与隐藏
            setRightDialogVisible: false,
            // 分配权限弹出框里面的全部权限数据
            rightsList: [],
            // 分配权限弹出框的树状控件渲染条件
            rightListProps: {
                children: 'children',
                label: 'authName'
            },
            // 通过递归得到的已有的权限的id数组
            defKeys: [],
            // 当前点击的对象用户 点击分配权限的时候传进来值，做post请求准备
            dataId: ''
        }
    },
    created () {
        this.getUserList()
    },
    methods: {
        async getUserList () {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限失败')
            }
            console.log(res)
            this.rolelist = res.data
        },
        addUser (id, name, desc) {
            this.changeNowId = id
            this.addJueseFrom.roleName = name
            this.addJueseFrom.roleDesc = desc
            this.centerDialogVisible = true
        },
        addDialogClosed () {
            this.$refs.addFromRef.resetFields()
        },
        // 确认好提交角色的信息完整并且提交数据
        tijiaoJuese () {
            if (this.changeNowId === 0) {
                // 提交前确认表单验证是否完整
                this.$refs.addFromRef.validate(async valid => {
                    if (!valid) return this.$message.error('表单未完整')
                    // 验证通过可以发起请求添加用户了
                    const { data: res } = await this.$http.post(
                        'roles',
                        this.addJueseFrom
                    )
                    if (res.meta.status !== 201) {
                        this.$message.error('添加用户失败！')
                    }
                    this.$message.success('添加用户成功！')
                    this.centerDialogVisible = false
                    this.getUserList()
                })
            } else {
                this.$refs.addFromRef.validate(async valid => {
                    if (!valid) return this.$message.error('表单未完整')
                    // 验证通过可以发起请求添加用户了
                    const { data: res } = await this.$http.put(
                        'roles/' + this.changeNowId,
                        this.addJueseFrom
                    )
                    if (res.meta.status !== 200) {
                        this.$message.error('添加用户失败！')
                    }
                    this.changeNowId = 0
                    this.$message.success('添加用户成功！')
                    this.centerDialogVisible = false
                    this.getUserList()
                })
            }
        },
        // 删除角色权力
        removeJueseById (id) {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http
                        .delete('roles/' + id)
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
        // 在权限列表打开的的三级权限页面内删除三级权限
        async removeRightByid (id1, id2) {
            const confirmResult = await this.$confirm(
                '此操作将移除该用户当前权限, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('取消操作')
            }
            const { data: res } = await this.$http.delete(
                `roles/${id1.id}/rights/${id2}`
            )
            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败')
            }
            this.$message.success('取消权限成功！')
            id1.children = res.data
        },
        // 集成全部权限的弹出框
        async showSetRightDialog (role) {
            this.dataId = role.id
            this.defKeys = []
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                return this.$message.error('获取列表失败')
            }
            // 把获取到的数据保存到data中
            this.rightsList = res.data

            this.getLeafKeys(role, this.defKeys)

            this.setRightDialogVisible = true
        },
        // 通过递归的形式，获取角色下的三级权限，并保存到defKeys数组中
        // node===节点
        getLeafKeys (node, arr) {
            // 如果当前node节点不包含children属性，那它就是三级节点。
            if (!node.children) {
                return arr.push(node.id)
            }
            // 如何node有children属性不是三级权限。那他到这就要递归循环执行子节点数据继续判断执行添加ID
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        // 集成全部权限的弹出框确认POST提交已取消或勾选的权限
        async allotRights () {
            // 这里通过ref获得当前对象。当前对象element这个属性里面的方法。
            // 能够获取到已经选择的权限，和半选的权限
            const keys = [
                // 通过es7 的展开，keys数组接收组合成一个数组对象
                ...this.$refs.treeRef.getCheckedKeys(), // 获取已选的权限
                ...this.$refs.treeRef.getHalfCheckedKeys() // 获取半选的权限
            ]
            // keys数组对象通过join方法，转换成字符串。分隔符是逗号。
            const idStr = keys.join(',')
            // 然后发出修改请求。
            const { data: res } = await this.$http.post(`roles/${this.dataId}/rights`, { rids: idStr }) // 请求地址和请求头。把转化后的字符串传进去。
            if (res.meta.status !== 200) {
                return this.$message.error('角色授权失败')
            }
            this.$message.success('角色授权成功')
            this.getUserList() // 修改成功，重新加载下当前数据
            this.setRightDialogVisible = false // close window
        }
    }
}
</script>

<style lang="scss" scoped>
.addOneJuese {
    margin-bottom: 20px;
}
.el-tag {
    margin: 7px;
}
.borderTop {
    border-top: 1px solid #eee;
}
.borderBottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
