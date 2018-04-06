## ribbon
A personal content management system project that uses **Express**, **MongoDB**.

## User Interface
Currently, both the front-end theme `flac` and the back-end administration panel are using the Angular 1 framework.

An extensive update is being applied onto the back-end administration panel. Check out the [arabesque](https://github.com/jtpox/ribbon/tree/arabesque) branch to try it out!

## Dependencies

 - [ExpressJS](https://expressjs.com/)
 - [Mongoose](http://mongoosejs.com/)

## Initial Setup

 1. Run `npm install`
 2. Edit `config/database.json` to link it to your MongoDB
 3. Run `node ribbon.js` to start the server.
 4. Visit `<url>/install` to set up initial database.
 5. Go to `<url>/ribbon` and log in with `admin@admin.com` and `password` to enter the admin panel.
 6. Create a new user before deleting the **admin** account!

## NGINX Proxy
If you are using NGINX as a proxy for ribbon, please enable `underscores_in_headers`. More information can be found [here](http://nginx.org/en/docs/http/ngx_http_core_module.html#underscores_in_headers).
