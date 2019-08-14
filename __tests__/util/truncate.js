// import mongoose from 'mongoose';
import { exec } from 'child_process';
import database from '../../src/database';

export default function truncate() {
  return Promise.all([
    Object.keys(database.connection.models).map(key => {
      return database.connection.models[key].destroy({
        truncate: true,
        force: true,
      });
    }),
    new Promise(resolve => {
      exec('yarn sequelize db:seed:undo:all', () => {
        return resolve();
      });
    }),
  ]);
}

// export const dropCollections = async () => {
//   await mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useFindAndModify: true,
//   });
//   const collections = await mongoose.connection.db.collections();
//   return Promise.all(
//     collections.map(async collection => {
//       if (collection.namespace === 'mg-tests-paketa.system.indexes')
//         return null;

//       return new Promise(async resolve => {
//         await collection.drop();
//         resolve();
//       });
//     })
//   );
// };
