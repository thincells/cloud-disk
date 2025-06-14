module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release'
      ]
    ]
  }
}
// { value: 'feat', name: 'feat:     新增功能feature' },
// { value: 'fix', name: 'fix:      修复bug缺陷' },
// { value: 'types', name: 'types:    类型修改' },
// { value: 'docs', name: 'docs:     仅仅修改了文档变更，比如readme，changelog等' },
// { value: 'perf', name: 'perf:     性能优化' },
// { value: 'style', name: 'style:    代码格式（不影响功能，例如空格、分号等格式修正）' },
// { value: 'refactor', name: 'refactor: 代码重构（不包括 bug 修复、功能新增）' },
// { value: 'test', name: 'test:     添加、修改测试用例' },
// { value: 'build', name: 'build:    构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）' },
// { value: 'ci', name: 'ci:       修改 CI 配置、脚本' },
// { value: 'revert', name: 'revert:   回滚 commit' },
// { value: 'wip', name: 'wip:      功能开发中' },
// { value: 'workflow', name: 'workflow: 工作流程变更' },
// { value: 'chore', name: 'chore:    对构建过程或辅助工具和库的更改（不影响源文件、测试用例）' },
// { value: 'revert', name: 'revert:    回滚到上一个版本' },
