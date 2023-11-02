# Documentation

This repository contains 4 separate apps:

- **backend (Strapi)**

  - Works as a backend CMS that has database and provides web APIs

- **frontend (Next.js)**

  - Works as a frontend web app where our publication
    authors/editors/translators write articles.

- **cron (Node.js)**

  - Works as a task scheduler

- **publish-11ty-test (11ty)**

  - Generates user-facing static site.

  - _This app is just for testing during the development. We are going to
    replace this with our current 11ty app, eventually._

## How to run the apps locally

### Clone the repository

1. Clone this repository

### Setup prerequisites

Prerequisites:

- PostgreSQL
- mailhog (optional)
- Turborepo

We recommend mailhog for testing emails when developing locally, but it's
optional.

If you're managing PostgreSQL manually (and don't need mailhog), you can skip
this section. Otherwise:

```sh
cd tools
docker compose up -d
cd ..
```

OR

Alternatively, you can use `npm run run-tools` in the root directory to start up
these services.

### Run initial setup

Copy the sample env files.

```sh
cp apps/backend/sample.env apps/backend/.env
cp apps/frontend/sample.env apps/frontend/.env
cp apps/cron/sample.env apps/cron/.env
```

Follow the instructions in the `.env` files to setup the secrets.

Install dependencies.

```sh
npm ci
```

Import strapi config and create seed data.

```sh
npm run seed
```

### Run the apps

```sh
npm run develop
```

To setup your strapi admin account, visit http://localhost:1337/admin and follow
the instructions.

Note: This is an account to login to the admin panel. It's different from the
account to login to the frontend app.

Once this is complete you will see the seeded data in the admin panel and you
can use the seeded users to login in the Next.js app. Email and password of the
seeded users are in `src/seed/index.js` file. One account of each
role(Contributor and Editor) is seeded.

Go to http://localhost:3000/ to see the frontend app and login with a seeded
user.

## Notes

### backend (Strapi)

- The Admin panel will be for developers only. Contributors will write articles
  on `frontend` (Next.js) app.

- You need to run the Strapi app in development mode to modify any Content-Type
  (data structure). If you use `docker compose up` it's configured to do so.

- 💡 If you change configurations from the Admin panel, make sure to export
  those config by running `npm run cs export`. This command will generate files
  under `config/sync` directory. Include those files in your Git commit. For
  more details see: https://market.strapi.io/plugins/strapi-plugin-config-sync

- API docs is available at: http://localhost:1337/documentation/v1.0.0 . The
  Strapi app needs to be running to view the docs.

#### How to use Admin Panel

- You can manage authors (users to access frontend app) from
  `Content Manager > User`

- You can manage admin users (users to access Strapi admin panel) from
  `Settings > ADMINISTRATION PANEL > Users`

- You can change data models from `Content-Type Builder`

- You can modify what data to expose through API from
  `Settings > USERS & PERMISSIONS PLUGIN > Roles > Public`

### frontend (Next.js)

- We will be using Auth0 as a sign-in method in production

  - You have to create the user on `backend` (Strapi) app **by signing in
    through the `frontend` (Next.js) app for the first time**. If you manually
    create the user of the same email address from the Strapi Admin panel
    beforehand, Next.js app will fail to get JWT token from Strapi. This is a
    [known issue in Strapi plugin](https://github.com/strapi/strapi/issues/12907).

## How to run the apps in production mode with Docker

### backend (Strapi)

To build the docker image:

```
docker compose -f docker-compose.prod.yml build
```

To start the docker container: (Replace `***` with the values you want to set
for the environment variables.)

```
VARIABLE1_NAME=*** VARIABLE2_NAME=*** ... \
docker compose -f docker-compose.prod.yml up -d
```

Alternatively, using .env file: (Replace .env with the path to the .env file you
want to use)

```
docker compose --env-file .env -f docker-compose.prod.yml up -d
```

Refer to `.env.example` for the list of environment variables.

To stop the docker container:

```
docker compose -f docker-compose.prod.yml down
```

#### Initial setup

The app requires some configurations for full functionality.

- Import config

```
# Go into the strapi-production container
docker exec -it strapi-production sh

# Import config
npm run cs import
```

- Visit admin panel and create the first admin account

- In Content Manager, create `Invited User` entry for the first user. This will
  allow the first user on the frontend app to login using Auth0. Set the
  following values:
  - email: valid email you can login using Auth0
  - role: choose "Editor" (unless you can't invite other users)
  - accepted: false
- In Settings > Providers, enable `auth0`.
- (If you want to access endpoints that uses API token) In Settings > API
  Tokens, generate API tokens

### frontend (Next.js)

To build the docker image:

```
docker compose -f docker/production/docker-compose.yml build
```

To start the docker container: (Replace `***` with the values you want to set
for the environment variables)

```
NEXTAUTH_SECRET=*** AUTH0_CLIENT_ID=*** AUTH0_CLIENT_SECRET=*** \
NEXT_PUBLIC_STRAPI_BACKEND_URL=*** NEXTAUTH_URL=*** AUTH0_DOMAIN=*** \
docker compose -f docker/production/docker-compose.yml up -d
```

Alternatively, using .env file:

```
docker compose --env-file .env -f docker/production/docker-compose.yml up -d
```

To stop the docker container:

```
docker compose -f docker/production/docker-compose.yml down
```
