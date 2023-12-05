<template>
  <div class="model">
    {{ modelName }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      modelName: "Model load on here!",
      helloworld:"",
      model:null,
    };
  },
 
  async fetch() {
    this.helloworld = await fetch(
        'http://127.0.0.1:8000/hello/model'
      ).then(res => res.json())
      console.log(this.helloworld);
      
      this.model = await fetch(
        'http://127.0.0.1:8000/api/model'
      ).then(res => res.blob())
      console.log(this.model);
    },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },

  mounted() {
    this.start();
  },

  methods: {
    start(){
      console.log("load model functions.");
    }
  },

  watch: {},

  created() {
    this.$nuxt.$on("send-emitter-data", (data) => {
      console.log(data);
    });
  },

  beforeDestroy() {
    // Wirte code before destory this component
  }
};
</script>

<style scoped lang="scss">

</style>
