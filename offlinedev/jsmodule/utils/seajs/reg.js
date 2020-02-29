/**
 * Single source of truth:
 * <docs-ingage-frontend>
 * rkPacker\parsers\reg.js
 * 
 */

let PATH_REGEX = /('|"|`)[\w\/{}\.&\+\-\_\~\:\/\?\=]{0,}('|"|`)/ig;
let REQUIRE_REGEX = /require[\s]*\([\s]*('|"|`)[\w\/{}\.&\+\-\_\~\:\/\?\=]{0,}('|"|`)\s{0,}\)/ig
let REQUIRE_ASYNC_REGEX = /require\.async[\s]*\([\s]*('|"|`)[\w\/{}\.&\+\-\_\~\:\/\?\=]{0,}('|"|`)[\s\S]\s*\,*\+*\)?/ig

let shouldIgnore = (fpath)=>{
    if( /\/lib\//g.test(fpath)
    || /\/oldcrm\//g.test(fpath)
    || /\.bundle\./g.test(fpath)
    || /\.min\./g.test(fpath)
    || /\-sdk\-/g.test(fpath)
    || /node_modules/g.test(fpath)){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    PATH_REGEX,
    REQUIRE_REGEX,
    REQUIRE_ASYNC_REGEX,
    shouldIgnore
};