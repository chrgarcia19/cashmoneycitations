import mongoose from 'mongoose';

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbAuth = encodeURIComponent(process.env.DB_AUTH);
const dbName = process.env.DB_NAME;
const dbUser = encodeURIComponent(process.env.DB_USER);
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);

const dbUrl = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;


const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Use existing database connection
    return;
  }
  // Use new database connection
  const db = await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
