"use strict";

/** NPM packages*/
const express = require('express');
const router = express.Router();
const endpoints = require('../../../configs/common/endpoints');

class CacheDeleteController {
    static async hardDelete(mcache) {

        let successResponseDomainModel = {
            status: 200,
        };

        let x = mcache.clear();

        successResponseDomainModel.x = x;

        return successResponseDomainModel;
    }
}

function argumentWrapper(app, mcache) {

    const endpointAddress = "/api" + endpoints.cache.delete.partialUri;

    return router.delete(endpointAddress, function (request, response) {

        CacheDeleteController.hardDelete(mcache)
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