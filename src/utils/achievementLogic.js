import { ACHIEVEMENTS } from '../data/achievements';

/**
 * Checks for newly unlocked achievements based on user stats.
 * @param {Object} stats - Current user stats { xp, streak, lessonsCompleted, lastScorePercentage, distinctSubjects }
 * @param {Array} currentAchievements - Array of achievement IDs the user already has
 * @returns {Array} - Array of NEW achievement objects that were just unlocked
 */
export const checkNewAchievements = (stats, currentAchievements = []) => {
    const newUnlocks = [];
    const ownedIds = new Set(currentAchievements);

    // Helper to safely add unlock
    const unlock = (id) => {
        if (!ownedIds.has(id)) {
            const achievement = ACHIEVEMENTS.find(a => a.id === id);
            if (achievement) {
                newUnlocks.push(achievement);
                ownedIds.add(id); // Prevent duplicates in same batch
            }
        }
    };

    // --- XP Milestones ---
    if (stats.xp >= 100) unlock('xp_100');
    if (stats.xp >= 500) unlock('xp_500');
    if (stats.xp >= 1000) unlock('xp_1000');

    // --- Streak Milestones ---
    if (stats.streak >= 3) unlock('streak_3');
    if (stats.streak >= 7) unlock('streak_7');
    if (stats.streak >= 30) unlock('streak_30');

    // --- Lesson/Quiz Milestones ---
    if (stats.lessonsCompleted >= 1) unlock('first_steps');
    if (stats.lessonsCompleted >= 5) unlock('scholar');

    // --- Performance ---
    // Assuming lastScorePercentage is passed as 0-1 or 0-100. Let's assume 0-1 logic from Quiz.jsx
    // Or checking if score === totalQuestions
    if (stats.isPerfectScore) unlock('quiz_hero');

    return newUnlocks;
};
