let workouts = [
    { date: '2025-09-20', type: 'Running', duration: 30, calories: 300 },
    { date: '2025-09-21', type: 'Cycling', duration: 45, calories: 400 },
    { date: '2025-09-22', type: 'Swimming', duration: 60, calories: 500 },
];
let goal = 0;
let progressChart = null;

function updateWorkoutTable() {
    const tbody = $("#workoutTable tbody");
    tbody.empty();
    workouts.forEach((workout, index) => {
        tbody.append(`<tr>
            <td>${workout.date}</td>
            <td><span class="badge badge-primary">${workout.type}</span></td>
            <td>${workout.duration}</td>
            <td><span class="badge badge-danger">${workout.calories}</span></td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteWorkout(${index})">Delete</button></td>
        </tr>`);
    });
}

function deleteWorkout(index) {
    workouts.splice(index, 1);
    updateWorkoutTable();
    updateProgressChart();
    checkGoalStatus();
}

function updateProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const dates = workouts.map(w => w.date);
    const calories = workouts.map(w => parseInt(w.calories));

    const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
    ];

    const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Calories Burned 🔥',
                data: calories,
                backgroundColor: backgroundColors.slice(0, calories.length),
                borderColor: borderColors.slice(0, calories.length),
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: {font: {weight: 'bold'}, color: '#333'} },
                title: {
                    display: true,
                    text: '🏋️ Your Workout Progress - Calories Burned Over Time 📈',
                    font: {size: 18, weight: 'bold'},
                    color: '#2c3e50'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {color: 'rgba(0,0,0,0.1)'},
                    ticks: { color: '#2c3e50', font: {weight: 'bold'} }
                },
                x: {
                    grid: {color: 'rgba(0,0,0,0.1)'},
                    ticks: { color: '#2c3e50', font: {weight: 'bold'} }
                }
            },
            animation: { duration: 1000, easing: 'easeOutBounce' }
        }
    });
}

function checkGoalStatus() {
    const totalCalories = workouts.reduce((sum, w) => sum + parseInt(w.calories), 0);
    const goalElement = $("#goalStatus");

    if (goal > 0) {
        const percentage = Math.round((totalCalories / goal) * 100);
        goalElement.removeClass('d-none alert-success alert-warning alert-info');

        if (totalCalories >= goal) {
            goalElement.addClass('alert-success');
            goalElement.html(`🎉 <strong>Congratulations!</strong> Goal achieved! Total: ${totalCalories}/${goal} calories (${percentage}%)`);
        } else if (percentage >= 75) {
            goalElement.addClass('alert-warning');
            goalElement.html(`💪 <strong>Almost there!</strong> ${(goal - totalCalories)} calories to go! (${percentage}% complete)`);
        } else {
            goalElement.addClass('alert-info');
            goalElement.html(`🎯 <strong>Keep going!</strong> Total: ${totalCalories}/${goal} calories (${percentage}% complete)`);
        }

        goalElement.show();
    } else {
        goalElement.hide();
    }
}

$(document).ready(function () {
    $("#date").val(new Date().toISOString().split('T')[0]);
    updateWorkoutTable();
    updateProgressChart();
    checkGoalStatus();
});

$("#workoutForm").on('submit', function (e) {
    e.preventDefault();
    const type = $("#type").val();
    const duration = $("#duration").val();
    const calories = $("#calories").val();
    const date = $("#date").val();

    workouts.push({ date, type, duration, calories });
    updateWorkoutTable();
    updateProgressChart();
    checkGoalStatus();

    this.reset();
    $("#date").val(new Date().toISOString().split('T')[0]);
});

$("#setGoal").on('click', function () {
    goal = parseInt($("#goal").val()) || 0;
    checkGoalStatus();
    if (goal > 0) {
        alert(`🎯 Goal set to ${goal} calories!`);
    }
});
