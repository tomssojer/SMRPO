import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import "./style.css";
import '@mdi/font/css/materialdesignicons.css' // ikone

// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import router from "./router";
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).use(router).mount("#app");
