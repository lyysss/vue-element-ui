<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员商城</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row class="addFenlei">
        <el-col>
          <el-button type="primary" @click="showAddListDialogVisible()">添加会员商城轮播图</el-button>
        </el-col>
      </el-row>
      <div class="img-box">
        <div class="img-box-list" v-for="item in lunbotuList" :key="item.id">
          <img :src="item.imgUrl" style="object-fit: cover;" />
          <div class="option-box" @click="deleteImg(item.id)">
            <div>
              <i class="el-icon-delete"></i>删除
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog title="添加轮播图" :visible.sync="addListDialogVisible" width="50%">
      <el-form ref="addCateFormRef" :model="addLunbo" label-width="100px">
        <el-form-item label="图片地址">
          <el-upload
            class="upload-demo"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handSuccess"
            :file-list="fileList"
            :multiple="true"
            list-type="picture"
            :limit="1"
            :http-request="uploadFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input v-model="addLunbo.commodity"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addLunbo.sort"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="addLunbo.createdTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addListDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLunboBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
export default {
  data () {
    return {
      lunbotuList: {},
      addLunbo: {
        imgUrl: '',
        commodity: '',
        sort: '',
        createdTime: '',
        token: ''
      },
      addListDialogVisible: false,
      qiniuToken: '',
      qiniuKey: '',
      fileList: []
      //   seachValue: '',
      //   queryInfo: {
      //     query: '', // 查询的商品信息关键字
      //     pagenum: 1, // 查询的页数
      //     pagesize: 10 // 每页的数量
      //   },
      //   goodsList: [],
      //   total: 0
    }
  },
  created () {
    this.token = window.sessionStorage.getItem('token')
    this.getGoodsData()
    this.getQiniu()
  },
  props: {
    // 上传凭证
    // 七牛JavaScript SDK API: qiniu.upload(file: blob, key: string, token: string, putExtra: object, config: object) 里的 token
    // 具体参数查看 https://developer.qiniu.com/kodo/manual/1208/upload-token
    qnToken: {
      type: String,
      default: null
    },
    // 七牛JavaScript SDK API: qiniu.upload(file: blob, key: string, token: string, putExtra: object, config: object) 里的 config
    // 具体参数查看 https://developer.qiniu.com/kodo/sdk/1283/javascript#3
    qnConfig: {
      type: Object,
      default () {
        return {
          useCdnDomain: true,
          disableStatisticsReport: false,
          retryCount: 1,
          region: qiniu.region.z0
        }
      }
    },
    // 七牛JavaScript SDK API: qiniu.upload(file: blob, key: string, token: string, putExtra: object, config: object) 里的 putExtra
    // 具体参数查看 https://developer.qiniu.com/kodo/sdk/1283/javascript#3
    qnPutextra: {
      type: Object,
      default () {
        return {
          fname: this.qiniuKey,
          params: {},
          mimeType: null
        }
      }
    }
  },
  methods: {
    async getQiniu () {
      let token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.post(
        'app-bwm-universal/filesUpload?token=' + token + '&type=1',
        {}
      )
      console.log(res)
      this.qiniuKey = res.data.data
      this.qiniuToken = res.data.token
    },
    async getGoodsData () {
      const { data: res } = await this.$http.get(
        'app-bwm-admin/getCarousel?token=' + this.token,
        {}
      )
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取轮播图列表失败')
      }
      this.$message.success('获取轮播图列表成功')
      this.lunbotuList = res.data.data

      //   if (res.meta.status !== 200) {
      //     return this.$message.error('获取商品列表失败')
      //   }
      //   this.$message.success('获取商品列表成功')
    },
    deleteImg (id) {
      this.$confirm('此操作将删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.get(
            'app-bwm-admin/deleteCarousel?id=' +
                            id +
                            '&token=' +
                            this.token,
            {}
          )
          console.log(res)
          if (res.code !== 200) {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
          this.getGoodsData()

          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showAddListDialogVisible () {
      this.addListDialogVisible = true
    },
    async addLunboBtn () {
      let token = window.sessionStorage.getItem('token')
      this.addLunbo.token = token
      const { data: res } = await this.$http.get(
        'app-bwm-admin/addCarousel',
        {
          params: this.addLunbo
        }
      )
      console.log(res)
      console.log(this.addLunbo)
      if (res.code !== 200) {
        return this.$message.error('添加轮播图失败')
      }
      this.$message.success('添加轮播图成功')
      this.addListDialogVisible = false
      this.getGoodsData()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      // console.log('http://dk5800.com/' + response.key)
      this.addLunbo.imgUrl = 'http://dk5800.com/' + response.key
    },
    handlePreview (file) {
      console.log(file)

      // console.log(file.url)
      // let token = window.sessionStorage.getItem('token')
      // const { data: res } = await this.$http.post(
      //   'app-bwm-universal/filesUpload?token=' + token + '&type=1',
      //   {}
      // )
      // console.log(res.data.token)
      // let key = res.data.data.data
      // let qiniuyunToken = res.data.data.token
      // let imgUrl = file.url
      // console.log(key)
      // console.log(qiniuyunToken)
      // console.log(imgUrl)
      // qiniuUploader.upload(
      //   imgUrl,
      //   res => {
      //     // 图片上传完成后返回值
      //     console.log(res.key)
      //     let imgUrl = 'http://dk5800.com/' + res.key
      //     self.userData.headPortrait = imgUrl
      //     self.imgData.url = imgUrl

      //     self.http_tui.request('/setHead_img', 'POST', self.imgData).then((res) => {
      //       console.log(res)
      //     })
      //   },
      //   {
      //     region: 'ECN', // （必须填写正确）ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
      //     // domain: domain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL                                         字  段。否则需要自己拼接
      //     key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
      //     // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
      //     uptoken: qiniuyunToken // 由其他程序生成七牛 uptoken
      //   },
      //   res => {
      //     // 上传进度
      //     // if(res.progress === 100){
      //     //  resolve(keys);
      //     //  }
      //   }
      // )
      // uni.request({
      //   url: 'http://182.61.33.209:81/app-bwm-universal/filesUpload?token=' + self.token + '&type=0',
      //   method: 'POST',

      //   success: (res) => {
      //     if (res.data.code == 200) {
      //       console.log(res.data.data.data)

      //       let key = res.data.data.data // key为自定义文件名
      //       let domain = res.data.data.domain // 文件下载地址
      //       let token = res.data.data.token // token为七牛云的token一般由后台接口提供
      //       let filePath = self.filePath // 为需要上传的文件
      //       console.log(key)
      //       console.log(token)
      //       console.log(filePath)
      //       qiniuUploader.upload(
      //         filePath,
      //         res => {
      //           // 图片上传完成后返回值
      //           console.log(res.key)
      //           let imgUrl = 'http://dk5800.com/' + res.key
      //           self.userData.headPortrait = imgUrl
      //           self.imgData.url = imgUrl

      //           self.http_tui.request('/setHead_img', 'POST', self.imgData).then((res) => {
      //             console.log(res)
      //           })
      //         },
      //         error => {

      //         },
      //         {
      //           region: 'ECN', // （必须填写正确）ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
      //           // domain: domain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL                                         字  段。否则需要自己拼接
      //           key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
      //           // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
      //           uptoken: token // 由其他程序生成七牛 uptoken
      //         },
      //         res => {
      //           // 上传进度
      //           // if(res.progress === 100){
      //           //  resolve(keys);
      //           //  }
      //         }
      //       )
      //     } else {
      //       this.$message.warning(res.data.msg)
      //     }
      //   },
      //   fail: (res) => {
      //     this.$message.warning(
      //       `网络错误。`
      //     )
      //   }
      // })
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前只能选择 1 张照片。`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    uploadFile (option) {
      console.log(option)

      const observable = qiniu.upload(
        option.file,
        this.qiniuKey,
        this.qiniuToken,
        this.qnPutextra,
        this.qnConfig
      )
      observable.subscribe({
        next: option.onProgress,
        error: option.onError,
        complete: option.onSuccess
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .img-box-list {
        width: 300px;
        height: 200px;
        position: relative;
        margin: 0 30px 30px 30px;
        img {
            width: 100%;
            height: 100%;
        }
        .option-box {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 22px;
            font-weight: bold;
            color: #ffffff;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
        }
    }
    .img-box-list:hover {
        .option-box {
            opacity: 1;
        }
    }
}
</style>
