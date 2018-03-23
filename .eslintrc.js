module.exports = {
    "env": {
        "es6": false,
        "node": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "class-methods-use-this": 0,
        "no-underscore-dangle": [
            "warn",
        ],
        "func-names": [
            "error",
            "as-needed"
        ],
        "camelcase": 0,
        "no-console": 0
    }
};