module.exports = {
    collectCoverageFrom: [
        '**/*.js',
        '!node_modules/**',
        '!coverage/**'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 85,
            lines: 85,
            statements: 85
        }
    }
};
