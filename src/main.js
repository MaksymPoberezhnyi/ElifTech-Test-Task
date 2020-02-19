import Vue from 'vue'
import App from './App.vue'

var firebaseConfig = {
  apiKey: "AIzaSyC_7A8fwiJDZwLqh5Np4dLO1kbM1SaHIWo",
  authDomain: "discussion-page.firebaseapp.com",
  databaseURL: "https://discussion-page.firebaseio.com",
  projectId: "discussion-page",
  storageBucket: "discussion-page.appspot.com",
  messagingSenderId: "683134359090",
  appId: "1:683134359090:web:e9630b073519d359114e2b"
}
window.firebase.initializeApp(firebaseConfig)

Vue.prototype.$fb = window.firebase.firestore()


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
