import Vue from 'vue'
import App from './App.vue'
import * as firebase from 'firebase'
import Vuetify from 'vuetify'
import {
  store
} from './store'
import FirebaseConfig from '../config/config.json'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp(FirebaseConfig)
  }
})
