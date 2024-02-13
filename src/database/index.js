const mongoose = require('mongoose');

const Database = {
  db: null,
  connect: async () => {
    try {
      const connectionString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

      this.db = await mongoose.connect(connectionString);
      this.db.syncIndexes();

      console.log(
        `Connected to the database: ${process.env.DB_NAME} at ${process.env.DB_HOST}:${process.env.DB_PORT}`
      );
    } catch (error) {
      console.error('Error connecting to the database: ', error);
    }
  },
};

module.exports = Database;
