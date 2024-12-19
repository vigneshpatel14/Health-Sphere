document.addEventListener('DOMContentLoaded', function() {
    const symptomsTextarea = document.getElementById('symptoms');
    const checkSymptomsBtn = document.getElementById('checkSymptomsBtn');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('symptomsResult');
  
    if (!symptomsTextarea || !checkSymptomsBtn || !loadingDiv || !resultsDiv) {
      console.error('Missing symptoms checker DOM elements');
      return;
    }
  
    checkSymptomsBtn.addEventListener('click', function() {
      const symptoms = symptomsTextarea.value.trim();
      
      if (!symptoms) {
        alert("Please describe your symptoms.");
        return;
      }
  
      loadingDiv.style.display = 'block';
      resultsDiv.innerHTML = '';
      
      fetch('/api/predict-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        loadingDiv.style.display = 'none';
  
        if (data.disease && data.description && data.precautions && 
            data.medications && data.workout && data.diets) {
          
          resultsDiv.innerHTML = `
            <h3>Predicted Disease</h3>
            <p><strong>${data.disease}</strong></p>
            
            <h3>Description</h3>
            <p>${data.description}</p>
            
            <h3>Precautions</h3>
            <ul>
              ${data.precautions.map(p => `<li>${p}</li>`).join('')}
            </ul>
            
            <h3>Medications</h3>
            <ul>
              ${data.medications.map(m => `<li>${m}</li>`).join('')}
            </ul>
            
            <h3>Suggested Workouts</h3>
            <ul>
              ${data.workout.map(w => `<li>${w}</li>`).join('')}
            </ul>
            
            <h3>Recommended Diets</h3>
            <ul>
              ${data.diets.map(d => `<li>${d}</li>`).join('')}
            </ul>
          `;
        } else {
          throw new Error('Invalid response data structure');
        }
      })
      .catch(error => {
        loadingDiv.style.display = 'none';
        console.error("Error:", error);
        resultsDiv.innerHTML = `
          <div class="alert danger">
            An error occurred while analyzing symptoms. Please try again later.
          </div>
        `;
      });
    });
  });