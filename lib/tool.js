module.exports = {
  whatline,
  make_ts_err,
};


function whatline(code, start, end) {
  let l = 1;
  for (let i=start; i<end; ++i) {
    if (code[i] == '\n') {
      l++;
    }
  }
  return l;
}


function prev_line_pos(code, pos) {
  let r = {begin :pos, end :pos};
  for (let i=pos; i>=0; --i) {
    if (code[i] == '\n') {
      r.begin = i+1;
      break;
    }
  }
  for (let i=pos; i<code.lenth; ++i) {
    if (code[i] == '\n') {
      r.end = i;
      break;
    }
  }
  return r;
}


function make_ts_err(diagnostic, code, filename) {
  console.log(diagnostic)
  let line = whatline(code, 0, diagnostic.start);
  
  let buf = ['TypeScript ', filename, ' line: ', line, '\n'];
  let last = prev_line_pos(code, diagnostic.start);
  buf.push(code.substring(last.begin, last.end), '\n');

  for (let i=diagnostic.start - last.begin; i>0; --i) buf.push(' ');
  buf.push('^ ', diagnostic.messageText);
  let err = new Error(buf.join(''));
  err.code = diagnostic.code;
  return err;
}