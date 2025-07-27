// Utility functions
function validateCommaSeparated(value, count) {
    const values = value.split(',').map(v => v.trim());
    return values.length === count && values.every(v => !isNaN(v) && v !== '');
}

// Home page functionality
if (document.getElementById('workoutForm')) {
    const form = document.getElementById('workoutForm');
    document.getElementById('date').valueAsDate = new Date();
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const sets = parseInt(formData.get('sets'));
        const reps = formData.get('reps');
        const weight = formData.get('weight');
        
        // Validation
        if (!validateCommaSeparated(reps, sets)) {
            alert(`Reps must contain exactly ${sets} comma-separated numbers`);
            return;
        }
        
        if (!validateCommaSeparated(weight, sets)) {
            alert(`Weight must contain exactly ${sets} comma-separated numbers`);
            return;
        }
        
        const workout = {
            date: formData.get('date'),
            exercise: formData.get('exercise'),
            category: formData.get('category'),
            sets: sets,
            reps: reps.split(',').map(r => parseInt(r.trim())),
            weight: weight.split(',').map(w => parseFloat(w.trim()))
        };
        
        try {
            await WorkoutAPI.create(workout);
            alert('✅ Workout logged successfully!');
            form.reset();
            document.getElementById('date').valueAsDate = new Date();
        } catch (error) {
            alert('❌ Error saving workout: ' + error.message);
        }
    });
}

// History page functionality
if (document.getElementById('historyTable')) {
    const tableBody = document.getElementById('historyTableBody');
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    let allWorkouts = [];
    
    async function loadWorkouts() {
        try {
            const response = await WorkoutAPI.getAll();
            allWorkouts = response.workouts || [];
            renderWorkouts(allWorkouts);
        } catch (error) {
            console.error('Error loading workouts:', error);
            tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading workouts</td></tr>';
        }
    }
    
    function renderWorkouts(workouts) {
        if (workouts.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No workouts logged yet. Start your fitness journey!</td></tr>';
            return;
        }
        
        tableBody.innerHTML = workouts.map(workout => `
            <tr>
                <td>${workout.date}</td>
                <td>${workout.exercise}</td>
                <td>${workout.category}</td>
                <td>${workout.sets}</td>
                <td>${Array.isArray(workout.reps) ? workout.reps.join(', ') : workout.reps}</td>
                <td>${Array.isArray(workout.weight) ? workout.weight.join(', ') : workout.weight}</td>
                <td><button class="btn-delete" onclick="deleteWorkout('${workout.workoutId}')">Delete</button></td>
            </tr>
        `).join('');
    }
    
    function filterWorkouts() {
        const searchTerm = searchInput.value.toLowerCase();
        const dateValue = dateFilter.value;
        const categoryValue = categoryFilter.value;
        
        const filtered = allWorkouts.filter(workout => {
            const matchesSearch = workout.exercise.toLowerCase().includes(searchTerm) || 
                                workout.category.toLowerCase().includes(searchTerm);
            const matchesDate = !dateValue || workout.date === dateValue;
            const matchesCategory = !categoryValue || workout.category === categoryValue;
            return matchesSearch && matchesDate && matchesCategory;
        });
        
        renderWorkouts(filtered);
    }
    
    searchInput.addEventListener('input', filterWorkouts);
    dateFilter.addEventListener('change', filterWorkouts);
    categoryFilter.addEventListener('change', filterWorkouts);
    
    // Load workouts on page load
    loadWorkouts();
}

async function deleteWorkout(workoutId) {
    if (confirm('Are you sure you want to delete this workout?')) {
        try {
            await WorkoutAPI.delete(workoutId);
            
            // Reload workouts if on history page
            if (document.getElementById('historyTable')) {
                const tableBody = document.getElementById('historyTableBody');
                const searchInput = document.getElementById('searchInput');
                const dateFilter = document.getElementById('dateFilter');
                const categoryFilter = document.getElementById('categoryFilter');
                
                let allWorkouts = [];
                
                async function loadWorkouts() {
                    try {
                        const response = await WorkoutAPI.getAll();
                        allWorkouts = response.workouts || [];
                        renderWorkouts(allWorkouts);
                    } catch (error) {
                        console.error('Error loading workouts:', error);
                        tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading workouts</td></tr>';
                    }
                }
                
                function renderWorkouts(workouts) {
                    if (workouts.length === 0) {
                        tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No workouts logged yet. Start your fitness journey!</td></tr>';
                        return;
                    }
                    
                    tableBody.innerHTML = workouts.map(workout => `
                        <tr>
                            <td>${workout.date}</td>
                            <td>${workout.exercise}</td>
                            <td>${workout.category}</td>
                            <td>${workout.sets}</td>
                            <td>${Array.isArray(workout.reps) ? workout.reps.join(', ') : workout.reps}</td>
                            <td>${Array.isArray(workout.weight) ? workout.weight.join(', ') : workout.weight}</td>
                            <td><button class="btn-delete" onclick="deleteWorkout('${workout.workoutId}')">Delete</button></td>
                        </tr>
                    `).join('');
                }
                
                await loadWorkouts();
            }
        } catch (error) {
            alert('❌ Error deleting workout: ' + error.message);
        }
    }
}

