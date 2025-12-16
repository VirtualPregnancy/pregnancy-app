<template>
  <div>
    <landing-page />
    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-1P0G8CFX1L"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-1P0G8CFX1L");
    </script>
  </div>
</template>

<script>
import LandingPage from "./landing/index.vue";

export default {
  layout: "empty",
  components: {
    LandingPage,
  },
};
</script>

