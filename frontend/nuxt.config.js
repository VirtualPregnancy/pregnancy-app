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
  // Runtime config to make environment variables available in browser
  publicRuntimeConfig: {
    deployEnv: process.env.DEPLOY_ENV || 'local',
    basePath: process.env.DEPLOY_ENV === "GH_PAGES" ? "/pregnancy-app" : ""
  },
  
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Pregnancy App",
    htmlAttrs: {
      lang: "en",
    },
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: process.env.DEPLOY_ENV === "GH_PAGES" ? "/pregnancy-app/favicon.ico" : "/favicon.ico",
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
          "Pregnancy App",
      },
      { name: "format-detection", content: "telephone=no" },
      {
        name: "keywords",
        content:
          "Pregnancy, Ultrasound, Pregnancy Complications, Pregnancy Journey, Care Pathways, Support",
      },
    ],
    script: [
      {
        type: "text/javascript",
        src: process.env.DEPLOY_ENV === "GH_PAGES" ? "/pregnancy-app/js/tailwindcss.js" : "/js/tailwindcss.js",
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
      "~/components/model",
      "~/components/navigation",
      "~/components/topics",
      "~/components/loading",
      "~/components/content",
    ],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/pwa"
  ],
  
  // PWA module configuration
  pwa: {
    meta: {
      title: 'Pregnancy App',
      author: 'ABI',
      description: 'A comprehensive pregnancy education and care application.',
      theme_color: '#DD3C51',
      lang: 'en',
      ogSiteName: 'Pregnancy App',
      ogTitle: 'Pregnancy App',
      ogDescription: 'A comprehensive pregnancy education and care application.',
      ogImage: '/favicon.ico',
      twitterCard: 'summary',
      twitterSite: '@ABI'
    },
    manifest: {
      name: 'Pregnancy App',
      short_name: 'Pregnancy App',
      description: 'A comprehensive pregnancy education and care application.',
      theme_color: '#DD3C51',
      background_color: '#F5F9FC',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      orientation: 'portrait-primary',
      icons: [
        {
          src: '/img/pwa-icon.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        },
        {
          src: '/favicon.ico',
          sizes: '16x16 32x32 48x48',
          type: 'image/x-icon'
        }
      ]
    },
    workbox: {
      enabled: true,
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'CacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: 'https://www.googletagmanager.com/.*',
          handler: 'CacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ]
    }
  },

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
      dark: false,
      themes: {
        light: {
          primary: "#DD3C51",        
          accent: "#313657",         
          accentLight: "#1F6683",    
          secondary: "#B8BCC8",      
        
          info: "#1F6683",          
          warning: "#DD3C51",        
          subWarning: "#FAF6F7",     
          error: "#976533",          
          subError: "#FAF6F7",       
          success: "#1F6683",       
          subSuccess: "#E0EBF5",     
        
          background: "#F5F9FC",     
          backgroundAlt: "#FAF6F7",  
        
          
            buttonMain: "#4d74a8",        
            buttonMainHover: "#486FA3",   
            buttonMainActive: "#313657",  
            
            buttonText: "#FFFFFF",        
            buttonTextHover: "#FFFFFF",  
            buttonTextActive: "#FFFFFF"  
          
             
        },
        
        dark: {
          primary: "#DD3C51",     // red from palette
          accent: "#6C90B9",      // blue from palette
          accentLight: "#1F6683",     // teal from palette
          secondary: "#B8BCC8",   // light grey for buttons
          info: "#1F6683",        // teal from palette
          warning: "#DD3C51",     // red from palette
          subWarning: "#6C90B9",  // blue from palette
          error: "#313657",       // red from palette
          subError: "#6C90B9",    // blue from palette
          success: "#1F6683",     // teal from palette
          subSuccess: "#6C90B9",  // blue from palette
          background: "#313657",  // dark navy from palette
        }
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: process.env.DEPLOY_ENV === "GH_PAGES" ? "/pregnancy-app/_nuxt/" : "/_nuxt/",
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

  // Router configuration
  router: {
    ...routerBase.router,
    scrollBehavior(to, from, savedPosition) {
      // Always scroll to top when navigating to a new page
      return { x: 0, y: 0 }
    }
  },
  generate: {
    dir: "build",
    fallback: "404.html",
    routes: [
      '/',
      '/about',
      '/landing',
      '/complications-fetal',
      '/complications-gestational-diabetes',
      '/complications-pe',
      '/complications-disorders',
      '/complications-extra-care',
      '/pregnancy-baby',
      '/pregnancy-changes',
      '/pregnancy-fetal-dev',
      '/pregnancy-interact',
      '/pregnancy-keep-baby-healthy',
      '/pregnancy-placenta',
      '/clinical-mid-wife',
      '/clinical-when-care-changes',
      '/support-services',
      '/support-specialist',
      '/ultrasound-doppler',
      '/ultrasound-metric',
      '/ultrasound-what-is-ultrasound',
      '/ultrasound-what-ultrasound-means'
    ],
  },
};
