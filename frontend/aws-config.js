// AWS Configuration
const AWS_CONFIG = {
    API_BASE_URL: 'https://b5mu3mgkj1.execute-api.ap-south-1.amazonaws.com/prod',
    USER_ID: 'yash1912' // Replace with dynamic user authentication later
};

// API Functions
async function apiRequest(endpoint, options = {}) {
    const url = `${AWS_CONFIG.API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Workout API Functions
const WorkoutAPI = {
    async create(workout) {
        return apiRequest('/workouts', {
            method: 'POST',
            body: JSON.stringify({
                userId: AWS_CONFIG.USER_ID,
                ...workout
            })
        });
    },
    
    async getAll() {
        return apiRequest(`/workouts?userId=${AWS_CONFIG.USER_ID}`);
    },
    
    async delete(workoutId) {
        return apiRequest(`/workouts/${workoutId}`, {
            method: 'DELETE'
        });
    },
    
    async getProgressData(exercise) {
        const response = await this.getAll();
        const workouts = response.workouts || [];
        
        // Filter by exercise and sort by date
        const exerciseWorkouts = workouts
            .filter(w => w.exercise.toLowerCase() === exercise.toLowerCase())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return exerciseWorkouts.map(w => ({
            date: w.date,
            maxWeight: Math.max(...w.weight)
        }));
    },
    
    async getVolumeData() {
        const response = await this.getAll();
        const workouts = response.workouts || [];
        
        // Group by day of week
        const weeklyVolume = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
        
        workouts.forEach(workout => {
            const dayOfWeek = new Date(workout.date).getDay();
            const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to Sunday=6
            weeklyVolume[adjustedDay] += workout.sets;
        });
        
        return weeklyVolume;
    }
};