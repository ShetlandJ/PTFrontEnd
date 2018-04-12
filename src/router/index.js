import Vue from 'vue'
import Router from 'vue-router'
import Chart from '@/components/BarChart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BarChart',
      component: Chart
    }
  ]
})
