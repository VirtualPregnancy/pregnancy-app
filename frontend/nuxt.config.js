import colors from "vuetify/es5/util/colors";
const serveStatic = require("serve-static");
const path = require("path");

const routerBase =
  process.env.DEPLOY_ENV === "GH_PAGES"
    ? {
        router: {
          base: "/pregnancy-app/",
        },
      }
    : {
        router: {
          mode: "hash",
          // mode: "history",
          base: "/",
        },
      };

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "ABI Generic Web App Template",
    htmlAttrs: {
      lang: "en",
    },
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/pregnancy-app/favicon2.ico",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bad+Script&family=Raleway:wght@100;300&display=swap",
      },
    ],
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "google-site-verification",
        content: "L6CIHWX38cm1gLthoxa4mWPpp_l6UGCrtyRe5ZNeKB0",
      },
      {
        hid: "description",
        name: "description",
        content:
          "An ABI Generic Web App Template",
      },
      { name: "format-detection", content: "telephone=no" },
      {
        name: "keywords",
        content:
          "Your Key words",
      },
    ],
    script: [
      {
        type: "text/javascript",
        src: "js/tailwindcss.js",
      },
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-LXD5LJXP2Y",
        async: true,
      },
    ],
  },

  serverMiddleware: [
    // add middlewares
    {
      handler: serveStatic(path.resolve(__dirname, "static"), {
        setHeaders(res, path) {
          if (/\.mp4$/.test(path)) {
            res.setHeader("Content-Type", "video/mp4");
          }
        },
      }),
      prefix: "@/static",
    },
  ],
  // server: {
  //   // host: 'localhost', // default: localhost
  //   // port: 3005 // default: 3000
  // },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/sass/global.scss", "@/assets/sass/base.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/topics",
    "@/plugins/current-content",
    { src: "~/plugins/copper.js", ssr: false, mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      "~/components/about",
      "~/components/model",
      "~/components/navigation",
      "~/components/topics",
      "~/components/loading",
    ],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios'
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["@/assets/sass/variables.scss"],
    treeShake: true,
    theme: {
      options: { customProperties: true },
      dark: true,
      themes: {
        dark: {
          primary: "#B66A40",     // orange
          accent: "#7B8BA5",      // blue-grey
          secondary: "#AA988A",   // light-brown
          info: "#2F414B",        // dark-blue-grey 
          warning: "#7A3520",     // dark-brown
          subWarning: "#B66A40",  // orange-brown
          error: "#7A3520",       // dark-brown
          subError: "#B66A40",    // orange-brown
          success: "#2B4B3C",     // dark-green
          subSuccess: "#AA988A",  // light-brown
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.md$/i,
        use: "raw-loader",
      });
    },
    loaders: {
      sass: {
        implementation: require("sass"),
      },
      scss: {
        implementation: require("sass"),
      },
    },

  },

  target: "static",

  ...routerBase,
  generate: {
    dir: "build",
    //todo: modify routes afterwards
    routes: [
      // Modify these routes, when you config your routes for app
      "/ultrasound-model",
      "/pregnancy-changes",
      "/pregnancy-placenta",
      "/pregnancy-baby",
      "/conditions",
      "/conditions/fetal",
      "/conditions/birth",
      "/conditions/care",
      "/ultrasound",
      "/ultrasound/ultrasound-model",
      "/clinical",
      "/clinical/mid-wife",
      "/clinical/when-care-changes",
      "/about",
      
    ],
  },
};
