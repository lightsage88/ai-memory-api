const express = require('express');

/**
 * This module defines a `load` and `attach` function which are responsible for loading all server modules that will
 * be initialized during startup of the server.
 */

const Configure = module.exports = {
    /**
     * @type {Array}
     */
    expressModules: [],

    /**
     * Loads in the modules that will be instantiated upon attachment to an express app via `attach(...)`.
     */
    load: async function () {
        Configure.log = (await import('@appku/stashku-log')).default;
        Configure.expressModules.push(await import('./configure-express.js'));
        Configure.expressModules.push(await import('./routers/api.js'));
    },
    /**
     * Attaches an express instance to the loaded modules, by constructing each module and passing the express instance
     * into the module's default constructor.
     * @param {express} app - The owning express instance.
     */
    attach: function (app) {
        let router = express.Router();
        app.locals.modules = [];
        for (let mod of Configure.expressModules) {
            Configure.log.debug(`Loaded module "${mod.default.name}".`);
            app.locals.modules.push(new mod.default(app, router, Configure.log));
            app.use(router);
            Configure.log.debug(`Module "${mod.default.name}" initialized.`);
        }
    }
};