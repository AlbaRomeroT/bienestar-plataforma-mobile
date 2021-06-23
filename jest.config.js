const esModules = ['@ionic'].join('|');

module.exports = {
  preset: "jest-preset-angular",
  coverageDirectory: './coverage/bolivarconmigo',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'], // leave `<rootDir>` string as is
  globals: {
    'ts-jest': {
      babelConfig: {
        presets: [
          [
            '@babel/preset-env',
            { targets: { node: true }, modules: 'commonjs' }
          ]
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import']
      },
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ]
      },
    },
  },
  // To transform Ionic modules to UMD, because Jest can't import them otherwise
  // (see here: https://medium.com/@gregor.woiwode/how-to-setup-jest-in-an-ionic-4-project-ff1e5b72dd79)
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})`
  ],
  displayName: 'BolivarConmigo',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'json'],
  coverageThreshold: {
    "global": {
      "lines": 80,
      "statements": 80
    }
  },
  collectCoverageFrom: [
    "src/app/**/*.{js,ts}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/e2e/",
    "!<rootDir>/src/app/enums/**/*.ts",
    "!<rootDir>/src/app/interfaces/**/*.ts",
    "!<rootDir>/src/app/models/**/*.ts",
    "!<rootDir>/src/app/**/*.module.ts"
  ],
  moduleNameMapper: {
    "^@app(.*)$": "<rootDir>/src/app$1",
    "^@assets(.*)$": "<rootDir>/src/assets$1",
    "^@environments(.*)$": "<rootDir>/src/environments$1",
    "^@components(.*)$": "<rootDir>/src/app/components$1",
    "^@interfaces(.*)$": "<rootDir>/src/app/interfaces$1",
    "^@models(.*)$": "<rootDir>/src/app/models$1",
    "^@pages(.*)$": "<rootDir>/src/app/pages$1",
    "^@pipes(.*)$": "<rootDir>/src/app/pipes$1",
    "^@validators(.*)$": "<rootDir>/src/app/validators$1",
  } 
};