let healthChart;

document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('healthChart');
  if (!ctx) {
    console.error('Could not find health chart canvas');
    return;
  }

  healthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: getLastSevenDays(),
      datasets: [{
        label: 'Heart Rate',
        data: getRandomData(7, 60, 100),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        fill: false
      }, {
        label: 'Temperature',
        data: getRandomData(7, 97, 99),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        fill: false
      }, {
        label: 'Sleep Hours',
        data: getRandomData(7, 6, 9),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Health Metrics Trends'
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
});

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
}

function getRandomData(count, min, max) {
  return Array.from({ length: count }, () => 
    Math.round((Math.random() * (max - min) + min) * 10) / 10
  );
}

function updateHealthChart() {
  if (!healthChart) return;

  const heartRate = document.getElementById('heartRate')?.value;
  const temperature = document.getElementById('temperature')?.value;
  const sleepHours = document.getElementById('sleepHours')?.value;

  if (heartRate && temperature && sleepHours) {
    healthChart.data.datasets[0].data.shift();
    healthChart.data.datasets[0].data.push(parseFloat(heartRate));
    
    healthChart.data.datasets[1].data.shift();
    healthChart.data.datasets[1].data.push(parseFloat(temperature));
    
    healthChart.data.datasets[2].data.shift();
    healthChart.data.datasets[2].data.push(parseFloat(sleepHours));
    
    healthChart.update();
  }
}