// Progress page functionality
if (document.getElementById('weightChart')) {
    let weightChart, volumeChart;
    
    async function createWeightChart(exercise) {
        const ctx = document.getElementById('weightChart').getContext('2d');
        
        if (weightChart) weightChart.destroy();
        
        try {
            const progressData = await WorkoutAPI.getProgressData(exercise);
            
            if (progressData.length === 0) {
                // Show empty state
                ctx.fillStyle = '#888';
                ctx.font = '16px Poppins';
                ctx.textAlign = 'center';
                ctx.fillText(`No data for ${exercise}`, ctx.canvas.width/2, ctx.canvas.height/2);
                return;
            }
            
            const labels = progressData.map(d => new Date(d.date).toLocaleDateString());
            const weights = progressData.map(d => d.maxWeight);
            
            weightChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${exercise} Max Weight (lbs)`,
                        data: weights,
                        borderColor: '#00ffcc',
                        backgroundColor: 'rgba(0, 255, 204, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#ff4081',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#ffffff' } }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#ffffff' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: {
                            ticks: { color: '#ffffff' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error loading progress data:', error);
        }
    }
    
    async function createVolumeChart() {
        const ctx = document.getElementById('volumeChart').getContext('2d');
        
        try {
            const volumeData = await WorkoutAPI.getVolumeData();
            
            volumeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Workout Volume (sets)',
                        data: volumeData,
                        backgroundColor: [
                            'rgba(0, 255, 204, 0.8)',
                            'rgba(255, 64, 129, 0.8)',
                            'rgba(0, 212, 255, 0.8)',
                            'rgba(255, 107, 53, 0.8)',
                            'rgba(0, 255, 204, 0.8)',
                            'rgba(255, 64, 129, 0.8)',
                            'rgba(0, 212, 255, 0.8)'
                        ],
                        borderColor: [
                            '#00ffcc', '#ff4081', '#00d4ff', '#ff6b35',
                            '#00ffcc', '#ff4081', '#00d4ff'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#ffffff' } }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#ffffff' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: {
                            ticks: { color: '#ffffff' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error loading volume data:', error);
        }
    }
    
    const exerciseSelect = document.getElementById('exerciseSelect');
    const chartTitle = document.getElementById('chartTitle');
    
    // Populate exercise dropdown with user's exercises
    async function loadExerciseOptions() {
        try {
            const response = await WorkoutAPI.getAll();
            const workouts = response.workouts || [];
            const uniqueExercises = [...new Set(workouts.map(w => w.exercise))];
            
            exerciseSelect.innerHTML = '';
            
            if (uniqueExercises.length === 0) {
                exerciseSelect.innerHTML = '<option value="">No exercises logged yet</option>';
                return;
            }
            
            uniqueExercises.forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise;
                option.textContent = exercise;
                exerciseSelect.appendChild(option);
            });
            
            // Load first exercise chart
            if (uniqueExercises.length > 0) {
                chartTitle.textContent = `Weight Progression - ${uniqueExercises[0]}`;
                createWeightChart(uniqueExercises[0]);
            }
        } catch (error) {
            console.error('Error loading exercises:', error);
        }
    }
    
    exerciseSelect.addEventListener('change', function() {
        const selectedExercise = this.value;
        if (selectedExercise) {
            chartTitle.textContent = `Weight Progression - ${selectedExercise}`;
            createWeightChart(selectedExercise);
        }
    });
    
    // Initialize charts with real data
    loadExerciseOptions();
    createVolumeChart();
}