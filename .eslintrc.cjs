module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        'indent': ['error', 4, { SwitchCase: 1, MemberExpression: 0 }], /* 4个空格缩进 */
        'semi': ["error", "never"], /* 结尾加分号 */
        'trailingComma': 0, /* 代码末尾不需要逗号 */
        'no-eval': 'off',   /* 禁用 eval() */
        'no-extend-native': 'off',  /* 禁止扩展原生类型 */
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
        'vue/no-mutating-props': 0,
        'vue/valid-v-bind-sync': 'off',
        'vue/html-indent': ['error', 4],    /* 关闭html缩进 */
        'vue/html-self-closing': 'off', /* 关闭自闭合 */
        'vue/max-attributes-per-line': 'off',   /* 关闭强制换行 */
        'object-property-newline': 'off',   /* 关闭对象导入强制换行 */
        'vue/multi-word-component-names': 'off',    /* 关闭检查组件名是否单词或驼峰, 组件名可为单独一个词语，故关闭此功能 */
        'vue/no-reserved-component-names': 'off',   /* 防止 Vue 组件与标准 HTML 元素和内置组件之间的名称冲突, 组件所有名称均为大 */
        'complexity': 'off',    /* 指定程序中允许的最大环路复杂度 */
        '@typescript-eslint/no-explicit-any': 'off',    /* 允许代码中使用any类型，但请勿随意使用 */
        'comma-dangle': ['error', 'never'], /* 禁止尾随逗号 */
        'linebreak-style': [0, 'error', 'window'],   /* 忽略window换行符检测 */
        'quotes': ["error", "single"]
    }
}
