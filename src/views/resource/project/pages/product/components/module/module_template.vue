<template>
  <div class="module-template">
    <div class="module-list">
      <div class="item" v-for="(v,k) in data" :key="'moduleTemp'+k">
        <div class="meta-box">
          <div class="icon-box">
            <img :src="v.icon" alt="icon" />
          </div>
          <div class="meta">
            <div class="title">{{v.name}}</div>
            <div class="desc">{{v.description}}</div>
          </div>
        </div>
        <div class="edit-btn" @click="submit(v)">选择<d2-icon name='angle-right'/></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'module-template',
  props: {
    data: Array,
    handle: Function
  },
  data () {
    return {

    }
  },
  methods: {
    submit (item) {
      this.handle({ ...item, id: undefined })
    }
  }
}
</script>

<style lang='scss'>
.module-template{
  padding: 0 20px;
}
</style>
