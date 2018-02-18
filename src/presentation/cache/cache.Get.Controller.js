"use strict";

/** NPM packages*/
const express = require('express');
const router = express.Router();
const endpoints = require('../../../configs/common/endpoints');
const usage = require('usage');
const Q = require('q');
const Lodash = require('lodash');


class CacheGetController {
    static async get(mcache) {

        let successResponseDomainModel = {
            status: 200,
        };

        successResponseDomainModel.data = {
            keys: mcache.keys(),
            raw: mcache.exportJson()
        };

        return successResponseDomainModel;
    }
}

function argumentWrapper(app, mcache) {

    const endpointAddress = "/api" + endpoints.cache.get.partialUri;

    return router.get(endpointAddress, function (request, response) {

        CacheGetController.get(mcache)
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