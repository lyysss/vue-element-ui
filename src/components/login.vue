<template>
    <div class="login">
        <div class="login_box">
            <div class="headimg">
                <img src="../assets/timg.jpg" />
            </div>

            <el-form
                ref="loginFormRef"
                label-width="65px"
                :model="loginForm"
                :rules="loginFormRules"
                class="login_from"
            >
                <el-form-item label="账号:" prop="mobile">
                    <el-input
                        prefix-icon="el-icon-user"
                        v-model="loginForm.mobile"
                        maxlength="15"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input
                        type="password"
                        prefix-icon="el-icon-lock"
                        v-model="loginForm.password"
                        maxlength="18"
                    ></el-input>
                </el-form-item>
                <div class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="chongzhi">重置</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        mobile: '17674022714',
        password: '123456'
      },
      loginFormRules: {
        mobile: [
          {
            min: 4,
            max: 15,
            message: '正确账号 4 ~ 15 字符',
            trigger: 'blur'
          },
          {
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            min: 6,
            max: 18,
            message: '请输入正确的密码 6 ~ 18 字符',
            trigger: 'blur'
          },
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    chongzhi: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `app-bwm-admin/adminLogin?mobile=${this.loginForm.mobile}&password=${this.loginForm.password}`
        )
        if (res.code !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('./home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
    background-color: #274a6c;
    height: 100%;
    background-image: url('../assets/loginB.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    opacity: 0.8;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s linear;
    .headimg {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 6px;
        box-shadow: 0 0 10px #eee;
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
    }
}
.login_box:hover{
    opacity: 1;
    transition: all 300ms linear;
}
.login_from {
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
