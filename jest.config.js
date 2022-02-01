module.exports = async () => {
    return {
        verbose: true,
        setupFilesAfterEnv: ['./jest.setup.js'],
    };
};