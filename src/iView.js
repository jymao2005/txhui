//import Vue from "vue"

//UI framework iView
//import 'iview/dist/styles/iview.css';    // 使用 CSS



// es6 polyfill
//import 'core-js/fn/array/find-index';
/*
import "vue-awesome/icons/picture-o.js"
import "vue-awesome/icons/bold.js"
import "vue-awesome/icons/smile-o.js"
import "vue-awesome/icons/list-ul.js"
import "vue-awesome/icons/search.js"
*/

//import "normalize.css"
import 'element-ui/lib/theme-default/base.css';

import {search, smileO, code, pictureO, questionCircle, bars} from "vue-awesome"; 

var tmp = {search, smileO, code, pictureO, questionCircle, bars};


//console.log("bold:", search)
import IconFA from "vue-awesome/components/Icon.vue";

import {Input, Loading, Icon, Tag, Button, Tabs
        , TabPane, Breadcrumb, BreadcrumbItem
        , ButtonGroup
        , Dialog
        , Select
        , Option
        , Popover
        , Progress
        , Message
        , Form
        , FormItem
        , Menu,
          Submenu,
          MenuItem,
          MenuItemGroup

} from "element-ui";
//import Input from 'iview/src/components/input';
//import LoadingBar from 'iview/src/components/loading-bar';

import Editor from "./components/editor/Editor.vue"
import Timeline from "./components/timeline/Timeline.vue"
import TimelineItem from "./components/timeline/TimelineItem.vue"

const iview = {
    Input,
    IconFA,
    Icon,
    Loading,
    Tag
    ,Button
    ,Tabs
    ,TabPane
    ,Breadcrumb
    ,BreadcrumbItem
    ,Editor
    ,ButtonGroup
    ,Timeline
    ,TimelineItem
    ,Dialog
    ,Select
    ,Option
    ,Popover
    ,Progress
    ,Message
    ,Form
    ,FormItem
    , Menu,
      Submenu,
      MenuItem,
      MenuItemGroup
};

function formatTS(ts){
    if(ts<0){
        return "00:00:00";
    }
    var sec = ts%60;
    var inMin = Math.floor(ts/60);
    var min = inMin%60;
    var inHour = Math.floor(inMin/60);
    var fn = (num)=>{
        return num>9?(""+num):('0'+num);
    }
    return `${fn(inHour)}:${fn(min)}:${fn(sec)}`;
}

function formatDatetime(dtStr){
    var d = new Date(dtStr);
    var now = new Date();
    
    var diff = Math.max( (now - d), 0);
    
    
    var divide = (num, division)=>Math.floor(num/division);
    
    
    var sec = divide(diff, 1000);
    var min = divide(sec, 60);
    var hour = divide(min, 60);
    var day = divide(hour, 24);
    var month = divide(day, 30);
    var year = divide(month, 12);
    return (year && d.toLocaleDateString())
        || (month && month+"月前")
        || (day && day+"天前")
        || (hour && hour+"小时前")
        || (min && min +"分钟前")
        || (sec+"秒前");
}


import {mapState, mapMutation} from "vuex";

import Clickoutside from 'element-ui/src/utils/clickoutside';

const install = function (Vue, opts = {}) {
//    locale.use(opts.locale);
//    locale.i18n(opts.i18n);

    Object.keys(iview).forEach((key) => {
        Vue.component(key, iview[key]);
    });

    Vue.directive("clickoutside", Clickoutside);
    Vue.use(Loading.directive);

    Vue.prototype.$loading = Loading.service;
    
    Vue.prototype.formatTS = formatTS;
    Vue.prototype.formatDatetime = formatDatetime;
    Vue.prototype.$message = Message;

  //  Vue.prototype.mapState = mapState;
    Object.assign(Vue.prototype, {
        mapState,
        mapMutation
    })
//    Vue.prototype.$Loading = LoadingBar;

};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

module.exports = Object.assign(iview, {install});   // eslint-disable-line no-undef
