// Health metrics event listeners
document.getElementById('heartRate').addEventListener('input', updateHeartRate);
document.getElementById('temperature').addEventListener('input', updateTemperature);
document.getElementById('sleep').addEventListener('input', updateSleep);
document.getElementById('activity').addEventListener('input', updateActivity);

// Health metrics functions
function updateHeartRate() {
  const heartRateValue = document.getElementById('heartRate').value;
  document.getElementById('heartRateValue').textContent = heartRateValue;

  if (heartRateValue < 60) {
    // Add low heart rate alert
  } else if (heartRateValue > 100) {
    // Add high heart rate alert
  } else {
    // Remove any existing alerts
  }
}

function updateTemperature() {
  const temperatureValue = document.getElementById('temperature').value;
  document.getElementById('temperatureValue').textContent = temperatureValue;

  if (temperatureValue > 100.4) {
    // Add fever alert
  } else {
    // Remove any existing alerts
  }
}

function updateSleep() {
  const sleepValue = document.getElementById('sleep').value;
  document.getElementById('sleepValue').textContent = sleepValue;

  if (sleepValue < 7) {
    // Add insufficient sleep alert
  } else {
    // Remove any existing alerts
  }
}

function updateActivity() {
  const activityValue = document.getElementById('activity').value;
  document.getElementById('activityValue').textContent = activityValue;

  if (activityValue < 30) {
    // Add sedentary lifestyle alert
  } else {
    // Remove any existing alerts
  }
}



// Symptoms checker event listener
document.getElementById('checkSymptomsBtn').addEventListener('click', checkSymptoms);

// Symptoms checker function
function checkSymptoms() {
  const symptomsValue = document.getElementById('symptoms').value;
  // Call a Flask API endpoint to analyze the symptoms
  fetch('/check-symptoms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ symptoms: symptomsValue })
  })
  .then(response => response.json())
  .then(data => {
    // Display the symptoms analysis result
  })
  .catch(error => {
    // Handle the error
  });
}



// Medicine reminder event listeners
document.getElementById('addReminderBtn').addEventListener('click', addMedicationReminder);

// Medicine reminder functions
function addMedicationReminder() {
  const reminderTime = document.getElementById('medicationReminder').value;
  if (reminderTime) {
    // Add the reminder to the list
  }
}



// Handling the Symptoms Checker form submission
document.getElementById("checkSymptomsBtn").addEventListener("click", function() {
    const symptoms = document.getElementById("symptoms").value;
    const resultDiv = document.getElementById("symptomsResult");
    
    if (!symptoms) {
      resultDiv.style.display = "none"; // Hide result if symptoms are empty
      return;
    }
    
    // Simulating a call to a model (API call or model computation)
    simulateModelResponse(symptoms).then(result => {
      // Show the result div
      resultDiv.style.display = "block";
      
      // Set the result content
      resultDiv.innerHTML = `
        <h3>Suggested Diagnosis</h3>
        <p><strong>Symptoms: </strong>${symptoms}</p>
        <p><strong>Diagnosis: </strong>${result.diagnosis}</p>
        <p><strong>Advice: </strong>${result.advice}</p>
      `;
    }).catch(error => {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = `<p>Error processing symptoms. Please try again later.</p>`;
    });
  });
  
  // Simulate model response (you would replace this with actual model API call)
  function simulateModelResponse(symptoms) {
    return new Promise((resolve, reject) => {
      // Simulating response based on simple keywords in the symptoms
      setTimeout(() => {
        if (symptoms.toLowerCase().includes("fever") || symptoms.toLowerCase().includes("chills")) {
          resolve({
            diagnosis: "Possible Flu or Fever",
            advice: "Rest and hydrate. If symptoms persist, consult a doctor."
          });
        } else if (symptoms.toLowerCase().includes("headache")) {
          resolve({
            diagnosis: "Possible Migraine or Tension Headache",
            advice: "Take over-the-counter pain relief. Ensure proper hydration and rest."
          });
        } else if (symptoms.toLowerCase().includes("cough")) {
          resolve({
            diagnosis: "Possible Cold or Respiratory Infection",
            advice: "Drink warm fluids, avoid cold air, and rest."
          });
        } else {
          resolve({
            diagnosis: "General Symptoms",
            advice: "Consult a healthcare provider for further assessment."
          });
        }
      }, 2000);  // Simulate a 2 second delay for API/model processing
    });
  }
  