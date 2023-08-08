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

1. Create a copy of the `.env.example` file and name it `.env`.

1. Run `docker compose up`

1. Run `npm run cs import` to import config from `config/sync/*` files into
   database

Visit http://localhost:1337/admin to access the admin panel.

You will be prompted to create an Admin account if there is no account in your
local environment yet.

1. Under `General > Settings > Users & Permissions Plugin > Providers`, enable
   `Google` and `Local` providers. Follow this [link](
   https://next-auth.js.org/providers/google#configuration) to get Google OAuth
   credentials. In the dialog box in Strapi, set the redirect URL to front-end
   app to `http://localhost:3000/api/auth/callback/google`(this url doesn't
   matter as it's mainly used when Strapi handles the complete auth flow which
   is not the case for us).

### Run publish-frontend (Next.js) app

1. In another terminal, go to `publish-frontend` directory
1. Create a copy of the `sample.env.local` file and name it `.env.local`. Add
   required values. Use the same Google OAuth credentials as you used for
   `publish-backend` (Strapi) app.
1. Run `npm install`
1. Make sure the backend Strapi app is running in another terminal. Then start
   the frontend Next.js app by running `npm run dev`.
1. Visit http://localhost:3000/ to access the authoring site

### Run publish-11ty-test (11ty) app

1. In another terminal, go to `publish-11ty-test` directory
1. Run `yarn install`
1. Make sure the backend Strapi app is running in another terminal. Then run
   `yarn serve` to build the static site and serve it.
1. Visit http://localhost:8080/ to see the user-facing site

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

- Currently, we use Google OAuth as a sign-in method. This is just a temporary
  solution for testing/development.

  - You have to create the user on `publish-backend` (Strapi) app **by signing
    in through the `publish-frontend` (Next.js) app for the first time**. If you
    manually create the user of the same email address from the Strapi Admin
    panel beforehand, Next.js app will fail to get JWT token from Strapi. This
    is a
    [known issue in Strapi plugin](https://github.com/strapi/strapi/issues/12907).
