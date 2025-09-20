module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Mock static assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|jpg|png|gif|webp|ico)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts)$': ['ts-jest', { tsconfig: 'tsconfig.json', useESM: false }],
    '^.+\\.(tsx|jsx)$': 'babel-jest',
    '^.+\\.(js)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/__tests__/api-ai-insights.test.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(react|react-dom|@radix-ui|@floating-ui|@testing-library)/)'
  ],
};
