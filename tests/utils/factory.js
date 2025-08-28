import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Developer',
  {},
  {
    _id: faker.string.uuid,
    name: faker.person.firstName,
    bio: faker.lorem.paragraph,
    avatar: faker.image.url,
  }
);

export default factory;
