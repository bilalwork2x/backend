
## Description

Project is using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Technical Stack
- Developed using **NestJS**
- **MongoDB** as the database
- **JWT** for authentication
- **TypeScript** for type safety

### Features
- Sign-up and sign-in API endpoints
- Password hashing with **bcryptjs**
- JWT token generation for authentication
- Security best practices with **Helmet**


## Installation

```bash
$ npm install
```
### Set environment variables in a .env file:
```
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
ALLOWED_ORIGIN=<your_allowed_origin>
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Author

- Author - Bilal Javed

## License
[MIT licensed](LICENSE).

