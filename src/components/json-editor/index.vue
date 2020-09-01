<template>
  <div class="json-editor-container">
      <!-- TODO 后续进一步改进 -->
        <JsonEditor
            :options="{
                confirmText: 'confirm',
                cancelText: 'cancel',
            }"
            :objData="value" 
            v-model="value" >
        </JsonEditor>
  </div>
</template>

<script>
export default {
    name: 'json-editor',
    props:{
        value: Object,
    }
}
</script>

<style lang='scss'>
.json-editor-container{
    .block_content{

    }
}
</style>