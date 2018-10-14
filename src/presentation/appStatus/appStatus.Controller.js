'use strict';

/** NPM packages */
const express = require('express');
const router = express.Router();
var cors = require('cors');

class AppStatusController {

    static async process(request, app) {

        let successResponseDomainModel = {
            status: 200,
        };

        successResponseDomainModel.data = {};

        successResponseDomainModel.data.statusMessage = 'Online';

        return successResponseDomainModel;
    }
}

function argumentWrapper(app, endpointAddress) {

    return router.get(endpointAddress, cors(), (request, response) => {

        AppStatusController.process(request, app)
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
