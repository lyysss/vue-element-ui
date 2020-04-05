<template>
    <div>
        <div class="container">
            <img src="../assets/aaa.gif" alt="">
            <p>一一的编码之路</p>
        </div>
    </div>
</template>
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
        img{
            width: 100%;
            height: 100%;
        }
        p{
            z-index: 1000;
            font-size: 80px;
            color: #ffffff;
            font-weight: 600;
            position: absolute;
            letter-spacing: 20px;
            top: 120px;
            box-shadow: 0 0 10px #000;
            padding: 0 10px;
        }
    }
</style>
