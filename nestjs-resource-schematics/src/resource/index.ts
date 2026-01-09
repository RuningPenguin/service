import { apply, applyTemplates, mergeWith, move, Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

export function resource(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!options.name) {
      throw new Error('Option "name" is required (e.g. --name user)');
    }

    // 日志，方便调试
    _context.logger.info(`Generating resource: ${options.name}`);

    // 模板路径，相对于 index.ts
    const templatePath = url('./files');

    // 目标生成路径
    const targetPath = options.path ? options.path : '';

    // 应用模板
    const source = apply(templatePath, [
      applyTemplates({
        ...options,
        ...strings
      }),
      move(targetPath)
    ]);

    // merge 模板到树
    return mergeWith(source)(tree, _context);
  };
}

export default resource;
