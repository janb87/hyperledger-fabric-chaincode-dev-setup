const path = require('path');
const {SCRIPTS_PATH} = require('./constants');
const startShell = require('./utils/startShell');
const getChaincodeName = require('./utils/getChaincodeName');

module.exports = function upgradeChaincode(chaincodeLocation, version) {
    const chaincodeName = getChaincodeName(chaincodeLocation);

    const shellEnvVariables = {
        'CHAINCODE_NAME': chaincodeName,
        'CHAINCODE_JS': 'chaincode.js',
        'VERSION': version
    };

    console.log(`Upgrading chaincode for ${chaincodeName} with env variables: ${JSON.stringify(shellEnvVariables)}`);

    return new Promise((resolve, reject) => {
        startShell(path.join(SCRIPTS_PATH, 'deployChaincode.sh'), shellEnvVariables, 5000)
            .then(() => startShell(path.join(SCRIPTS_PATH, 'upgradeChaincode.sh'), shellEnvVariables))
            .then(resolve)
            .catch((err) => {
                console.log(`Upgrading chaincode failed`, err);
                reject(err);
            });
    });
};