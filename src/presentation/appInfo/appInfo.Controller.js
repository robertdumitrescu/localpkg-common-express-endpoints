"use strict";

/** NPM packages*/
const express = require('express');
const router = express.Router();
const endpoints = require('../../../configs/common/endpoints');
const osUtils = require('os-utils');
const os = require('os');
const prettysize = require("prettysize");
const prettyMs = require('pretty-ms');
const usage = require('usage');
const Q = require('q');
const Lodash = require('lodash');


class AppInfoIsAliveController {

    static usageLookup(pid) {
        let deferred = Q.defer();

        usage.lookup(pid, function (err, result) {
            if (err) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    }

    static getEndpoints(app) {

        app = Lodash.clone(app);

        let route = {};
        let routes = [];

        app._router.stack.forEach(function(middleware){
            if(middleware.route){ // routes registered directly on the app
                routes.push(middleware.route);
                route.path = middleware.route.path;
                route.method = Object.keys(middleware.route.methods)[0];
                routes.push(route);
            } else if(middleware.name === 'router'){ // router middleware
                middleware.handle.stack.forEach(function(handler){
                    route.path = handler.route.path;
                    route.method = Object.keys(handler.route.methods)[0];
                    routes.push(route);
                });
            }
        });


        return routes;
    }

    static async process(request, app) {

        let successResponseDomainModel = {
            status: 200,
        };

        successResponseDomainModel.data = {};

        if (request.query.systemInfo === "true") {

            let osCPUs = os.cpus();

            successResponseDomainModel.data.sytem = {
                platform: osUtils.platform() + ' ' + os.hostname() + ' Arch: ' + os.arch() + ' Kernel: ' + os.release(),
                ram: {
                    total: osUtils.totalmem(),
                    totalReadable: prettysize(parseInt(osUtils.totalmem() * 1024 * 1024)),
                    free: osUtils.freemem(),
                    freeReadable: prettysize(parseInt(osUtils.freemem() * 1024 * 1024)),
                    usedPercentage: 100 - ((osUtils.freemem() * 100) / osUtils.totalmem())
                },
                cpu: {
                    name: osCPUs[0].model,
                    count: osCPUs.length
                },
                uptime: {
                    system: osUtils.sysUptime(),
                    systemReadable: prettyMs(osUtils.sysUptime() * 1000)
                }
            };
        }

        if (request.query.processInfo === "true") {

            let processUsage = await AppInfoIsAliveController.usageLookup(process.pid);

            successResponseDomainModel.data.nodeInstance = {
                processId: process.pid,
                usedMemory: processUsage.memory,
                usedMemoryReadable: prettysize(parseInt(processUsage.memory)),
                usedCPUPercentage: processUsage.cpu,
                uptime: osUtils.processUptime(),
                uptimeReadable: prettyMs(osUtils.processUptime() * 1000)
            }
        }

        if (request.query.endpoints === "true") {

            let endpoints = await AppInfoIsAliveController.getEndpoints(app);

            successResponseDomainModel.data.endpoints = endpoints;
        }


        return successResponseDomainModel;
    }
}

function argumentWrapper(app) {

    const endpointAddress = "/api" + endpoints.appInfo.isAlive.partialUri;

    return router.get(endpointAddress, function (request, response) {

        AppInfoIsAliveController.process(request, app)
            .then(function (successResponseGenericModel) {

                response.status(successResponseGenericModel.status).send(successResponseGenericModel);

            })
            .catch(function (errorResponseGenericModel) {
                console.log(errorResponseGenericModel);
                response.status(errorResponseGenericModel.status).send(errorResponseGenericModel);
            });

    });
}


module.exports = argumentWrapper;