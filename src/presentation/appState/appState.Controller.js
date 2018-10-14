'use strict';

/** NPM packages */
const express = require('express');
const router = express.Router();
const endpoints = require('../../../configs/common/endpoints');
const osUtils = require('os-utils');
const os = require('os');
const prettysize = require('prettysize');
const prettyMs = require('pretty-ms');
const usage = require('usage');
const Q = require('q');
const Lodash = require('lodash');
var cors = require('cors');


class AppStateIsAliveController {

    static usageLookup(pid) {
        let deferred = Q.defer();

        usage.lookup(pid, (err, result) => {
            if (err) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    }

    static getProcessData() {

        let result = {};
        result.nodeVersion = process.version;
        result.pid = process.pid;
        result.release = process.release;
        result.title = process.title;
        result.uId = process.getuid();
        result.hrtime = process.hrtime();
        result.uptime = Math.floor(process.uptime());

        return result;

    }

    static getEndpoints(app) {

        app = Lodash.clone(app);
        let routes = [];

        app._router.stack.forEach((middleware) => {
            if (middleware.route) { // routes registered directly on the app
                let route = {};
                route.path = middleware.route.path;
                route.method = Object.keys(middleware.route.methods)[0];
                routes.push(route);
            } else if (middleware.name === 'router') { // router middleware
                middleware.handle.stack.forEach((handler) => {
                    let route = {};
                    route.path = Lodash.clone(handler.route).path;
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


        if (request.query.processInfo !== 'false') {

            let processUsage = await AppStateIsAliveController.usageLookup(process.pid);

            successResponseDomainModel.data.nodeInstance = {
                processId: process.pid,
                usedMemory: processUsage.memory,
                usedMemoryReadable: prettysize(parseInt(processUsage.memory)),
                usedCPUPercentage: processUsage.cpu,
                uptime: osUtils.processUptime(),
                uptimeReadable: prettyMs(osUtils.processUptime() * 1000)
            };
        }

        if (request.query.endpoints !== 'false') {

            let endpoints = await AppStateIsAliveController.getEndpoints(app);

            successResponseDomainModel.data.endpoints = endpoints;
        }

        if (request.query.processData !== 'false') {

            let processData = AppStateIsAliveController.getProcessData();

            successResponseDomainModel.data.processData = processData;
        }

        return successResponseDomainModel;
    }
}

function argumentWrapper(app, endpointAddress) {

    return router.get(endpointAddress, cors(), (request, response) => {

        AppStateIsAliveController.process(request, app)
            .then((successResponseGenericModel) => {

                response.status(successResponseGenericModel.status).send(successResponseGenericModel);

            })
            .catch((errorResponseGenericModel) => {
                console.log(errorResponseGenericModel);
                response.status(errorResponseGenericModel.status).send(errorResponseGenericModel);
            });

    });
}


module.exports = argumentWrapper;
