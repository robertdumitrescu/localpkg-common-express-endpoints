const endpoints = {
    appInfo: {
        isAlive: {
            partialUri: '/appInfo',
            method: 'GET',
            code: 8000,
            description: 'TO BE COMPLETED',
            typeOfAuth: 'Implicit'
        }
    },
    cache: {
        get: {
            partialUri: '/cache',
            method: 'GET',
            code: 8000,
            description: 'TO BE COMPLETED',
            typeOfAuth: 'Implicit'
        }
    }
};

module.exports = endpoints;