module.exports = {
    "env": {
        "es6": false,
        "node": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": false
        },
        "sourceType": "module"
    },
    "rules": {
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
        "no-underscore-dangle": 0,
        "func-names": [
            "error",
            "as-needed"
        ],
        "camelcase": 0,
        "no-console": 0,
        "no-plusplus": [
            "error",
            {
                "allowForLoopAfterthoughts": true
            }
        ]
    }
};