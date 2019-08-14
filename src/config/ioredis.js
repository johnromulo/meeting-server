import RedisMock from 'ioredis-mock';
import Redis from 'ioredis';

export default process.env.NODE_ENV === 'test' ? RedisMock : Redis;
