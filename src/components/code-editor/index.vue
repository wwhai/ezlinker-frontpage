<template>
  <div class="code-editor" :id='id' :style="{'height': height?height:'200px'}"></div>
</template>

<script>
import CodeFlask from 'codeflask';

export default {
    name: 'code-editor',
    props:{
        // 初始源代码
        value: String,
        lang: {
            type: String,
            required: true,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        height: String,
    },
    data(){
        return {
            id: '',
            flask: null,
        }
    },
    created(){
        // 随机生成一个id
        const date = new Date()
        this.id = 'code-editor-' + date.getMinutes() + date.getSeconds() + date.getMilliseconds() + Math.ceil(Math.random()*100);
    },
    mounted(){
        if(this.flask==null){
            const elem = document.getElementById(this.id);
            if (!elem){
                console.log('target elem not exist')
                return
            }
            this.flask = new CodeFlask('#'+this.id, { 
                language: this.lang,
                readonly: this.readonly, 
            });
        }

        this.flask.updateCode(this.value)
        if(!this.readonly){
            this.flask.onUpdate((code) => {
                this.$emit('input', code)
            });
        }
    },
}
</script>

<style lang='scss'>
.code-editor{
    border: 1px solid #ddd;
    border-radius: 5px;
    position: relative;
    .codeflask{
        position: relative;
    }
}
</style>