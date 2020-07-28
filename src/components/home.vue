<template>
  <el-container class="page">
    <el-header>
      <div class="el-header-l">
        <div class="el-header-l-l">
          <img src="../assets/timg.jpg" />
        </div>
        <h4>s. 后台管理系统</h4>
      </div>
      <el-button type="info" @click="tuichu">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :style="iswidth?'width:64px':'width:200px'">
        <div class="toggle-button" @click="toggleBtn">|||</div>
        <el-menu
          mode="vertical"
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="iswidth"
          :router="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">会员商城</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/goods/lunbotu">轮播图</el-menu-item>
              <el-menu-item index="/goods/list">会员商品管理</el-menu-item>
              <!-- <el-menu-item index="/goods/add">待添加</el-menu-item>
              <el-menu-item index="/goods/Params">待添加</el-menu-item>
              <el-menu-item index="/goods/Cate">待添加</el-menu-item>-->
              <el-menu-item index="/goods/Cate">商城订单查询</el-menu-item>
              <el-menu-item index>待添加</el-menu-item>
              <el-menu-item index>待添加</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">城市管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/goods/City">城市设置</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index>
            <i class="el-icon-setting"></i>
            <span slot="title">其他</span>
          </el-menu-item>
        </el-menu>

        <!-- <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :unique-opened="true"
                    :collapse="iscollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                >
                    <el-submenu :index="item.id+ ''" v-for="item in menulist" :key="item.id">
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item
                            :index="'/'+subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="activePathBtn('/'+subItem.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.name}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
        </el-menu>-->
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconObj: {
        // 样式icon
        '125': 'el-icon-user',
        '103': 'el-icon-lock',
        '101': 'el-icon-shopping-bag-1',
        '102': 'el-icon-document',
        '145': 'el-icon-s-data'
      },
      iswidth: false,
      activePath: ''
    }
  },
  created () {
    this.getMenulist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    tuichu: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenulist () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.errr('msg')
      this.menulist = res.data
    },
    toggleBtn: function () {
      console.log(this.iswidth)
      this.iswidth = !this.iswidth
    },
    activePathBtn (path) {
      this.activePath = path
      window.sessionStorage.setItem('activePath', path)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-header-l {
        display: flex;
        align-items: center;
        font-size: 18px;
        color: #fff;
        .el-header-l-l {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            border: 1px solid #fff;
            margin-right: 20px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }
        }
    }
}
.el-aside {
    background-color: #333744;
    transition: 800ms;
    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
</style>
