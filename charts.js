// Bar chart
var ctxL = document.getElementById("barChart").getContext('2d');
var myLineChart = new Chart(ctxL, {
  type: 'bar',
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Traffic",
        data: [30, 15, 62, 65, 61, 65, 40],
        backgroundColor: '#4285F4',
        borderWidth: 0,
      }
    ]
  },
  options: {
    responsive: true,
    legend: {
      display: true,
    },
    tooltips: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false,
        },

        ticks: {
          fontColor: 'rgba(0,0,0, 0.5)',
        }
      }],
      yAxes: [{
        stacked: true,
        gridLines: {
          borderDash: [2],
          drawBorder: false,
          zeroLineColor: "rgba(0,0,0,0)",
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2]
        },
        ticks: {
          fontColor: 'rgba(0,0,0, 0.5)'
        }
      }]
    }
  }
});

// Select initialization
$(document).ready(function () {
  $('.mdb-select').materialSelect();
  $('.select-wrapper.md-form.md-outline input.select-dropdown').bind('focus blur', function () {
    $(this).closest('.select-outline').find('label').toggleClass('active');
    $(this).closest('.select-outline').find('.caret').toggleClass('active');
  });
});

// Date Picker Initialization
$('.datepicker').pickadate();