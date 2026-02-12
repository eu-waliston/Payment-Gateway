module.exports = {
    mutate: [
        'reports/**/*.js',
        'storage/**/*.js'
    ],
    testRunner: 'jest',
    reporters: ['clear-text', 'progress', 'html'],
    coverageAnalysis: 'perTest',
    jest: {
        projectType: 'custom',
        configFile: 'jest.config.js'
    },
    thresholds: {
        high: 80,
        low: 60,
        break: 50
    }
};
