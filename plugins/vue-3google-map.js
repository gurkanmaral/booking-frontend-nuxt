// import { GoogleMap } from "vue3-google-map";

// export default defineNuxtPlugin((nuxtApp) => {
//   nuxtApp.vueApp.use(GoogleMap)
//   nuxtApp.vueApp.component('GoogleMap', GoogleMap)

//   return {
//     provide: {
//       GoogleMap
//     },
//   }
// })

import { GoogleMap } from "vue3-google-map";

const Vue3GoogleMapPlugin = {
  install(app) {
    app.component("GoogleMap", GoogleMap);
  }
};

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Vue3GoogleMapPlugin);
});