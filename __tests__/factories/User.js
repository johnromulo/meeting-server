import faker from 'faker';

export default {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};
