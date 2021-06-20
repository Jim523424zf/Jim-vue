<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      Copyright &copy; 2021 Jim科技信息股份有限公司 &nbsp; | &nbsp;苏ICP备19046674号-1
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
<style scoped lang='less'>
.ant-pro-global-footer {
    margin:0;
    padding: 0 16px;
    text-align: center;
}
</style>
