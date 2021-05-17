const FILE_PROTOCOL = "file://";

class Nfs {
  //
  // fileloader -- Function(url, xdata, callback: Function(error, content))
  //
  constructor(fileloader, xdata) {
    this.deps = [];
    this.fileloader = fileloader;
    this.data = xdata;
  }

  load(url, done) {
    if (url.startsWith(FILE_PROTOCOL)) {
      url = url.substr(FILE_PROTOCOL.length);
    }
    this.loadfile(url, done);
  }

  loadfile(url, done) {
    this.fileloader(url, this.data, (err, content)=>{
      if (err) return done(err);
      this.deps.push(url);
      done(null, content);
    });
  }
}

module.exports = Nfs;