<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button v-on:click="april">Hit me</button>
  </div>
</template>

<script>
/* eslint-disable */
// import {makeRequest, requestComplete} from "../../helpers/helpers"

// example URL with params:
// https://api.mlab.com/api/1/databases/signins/collections/signins?apiKey=Vp2I1nmC961_lV2whDojmmOuZzXb0S_o&l=10000&q={%22date%22:%20{%22$gt%22:%201523361490925}}

export default {
  /* eslint-disable */
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      url: 'https://api.mlab.com/api/1/databases/signins/collections/signins?apiKey=Vp2I1nmC961_lV2whDojmmOuZzXb0S_o&l=10000',
      data: ""
    }
  },
  created: function() {
    this.$http.get('https://api.mlab.com/api/1/databases/signins/collections/signins?apiKey=Vp2I1nmC961_lV2whDojmmOuZzXb0S_o&l=10000')
    .then(response => {
      this.data = response.body;
      console.log('########################')
      console.log("Data has loaded");
      console.log('########################')
    })
  },
  methods: {
    // fetchData () {
    //   this.$http.get('https://api.mlab.com/api/1/databases/signins/collections/signins?apiKey=Vp2I1nmC961_lV2whDojmmOuZzXb0S_o&l=10000')
    //   .then(response => {
    //     this.data = response.body
    //     // or like this this.getTemp = response.json()
    //   })
    // },
    april() {
      let april = this.data.filter(signin => signin.date > 1523361490925)
      console.log('########################')
      console.log(april);
      console.log('########################')
      }
    },
    mounted() {

    },
  }

  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    h1, h2 {
      font-weight: normal;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin: 0 10px;
    }
    a {
      color: #42b983;
    }
  </style>
