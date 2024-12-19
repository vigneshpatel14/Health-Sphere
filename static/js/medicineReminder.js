document.addEventListener('DOMContentLoaded', function() {
  const reminderInput = document.getElementById('medicationReminder');
  const addReminderBtn = document.getElementById('addReminderBtn');
  const remindersList = document.getElementById('remindersList');
  
  if (!reminderInput || !addReminderBtn || !remindersList) {
    console.error('Missing reminder DOM elements');
    return;
  }

  // Load saved reminders
  const savedReminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]');
  savedReminders.forEach(reminder => addReminderToList(reminder));
  
  addReminderBtn.addEventListener('click', function() {
    const time = reminderInput.value;
    if (!time) {
      alert('Please select a time for the reminder');
      return;
    }
    
    addReminderToList(time);
    
    const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]');
    if (!reminders.includes(time)) {
      reminders.push(time);
      localStorage.setItem('medicationReminders', JSON.stringify(reminders));
    }
    
    reminderInput.value = '';
  });
  
  function addReminderToList(time) {
    const reminderDiv = document.createElement('div');
    reminderDiv.className = 'reminder-item';
    reminderDiv.innerHTML = `
      <span>${formatTime(time)}</span>
      <button class="delete-btn">Delete</button>
    `;

    const deleteBtn = reminderDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
      reminderDiv.remove();
      const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]');
      const updatedReminders = reminders.filter(r => r !== time);
      localStorage.setItem('medicationReminders', JSON.stringify(updatedReminders));
    });

    remindersList.appendChild(reminderDiv);
    scheduleNotification(time);
  }
});

function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function scheduleNotification(time) {
  if (!("Notification" in window)) {
    console.warn('Notifications not supported');
    return;
  }
  
  Notification.requestPermission().then(function(permission) {
    if (permission === "granted") {
      const [hours, minutes] = time.split(':');
      const now = new Date();
      let notificationTime = new Date();
      notificationTime.setHours(parseInt(hours));
      notificationTime.setMinutes(parseInt(minutes));
      notificationTime.setSeconds(0);
      
      if (notificationTime < now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }
      
      const timeUntilNotification = notificationTime - now;
      
      setTimeout(() => {
        new Notification("Medication Reminder", {
          body: "It's time to take your medication!"
        });
      }, timeUntilNotification);
    }
  });
}