const path = require('path');

module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint-config-airbnb",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
        "indent": [2, 2, { "SwitchCase": 1 }],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "camelcase": 0,
        "consistent-return": 0,
        "no-multi-spaces": 0,
        "no-use-before-define": 0,
        "no-underscore-dangle": 0,
        "no-mixed-operators": 0,
        "no-console": 0,
        "class-methods-use-this": 0,
        "react/prefer-stateless-function": 0,
        "react/jsx-filename-extension": 0,
        "react/forbid-prop-types": 0
    },
    settings: {
      'import/resolver': {
        [path.resolve('./eslint-import-resolver-react-native.js')]: {}
      },
      'import/core-modules': ['SYUI']
    },
}