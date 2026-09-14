db = db.getSiblingDB(
  'sda_training'
);

db.createCollection(
  'docker_checks'
);

db.docker_checks.insertOne({
  message:
    'Day 16 MongoDB initialization completed',

  createdAt:
    new Date()
});