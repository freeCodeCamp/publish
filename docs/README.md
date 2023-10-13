# Documentation

This repository contains 3 separate apps:

- **publish-backend (Strapi)**

  - Works as a backend CMS that has database and provides web APIs

- **publish-frontend (Next.js)**

  - Works as a frontend web app where our publication
    authors/editors/translators write articles.

- **publish-11ty-test (11ty)**

  - Generates user-facing static site.

  - _This app is just for testing during the development. We are going to
    replace this with our current 11ty app, eventually._

## How to run the apps locally

### Clone the repository

1. Clone this repository

### Run publish-backend (Strapi) app

1. Change directory to `publish-backend` directory

2. Create a copy of the `.env.example` file and name it `.env`

3. Run `npm install`

4. Run `docker compose up`

5. In another terminal, go to `publish-backend` and run `npm run cs import`.
   This will import config from `config/sync/*` files into the database.

6. Visit http://localhost:1337/admin to access the admin panel

7. You will be prompted to create an Admin account if there is no account in
   your local environment yet. Create an account here.

Note: This is an account to login to the admin panel. It's different from the
account to login to the frontend app.

8. Stop the docker container by running `docker compose down`

Note: Seeding the database works only on a fresh setup of the containers.

9. Change the `SEED_DATA` value in `.env` file to `true`

10. Run `docker compose up` again

11. If you see `Seeding database complete!` message in the terminal, stop the
    docker container by running `docker compose down`.

12. Change the `SEED_DATA` value in `.env` file back to `false`

13. Run `docker compose up` again to start the app. You will see the seeded
    data and you can use the seeded users to login in the Next.js app. Email
    and password of the seeded users are in `src/seed/index.js` file. One 
    account of each role(Contributor and Editor) is seeded.

### Run publish-frontend (Next.js) app

1. In another terminal, go to `publish-frontend` directory
2. Create a copy of the `sample.env.local` file and name it `.env.local`. Add
   required values.
3. Run `npm install`
4. Make sure the backend Strapi app is running in another terminal. Then start
   the frontend Next.js app by running `npm run dev`.
5. Visit http://localhost:3000/ to access the authoring site

### Run publish-11ty-test (11ty) app

1. In another terminal, go to `publish-11ty-test` directory
2. Run `yarn install`
3. Make sure the backend Strapi app is running in another terminal. Then run
   `yarn serve` to build the static site and serve it.
4. Visit http://localhost:8080/ to see the user-facing site

- If you made changes to the contents saved in the backend database, you will
  need to re-build the static site by running `yarn serve` again to see the
  changes.

## Notes

### publish-backend (Strapi)

- The Admin panel will be for developers only. Contributors will write articles
  on `publish-frontend` (Next.js) app.

- You need to run the Strapi app in development mode to modify any Content-Type
  (data structure). If you use `docker compose up` it's configured to do so.

- 💡 If you change configurations from the Admin panel, make sure to export
  those config by running `npm run cs export`. This command will generate files
  under `config/sync` directory. Include those files in your Git commit. For
  more details see: https://market.strapi.io/plugins/strapi-plugin-config-sync

- API docs is available at: http://localhost:1337/documentation/v1.0.0 . The
  Strapi app needs to be running to view the docs.

#### How to use Admin Panel

- You can manage authors (users to access publish-frontend app) from
  `Content Manager > User`

- You can manage admin users (users to access Strapi admin panel) from
  `Settings > ADMINISTRATION PANEL > Users`

- You can change data models from `Content-Type Builder`

- You can modify what data to expose through API from
  `Settings > USERS & PERMISSIONS PLUGIN > Roles > Public`

### publish-frontend (Next.js)

- We will be using Auth0 as a sign-in method in production

  - You have to create the user on `publish-backend` (Strapi) app **by signing
    in through the `publish-frontend` (Next.js) app for the first time**. If you
    manually create the user of the same email address from the Strapi Admin
    panel beforehand, Next.js app will fail to get JWT token from Strapi. This
    is a
    [known issue in Strapi plugin](https://github.com/strapi/strapi/issues/12907).

## How to run the apps with Docker

### publish-backend (Strapi)

To build the docker image:

```
docker compose -f docker-compose.prod.yml build
```

To start the docker container:
(Replace `***` with the values you want to set for the environment variables.)
```
VARIABLE1_NAME=*** VARIABLE2_NAME=*** ... \
docker compose -f docker-compose.prod.yml up -d
```

Alternatively, using .env file:
(Replace .env with the path to the .env file you want to use)
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

- In Content Manager, create `Invited User` entry for the first user. This will allow the first user on the frontend app to login using Auth0. Set the following values:
  - email: valid email you can login using Auth0
  - role: choose "Editor" (unless you can't invite other users)
  - accepted: false
- In Settings > Providers, enable `auth0`.
- (If you want to access endpoints that uses API token) In Settings > API Tokens, generate API tokens

### publish-frontend (Next.js)

The following commands build and run the app in production mode.

To build the docker image:
```
docker compose -f docker/production/docker-compose.yml build
```

To start the docker container:
(Replace `***` with the values you want to set for the environment variables)
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
