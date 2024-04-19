import * as mongoose from 'mongoose';

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbAuth = encodeURIComponent(process.env.DB_AUTH);
const dbName = process.env.DB_NAME;
const dbUser = encodeURIComponent(process.env.DB_USER);
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);

const dbUrl = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=${dbAuth}&directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1`;
const dbUri = `mongodb+srv://zahamza200:ibvfPW3cj2AubmRg@cluster0.tka7nl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Use existing database connection
    return;
  }
  // Use new database connection
  const db = await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
