document.addEventListener('DOMContentLoaded', function() {
  const metrics = {
    heartRate: {
      input: document.getElementById('heartRate'),
      value: document.getElementById('heartRateValue'),
      alert: document.getElementById('heartRateAlert'),
      validate: (val) => {
        if (!val) return { status: 'normal', message: '' };
        val = parseFloat(val);
        if (val < 60) return { status: 'warning', message: 'Heart rate is low' };
        if (val > 100) return { status: 'warning', message: 'Heart rate is high' };
        return { status: 'normal', message: '' };
      }
    },
    temperature: {
      input: document.getElementById('temperature'),
      value: document.getElementById('temperatureValue'),
      alert: document.getElementById('temperatureAlert'),
      validate: (val) => {
        if (!val) return { status: 'normal', message: '' };
        val = parseFloat(val);
        if (val < 97) return { status: 'warning', message: 'Temperature is low' };
        if (val > 99) return { status: 'warning', message: 'Temperature is high' };
        return { status: 'normal', message: '' };
      }
    },
    bloodPressure: {
      input: document.getElementById('bloodPressure'),
      value: document.getElementById('bloodPressureValue'),
      alert: document.getElementById('bloodPressureAlert'),
      validate: (val) => {
        if (!val || !val.includes('/')) return { status: 'normal', message: '' };
        const [systolic, diastolic] = val.split('/').map(Number);
        if (isNaN(systolic) || isNaN(diastolic)) return { status: 'warning', message: 'Invalid format' };
        if (systolic > 140 || diastolic > 90) return { status: 'warning', message: 'Blood pressure is high' };
        if (systolic < 90 || diastolic < 60) return { status: 'warning', message: 'Blood pressure is low' };
        return { status: 'normal', message: '' };
      }
    },
    sleepHours: {
      input: document.getElementById('sleepHours'),
      value: document.getElementById('sleepHoursValue'),
      alert: document.getElementById('sleepAlert'),
      validate: (val) => {
        if (!val) return { status: 'normal', message: '' };
        val = parseFloat(val);
        if (val < 6) return { status: 'warning', message: 'Not enough sleep' };
        if (val > 9) return { status: 'warning', message: 'Too much sleep' };
        return { status: 'normal', message: '' };
      }
    }
  };

  // Set up event listeners for each metric
  Object.entries(metrics).forEach(([key, metric]) => {
    if (!metric.input || !metric.value || !metric.alert) {
      console.error(`Missing DOM elements for metric: ${key}`);
      return;
    }

    metric.input.addEventListener('input', function() {
      const value = this.value;
      metric.value.textContent = value;
      
      const validation = metric.validate(value);
      metric.alert.textContent = validation.message;
      metric.alert.style.display = validation.message ? 'block' : 'none';
      metric.alert.className = `alert ${validation.status}`;
      
      localStorage.setItem(key, value);
      updateHealthChart();
    });

    // Load saved value from localStorage
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      metric.input.value = savedValue;
      metric.input.dispatchEvent(new Event('input'));
    }
  });
});