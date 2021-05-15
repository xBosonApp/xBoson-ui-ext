const AbsFileMgr = require("less/lib/less/environment/abstract-file-manager.js").default;
const createLess = require("less/lib/less").default;
const env = require("less/lib/less-node/environment").default;
const PluginLoader = require('less/lib/less-node/plugin-loader').default


class LessFilemanager extends AbsFileMgr {
  constructor(fs) {
    super();
    this.fs = fs;
  }
  
  supports() {
    return true;
  }

  supportsSync() {
    return true;
  }

  loadFile(filename, dir, options, env, callback) {
    try {
      callback(null, this.loadFileSync(filename, dir, options, env));
    } catch(err) {
      callback(err);
    }
  }

  loadFileSync(filename, dir, options, env) {
    // filename 与 import 参数相同
    return {
      contents : this.fs.load(filename),
      filename : filename,
    };
  }
}


function create(_fs) {
  let lessl = createLess(env, new LessFilemanager(_fs));
  lessl.PluginLoader = PluginLoader;
  return lessl;
}


module.exports = {
  create,
}