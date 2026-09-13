db = db.getSiblingDB('sda_training_dev');

db.createCollection('environment_checks');

db.environment_checks.insertOne({
  message: 'Day 15 MongoDB initialization completed',
  createdAt: new Date()
});