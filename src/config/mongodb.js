/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

//gBavtrTf4GpxVrAg
const mongoDb_uri =
  "mongodb+srv://vuvandao:gBavtrTf4GpxVrAg@cluster0.6cgid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = "trello-BE";
import { MongoClient, ServerApiVersion } from "mongodb";

let trelloDatabaseInstance = null;
const mongoClientInstance = new MongoClient(mongoDb_uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  trelloDatabaseInstance = mongoClientInstance.db(databaseName);
};
export const GET_DB = () => {
  if (!trelloDatabaseInstance) {
    throw new Error("Cannot connect your database");
  }
  return trelloDatabaseInstance;
};
