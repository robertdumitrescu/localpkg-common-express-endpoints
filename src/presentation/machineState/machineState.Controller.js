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
var cors = require('cors');
const Lodash = require('lodash');
const GenericFilesHelper = require('localpkg-generic-helper').GenericFilesHelper;


class MachineStateController {

    static async process(request, app) {

        let successResponseDomainModel = {
            status: 200,
        };

        successResponseDomainModel.data = {};

        if (request.query.systemInfo !== 'false') {

            let osCPUs = os.cpus();

            successResponseDomainModel.data.system = {
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

        if (request.query.machineSetupInfo !== 'false') {

            console.log(request.query.ptv);
            let vp = []; // vp - verified paths
            for (let ptvi = 0; ptvi < request.query.ptv.length; ptvi++){
                let verifedPath = await GenericFilesHelper.listFilesAndDetails(request.query.ptv[ptvi]);
                vp.push(verifedPath);
            }

            successResponseDomainModel.data.machineSetup = {};
            successResponseDomainModel.data.machineSetup.vp = vp;
        }


        return successResponseDomainModel;
    }
}

function argumentWrapper(app, endpointAddress) {

    return router.get(endpointAddress, cors(), (request, response) => {

        MachineStateController.process(request, app)
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
