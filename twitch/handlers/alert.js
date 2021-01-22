const client = require('../../discord/client')


function alert(type) {

    switch (type) {
        case 'creeper':
                console.log('[Debug] Creeper alert received')
            break;
        case 'help':
            console.log('[Debug] Help alert received')

            break;
        case 'techsupport':
            console.log('[Debug] Tech support alert received')

            break;

        default:
            break;
    }
}


module.exports = {
    alert: alert
}