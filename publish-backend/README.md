# Prototype for new CMS (Backend: Strapi)

## How to run locally

1. Clone this repository
1. Add `.env` file and add values Yoko shared
1. Run `npm install`
1. Run `npm run cs import` to import config from `config/sync/*` files into database
1. Run `npm run develop` to start the Strapi app in development mode
Note: You need to run the server in development mode to modify any Content-Type (data structure).
1. Visit http://localhost:1337/admin to access the admin panel. (This will be the Admin panel for developers/staff. Contributors will write articles in separate authoring site which will be a Next.js app.)
1. You will be prompted to create an Admin account if there is no account in your local environment yet.

- You can manage admin users from `Settings > ADMINISTRATION PANEL > Users`
- You can manage authors (users created through authroing site) from `Content Manager > User`

These are for developers:
- You can modify data models from `Content-Type Builder`
- You can modify what data to expose through API from `Settingss > USERS & PERMISSIONS PLUGIN > Roles > Public`
- If you change configurations from Admin panel, make sure to export those config by running `npm run cs export`. It will generate files under `config/sync` directory. Include those filed in your Git commit. For more details see: https://market.strapi.io/plugins/strapi-plugin-config-sync
