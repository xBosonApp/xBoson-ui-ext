const Evaluator = require('stylus/lib/visitor/evaluator');
const nodes = require('stylus/lib/nodes')

let fs;


class DefEval extends Evaluator {
  constructor(root, options) {
    super(root, options);
  }

  //TODO 实现自定义文件加载器
  visitImport(imported) {
    let def_err;
    try {
      return super.visitImport(imported);
    } catch(err) {
      def_err = err;
    }

    console.log('imported', imported);
    this.return++;

    let path = this.visit(imported.path).first.string
      , literal;

    this.return--;

    // Literal
    if (/\.css(?:"|$)/.test(path)) {
      literal = true;
      if (!imported.once && !this.includeCSS) {
        return imported;
      }
    }

    if (!literal && !/\.styl$/i.test(path)) path += '.styl';

    try {
      let str = fs.load(path);
      let block = new nodes.Block;
      let parser = new Parser(str, utils.merge({ root: block }, this.options));
      block.push(parser.parse());
      return block;
    } catch(e) {
      throw def_err;
    }
  }
}


function init(_fs) {
  fs = _fs;
}


module.exports = {
  init,
  DefEval,
}