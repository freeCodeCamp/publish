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
npm run run-tools
```

### Run initial setup

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
role (Contributor and Editor) is seeded.

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

- API docs are available at: http://localhost:1337/documentation/v1.0.0. The
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
  - TODO: update this section when the invitation workflow is implemented.
  - You have to create the user on `backend` (Strapi) app **by signing in
    through the `frontend` (Next.js) app for the first time**. If you manually
    create the user of the same email address from the Strapi Admin panel
    beforehand, Next.js app will fail to get JWT token from Strapi. This is a
    [known issue in Strapi plugin](https://github.com/strapi/strapi/issues/12907).

## How to run the apps in production mode with Docker

### Build

The 'build' workflow will build the docker images for all the apps. To trigger a build, go to [the workflow](https://github.com/freeCodeCamp/publish/actions/workflows/build.yml) and click on the 'Run workflow' button.

### Deploy (VM)

After the build has completed, pull the latest images from Docker Hub:

```sh
docker image pull registry.digitalocean.com/fcc-cr/dev/publish-frontend:latest
docker image pull registry.digitalocean.com/fcc-cr/dev/publish-backend:latest
docker image pull registry.digitalocean.com/fcc-cr/dev/publish-cron:latest
```

Update the three environment files (`.env-frontend`, `.env-backend` and `.env-cron`) if there are any changes to the environment variables (compare them with the `apps/*/sample.env` files).

Then run the containers (stoppping any existing containers first):

```sh
docker run -d --env-file .env-backend -p 127.0.0.1:1337:1337 registry.digitalocean.com/fcc-cr/dev/publish-backend
docker run -d --env-file .env-frontend -p 127.0.0.1:3000:3000 registry.digitalocean.com/fcc-cr/dev/publish-frontend
```

To start the cron container, the `.env-cron` file's `STRAPI_ACCESS_TOKEN` must have an api token.  If there isn't one, create an api token in the [admin panel](https://publish-backend-anhgw.ondigitalocean.app/admin/settings/api-tokens/create) with the token type "custom" and one permission: `post.checkAndPublish`. Then run the cron container:

```sh
docker run -d --env-file .env-cron registry.digitalocean.com/fcc-cr/dev/publish-cron
```

#### Logs

The container logs are piped to log files in the home directory. To set this up:

```sh
docker logs -f publish-backend >> publish-backend.log &
docker logs -f publish-frontend >> publish-frontend.log &
docker logs -f publish-cron >> publish-cron.log &
```

### Deploy (DigitalOcean App Platform)

Almost everything is standard, but there are a few things to note:

App types: the `backend` and `frontend` apps need to be deployed as a `Web Service` and
 the `cron` app needs to be deployed as a `Worker`.
  
Environment variables

- `frontend` needs to have `NEXTAUTH_URL=${APP_URL}` otherwise follow the instructions in sample.env
- `backend` needs to have `APP_URL=${APP_URL}`, `NODE_ENV=production`, `HOST` can be omitted or set to `0.0.0.0`, `PORT` can also be omitted