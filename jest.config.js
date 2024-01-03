module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
 rootDir: path.resolve(__dirname, '..', '..', '..'),
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  testTimeout: 1000 * 60 * 2, // We may need a long time to compile a bundle, and then set up an environment
   slowTestThreshold: 60,
 transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json', 
      // Use ts-node to transpile TypeScript files during runtime
      // This might help with esModuleInterop issues
      compiler: 'ts-node',
    },
  },
};
