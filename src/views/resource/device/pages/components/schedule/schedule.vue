<template>
  <div class="device-schedule-container">
    <el-table>
    </el-table>

  </div>
</template>

<script>
export default {
    name: 'device-schedule',
    props: {
        id: Number,
    },
    data(){
        return {
            schedule: {
                list: [],
                current: 1,
                size: 10,
                total: 0,
                loading: false,
            }
        }
    },
    mounted(){

    },
    methods: {
        scheduleList(){
            const that = this
            const params = {

            }
            that.$api.SCHEDULE_INFO(params)
                .then(res=>{
                    that.schedule.list = res.records
                })
        },
    },
}
</script>
<style lang="scss">
.device-schedule-container{

}

</style>
