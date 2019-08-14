import { exec } from 'child_process';

export default function() {
  return new Promise(resolve => {
    exec('yarn sequelize db:seed:all --debug', async () => {
      return resolve();
    });
  });
}
