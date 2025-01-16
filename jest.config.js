module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  transformIgnorePatterns: ['node_modules/(?!bcryptjs|troublesome-dependency/.*)'], // Ensuring bcryptjs isn't ignored
  moduleNameMapper: {
    '@bff/(.*)': '<rootDir>/src/$1',
    '@mock/(.*)': '<rootDir>/test/__mocks__/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
};
