// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: ['~/plugins/vue-3google-map'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', 'primeicons/primeicons.css'],
  modules:[
    'nuxt-primevue',
    ['@nuxtjs/google-fonts', {
        families: {
          Roboto: true,
          Inter: [400, 700],
          'Josefin+Sans': true,
          Lato: [100, 300],
          Raleway: {
            wght: [100, 400],
            ital: [100]
          },
          Figtree: true,

        },
        display: 'swap',
    },],
  ],
  
  primevue: {
    directives: {
      include: ['Calendar', 'OverlayPanel','Galleria','ProgressSpinner','Toast']
  },
},

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
})