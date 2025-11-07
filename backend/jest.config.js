const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: 'src/.*\\.test\\.ts$',
  clearMocks: true,
  setupFiles: ['dotenv/config'],
  bail: 1,
  verbose: true,
};

module.exports = config;