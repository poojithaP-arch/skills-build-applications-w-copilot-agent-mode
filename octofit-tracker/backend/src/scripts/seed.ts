import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

const teamData = [
  { name: 'Stride Society', totalPoints: 0 },
  { name: 'Peak Performers', totalPoints: 0 },
];

const userData = [
  {
    username: 'alex.morgan',
    email: 'alex.morgan@example.com',
    password: 'seeded-demo-account-no-login',
    firstName: 'Alex',
    lastName: 'Morgan',
    teamName: 'Stride Society',
    points: 320,
    activitiesCompleted: 12,
  },
  {
    username: 'sam.lee',
    email: 'sam.lee@example.com',
    password: 'seeded-demo-account-no-login',
    firstName: 'Sam',
    lastName: 'Lee',
    teamName: 'Stride Society',
    points: 275,
    activitiesCompleted: 10,
  },
  {
    username: 'jordan.rivera',
    email: 'jordan.rivera@example.com',
    password: 'seeded-demo-account-no-login',
    firstName: 'Jordan',
    lastName: 'Rivera',
    teamName: 'Peak Performers',
    points: 295,
    activitiesCompleted: 11,
  },
  {
    username: 'taylor.chen',
    email: 'taylor.chen@example.com',
    password: 'seeded-demo-account-no-login',
    firstName: 'Taylor',
    lastName: 'Chen',
    teamName: 'Peak Performers',
    points: 240,
    activitiesCompleted: 8,
  },
];

const activityData = [
  { username: 'alex.morgan', type: 'Running', duration: 35, calories: 310, date: '2026-09-25T07:30:00Z', notes: 'Steady riverside run' },
  { username: 'alex.morgan', type: 'Strength', duration: 45, calories: 260, date: '2026-09-23T17:00:00Z', notes: 'Full-body strength session' },
  { username: 'sam.lee', type: 'Cycling', duration: 50, calories: 420, date: '2026-09-25T08:00:00Z', notes: 'Neighborhood cycling loop' },
  { username: 'sam.lee', type: 'Yoga', duration: 30, calories: 110, date: '2026-09-22T18:30:00Z', notes: 'Mobility and recovery flow' },
  { username: 'jordan.rivera', type: 'Hiking', duration: 75, calories: 510, date: '2026-09-24T09:00:00Z', notes: 'Hill trail hike' },
  { username: 'jordan.rivera', type: 'Running', duration: 28, calories: 245, date: '2026-09-21T07:15:00Z', notes: 'Interval training' },
  { username: 'taylor.chen', type: 'Swimming', duration: 40, calories: 360, date: '2026-09-25T06:45:00Z', notes: 'Pool endurance laps' },
  { username: 'taylor.chen', type: 'Strength', duration: 32, calories: 205, date: '2026-09-20T16:00:00Z', notes: 'Upper-body circuit' },
];

const workoutData = [
  {
    title: 'Easy Start Run',
    description: 'A conversational-pace run with a short warm-up and cool-down.',
    activityType: 'Running',
    difficulty: 'beginner',
    duration: 25,
    calories: 220,
  },
  {
    title: 'Full-Body Basics',
    description: 'A balanced bodyweight circuit focused on foundational movements.',
    activityType: 'Strength',
    difficulty: 'beginner',
    duration: 30,
    calories: 210,
  },
  {
    title: 'Tempo Ride',
    description: 'Alternate steady cycling with short, controlled tempo efforts.',
    activityType: 'Cycling',
    difficulty: 'intermediate',
    duration: 40,
    calories: 380,
  },
  {
    title: 'Trail Climb',
    description: 'Build hill endurance with a consistent effort on rolling terrain.',
    activityType: 'Hiking',
    difficulty: 'intermediate',
    duration: 50,
    calories: 430,
  },
  {
    title: 'Swim Intervals',
    description: 'Alternate relaxed laps with short efforts to improve swim endurance.',
    activityType: 'Swimming',
    difficulty: 'advanced',
    duration: 35,
    calories: 400,
  },
];

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const teams = new Map<string, mongoose.Types.ObjectId>();
    for (const team of teamData) {
      const savedTeam = await Team.findOneAndUpdate(
        { name: team.name },
        { $setOnInsert: { ...team, members: [] } },
        { new: true, upsert: true, runValidators: true },
      );
      teams.set(team.name, savedTeam._id);
    }

    const users = new Map<string, mongoose.Types.ObjectId>();
    for (const user of userData) {
      const { teamName, points, activitiesCompleted, ...profile } = user;
      const savedUser = await User.findOneAndUpdate(
        { username: profile.username },
        { $set: { ...profile, team: teams.get(teamName) } },
        { new: true, upsert: true, runValidators: true },
      );
      users.set(user.username, savedUser._id);

      await Leaderboard.findOneAndUpdate(
        { user: savedUser._id },
        { $set: { points, activitiesCompleted } },
        { new: true, upsert: true, runValidators: true },
      );
    }

    for (const team of teamData) {
      const members = userData.filter((user) => user.teamName === team.name);
      await Team.updateOne(
        { _id: teams.get(team.name) },
        {
          $addToSet: { members: { $each: members.map((member) => users.get(member.username)) } },
          $set: { totalPoints: members.reduce((total, member) => total + member.points, 0) },
        },
      );
    }

    for (const activity of activityData) {
      const { username, ...details } = activity;
      const user = users.get(username);
      await Activity.findOneAndUpdate(
        { user, type: details.type, date: new Date(details.date), notes: details.notes },
        { $set: { ...details, user, date: new Date(details.date) } },
        { new: true, upsert: true, runValidators: true },
      );
    }

    for (const workout of workoutData) {
      await Workout.findOneAndUpdate(
        { title: workout.title },
        { $set: workout },
        { new: true, upsert: true, runValidators: true },
      );
    }

    const counts = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      Leaderboard.countDocuments(),
      Workout.countDocuments(),
    ]);

    console.log('Database seeding complete', {
      users: counts[0],
      teams: counts[1],
      activities: counts[2],
      leaderboard: counts[3],
      workouts: counts[4],
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
