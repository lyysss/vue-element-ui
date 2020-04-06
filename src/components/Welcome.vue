<template>
    <div>
        <div class="container">
            <p>Vue后台管理系统</p>
        </div>
    </div>
</template>i
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
    .container{
        width: 100%;
        height: 670px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2c9678;
        box-shadow: 0 0 20px #111;
        p{
            z-index: 1000;
            font-size: 30px;
            color: #ffffff;
            font-weight: 600;
            position: absolute;
            letter-spacing: 10px;
            top: 120px;
            box-shadow: 0 0 10px #000;
            padding: 10px 20px;
        }
    }
</style>
