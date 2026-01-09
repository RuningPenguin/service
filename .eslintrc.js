module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
    // 'plugin:prettier/recommended', // 将 Prettier 插入 ESLint 的规则中
    // 'prettier', // 关闭与 Prettier 冲突的 ESLint 规则
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // 强制使用单引号
    quotes: [2, 'single'],
    // 强制使用分号
    semi: [2, 'always'],
    // 强制对象最后不加逗号
    'comma-dangle': [2, 'never'],
    // 强制逗号前无空格，逗号后有空格
    'comma-spacing': [2, { before: false, after: true }],
    // 强制 if while function 后面的 { 必须与 if 在同一行
    'brace-style': [2, '1tbs', { allowSingleLine: true }],
    // 使用 [] 方括号取值时， [ 后面和 ] 前面不能加空格
    'computed-property-spacing': [2, 'never'],
    // 强制 if else while for do 后面的代码块使用 {} 包裹
    curly: [0, 'all'],
    // 强制 switch 语句必须有 default 选项
    'default-case': 2,
    // 强制 Object.key 中 . 与属性在同一行
    'dot-location': [2, 'property'],
    // 文件末尾强制换行
    'eol-last': 2,
    // 禁止在 else 前有 return
    'no-else-return': 2,
    // 使用 === 替代 ==
    eqeqeq: [2, 'allow-null'],
    // 禁止使用数组构造器
    'no-array-constructor': 2,
    // 禁止在条件表达式中使用赋值语句
    'no-cond-assign': 2,
    // 禁止修改 const 声明的变量
    'no-const-assign': 2,
    // 禁止在条件中使用常量表达式
    'no-constant-condition': 2,
    // 对象字面量不允许重复
    'no-dupe-keys': 2,
    // 块语句中的内容不能为空
    'no-empty': 2,
    // 禁止非必要的括号
    'no-extra-parens': 0,
    // 禁止多余的空格
    'no-multi-spaces': 2,
    // 空行不超过一行
    'no-multiple-empty-lines': [2, { max: 1 }],
    // 函数调用时，函数名与 () 之间不能有空格
    'no-spaced-func': 2,
    // 行尾不能有空格
    'no-trailing-spaces': 2,
    // 禁止不必要的嵌套
    'no-unneeded-ternary': 2,
    // 不能有无法执行的代码
    'no-unreachable': 2,
    // 禁止无用的表达式
    'no-unused-expressions': 2,
    // 未定义前不能使用
    'no-use-before-define': 0,
    // 禁用var
    'no-var': 2,
    // 箭头函数 => 前后必须有空格
    'arrow-spacing': 2,
    // 箭头函数参数必须使用括号包裹
    'arrow-parens': 2,
    // 取消 eslint-plugin-vue 对组件名的校验
    'vue/multi-word-component-names': 0,
    // template 必须只有一个根节点
    'vue/no-multiple-template-root': 0,
    // typescript
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-require-imports': 'off', // 允许 require
    '@typescript-eslint/no-unsafe-function-type': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' } // 允许以 _ 开头的变量未使用
    ]
  }
};
