<template>
  <div class="hello">

    <select v-model="selectedMonth">
      <option disabled selected value="">Please select one</option>
      <option v-for="month in months" v-bind:value="month.month">
        {{ month.name }}
      </option>
    </select>
    <button v-on:click="monthFilter">Month Selector</button>

    <p>Selected Option: {{ selectedMonth }}</p>

    <!-- Line Break  -->

    <div class="chartBock">
      <canvas id="month-visits-chart"></canvas>
    </div>
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
      url: 'https://api.mlab.com/api/1/databases/signins/collections/signins?apiKey=Vp2I1nmC961_lV2whDojmmOuZzXb0S_o&l=10000',
      data: "",
      dataLoaded: false,
      months: [
        {name: 'January', shortName: 'jan', month: 1},
        {name: 'February', shortName: 'feb', month: 2},
        {name: 'March', shortName: 'mar', month: 3},
        {name: 'April', shortName: 'apr', month: 4},
        {name: 'May', shortName: 'may', month: 5},
        {name: 'June', shortName: 'jun', month: 6},
        {name: 'July', shortName: 'jul', month: 7},
        {name: 'August', shortName: 'aug', month: 8},
        {name: 'September', shortName: 'sept', month: 9},
        {name: 'October', shortName: 'oct', month: 10},
        {name: 'November', shortName: 'nov', month: 11},
        {name: 'Dec', shortName: 'dec', month: 12}
      ],
      selectedMonth: '',
      month: []
    }
  },
  created() {
    this.$http.get('https://api.mlab.com/api/1/databases/signins/collections/signins?apiKey=Vp2I1nmC961_lV2whDojmmOuZzXb0S_o&l=10000')
    .then(response => {
      this.data = response.body;
      this.dataLoaded = true;
      console.log("Data has loaded");
    })
  },
  methods: {
    monthFilter() {
      this.month = []
      var month = this.selectedMonth
      this.data.filter(
        signin =>
        this.returnByMonth(signin, month)
      )
      this.renderBarChart();
    },
    returnByMonth(signin, month) {
      var timeStamp = new Date(signin.date)
      if (timeStamp.getMonth()+1 === month) {
        this.month.push(signin);
      }
    },
    getDaysInMonth(month, year) {

      var date = new Date(year, month, 1);
      var days = [];
      // console.log('month', month, 'date.getMonth()', date.getMonth())
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return days;
    },
    renderBarChart() {

      var today = new Date();

      var mm;

      if (mm === '') {
        mm = today.getMonth()+1
      } else {
        mm = this.selectedMonth
      }

      var dayMonth = []
      var visits = []

      var days_array = this.getDaysInMonth(mm, 2018)

      for (var day of days_array) {
        dayMonth.push(day.getDate())
      }

      var yy = today.getYear()
      for (var i = 0; i < dayMonth.length; i++) {
        var visitDayCount = 0
        for (var visit of this.data) {
          var visitDate = new Date(visit.date)

          if (visitDate.getDate() === dayMonth[i] && visitDate.getMonth()+1 === mm) {
            visitDayCount += 1;
          }
        }
        visits.push(visitDayCount);
      }

      var ctx = document.getElementById("month-visits-chart").getContext('2d');
      var myBarChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: dayMonth,
          backgroundColor: '#FFFFFF',
          backgroundColor: '#FFFFFF',
          datasets: [{
            label: 'Visits this month by day',
            data: visits,
            backgroundColor:
            '#CC0033',
            borderColor: [
            ],
            borderWidth: 1
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Visits per day per for this month'
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          }
        }
      });
    },
  }
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
