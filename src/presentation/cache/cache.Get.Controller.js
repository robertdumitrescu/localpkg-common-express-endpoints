'use strict';

/** NPM packages */
const express = require('express');
const router = express.Router();

class CacheGetController {
    static async get(mcache) {

        let successResponseDomainModel = {
            status: 200,
        };

        successResponseDomainModel.data = {
            cachedRequests: mcache.exportJson()
        };

        return successResponseDomainModel;
    }
}

function argumentWrapper(app, mcache, endpointAddress) {

    return router.get(endpointAddress, (request, response) => {

        CacheGetController.get(mcache)
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
