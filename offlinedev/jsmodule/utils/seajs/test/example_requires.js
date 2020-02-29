define(function(require, exports, module) {
    'use strict';
    require(
        `./rk.jq`
        );
    require(
        
        `./rk.oa`
        
        
        );
    //require('xxx')
    /**
     * 
     * require('shit')
     * 
     * 
     */
        require(`./rk.breeze`);
    require(
        './_rk/rk.error');
    require('./_rk/rk.bizcode'
    );
    require(`./_rk/rk.monitor`);
    require("./_rk/rk.i18nHelper");
    var rk = require("./rk.crm"
    );
    rk.formMgr = require(`platform/manager/formMgr`);
    rk.dataMgr = require(`platform/manager/dataMgr`);
    return rk;
});
