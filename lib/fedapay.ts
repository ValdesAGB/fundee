const { FedaPay, Transaction } = require('fedapay');

/**
 * Initialize FedaPay with environment variables.
 */
export function initFedaPay() {
    const apiKey = process.env.FEDAPAY_SECRET_KEY;
    const environment = process.env.FEDAPAY_ENVIRONMENT || 'sandbox';

    if (!apiKey) {
        console.warn('FEDAPAY_SECRET_KEY is not defined. FedaPay will not work correctly.');
        return;
    }

    FedaPay.setApiKey(apiKey);
    FedaPay.setEnvironment(environment);
}

export { Transaction };
