<template>
  <div class="hello">

    <select v-model="selectedMonth" @change="monthFilter">
      <option disabled selected value="">Please select one</option>
      <option v-for="month in months" v-bind:value="month.month">
        {{ month.name }}
      </option>
    </select>

    <select v-model="selectedDay" @change="renderHourlyBarChart">
      <option disabled selected value="" v-if="selectedMonth">Select a day</option>
      <option disabled selected value="" v-else="">← Select month</option>

      <option v-for="day in this.selectedMonthDays" v-bind:value="day">
        {{ day }}
      </option>
    </select>

    <div class="chartBlock">
      <canvas id="month-visits-chart"></canvas>
    </div>
    <div class="chartBlock">
      <canvas id="hourly-visits-chart"></canvas>
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
      selectedDay: '',
      selectedMonthDays: '',
      month: [],
      monthName: ''
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
      var mm = this.selectedMonth;

      if (mm === undefined || mm === "") {
        mm = today.getMonth()+1
      } else {
        mm = this.selectedMonth
      }
      this.monthName = this.getMonth(mm)

      var dayMonth = []
      var visits = []

      var days_array = this.getDaysInMonth(mm-1, 2018)

      for (var day of days_array) {
        dayMonth.push(day.getDate())
      }

      this.selectedMonthDays = dayMonth

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
            text: 'Visits per day per for ' + this.monthName
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
    renderHourlyBarChart() {
      var visits = [];
      var hours_array = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

      var today = new Date();
      // var dd = today.getDate();
      var dd = this.selectedDay
      var mm = this.selectedMonth
      var yy = today.getYear()
      for (var i = 0; i < hours_array.length; i++) {
        var hourVisitCount = 0
        for (var visit of this.data) {
          var visitDate = new Date(visit.date)

          if (visitDate.getHours() === hours_array[i] && visitDate.getDate() === dd && visitDate.getMonth()+1 === mm) {
            hourVisitCount += 1;
          }
        }
        visits.push(hourVisitCount);
      }

      var ctx = document.getElementById("hourly-visits-chart").getContext('2d');
      var myBarChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: hours_array,
          backgroundColor: '#FFFFFF',
          backgroundColor: '#FFFFFF',
          datasets: [{
            label: 'Visits today by hour',
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
            text: 'Visits per hour for today'
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
    getMonth(monthNumber){
      switch(monthNumber) {
        case 1:
        return "January";
        break;
        case 2:
        return "February"
        break;
        case 3:
        return "March";
        break;
        case 4:
        return "April";
        break;
        case 5:
        return "May";
        break;
        case 6:
        return "June";
        break;
        case 7:
        return "July";
        break;
        case 8:
        return "August"
        break;
        case 9:
        return "September";
        break;
        case 10:
        return "October";
        break;
        case 11:
        return "November";
        break;
        case 12:
        return "December";
        break;
      }
    }
  },
  // mounted() {
  //   this.renderBarChart()
  // }
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
