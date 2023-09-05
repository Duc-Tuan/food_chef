const mongoose = require('mongoose');

const {
  MONGO_HOST,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_DBNAME,
  MONGO_LOCAL,
  MONGO_HOST_CONNECT,
  MONGO_DBNAME_CONNECT,
} = process.env;

let uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST_CONNECT}/${MONGO_DBNAME_CONNECT}?retryWrites=true&w=majority`;

if (MONGO_LOCAL) {
  uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`;
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose
  .connect(uri)
  .then(() => console.log('connection success: ' + uri))
  .catch((error: any) => console.error(`connection failed ${error}`));
