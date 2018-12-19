// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    globals: {
    },
    'env': {
        'es6': true,
        'browser': true
    },
    parserOptions: {
        parser: 'babel-eslint',
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "vue": true
        },
        sourceType: 'module'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    'rules': {
        "standard/no-callback-literal": 0,
        "bad-json": 0,
        "no-mixed-spaces-and-tabs": [2, true],
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": false,
                "ClassDeclaration": false,
                "ArrowFunctionExpression": false
            }
        }],
        "valid-jsdoc": ["error",
            {
                "prefer": {
                    "arg": "param",
                    "argument": "param",
                    "class": "class",
                    "constructor": "constructor",
                    // "return": "returns",
                    "virtual": "abstract"
                },
                "preferType": {
                    // "boolean": "Boolean",
                    // "number": "Number",
                    // "object": "Object",
                    // "string": "String"
                }, //类型格式
                "matchDescription": ".+", //必须写描述
                "requireReturn": false, //没有返回值可以不用写@return
                "requireReturnType": true, //必须写返回类型
                "requireReturnDescription": false,
                "requireParamDescription": true
            }
        ],
        "space-infix-ops": 0,
        // "linebreak-style": [2, "windows"], //换行风格
        'no-undef': 0,
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        "semi": ["error", "always"],
        "indent": [2, 4, {
            "SwitchCase": 1,
            "VariableDeclarator": 1,
            "MemberExpression": 1
        }],
        "eol-last": 0,
        "space-before-function-paren": 0,
        "one-var": 0,
        "eqeqeq": 0,
        "space-before-blocks": 2,
        "max-len":[2,140],
        "max-lines":[2,300],
        "no-unused-vars":0,
        "no-new":0
    }
}
