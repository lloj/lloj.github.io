document.writeln("<div style=\"display:none\">");
//CNZZ统计
var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1256901495'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s95.cnzz.com/z_stat.php%3Fid%3D1256901495' type='text/javascript'%3E%3C/script%3E"));
//百度统计
var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?d6329c2086ec87a286b0b26a49a301c9";var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s);})();
//百度统计
// var _hmt = _hmt || [];
// (function() {
//   var hm = document.createElement("script");
//   hm.src = "https://hm.baidu.com/hm.js?20fc5a71308d998a9215bd0593c72703";
//   var s = document.getElementsByTagName("script")[0]; 
//   s.parentNode.insertBefore(hm, s);
// })();
//360统计
(function(b,a,e,h,f,c,g,s){b[h]=b[h]||function(){(b[h].c=b[h].c||[]).push(arguments)};
b[h].s=!!c;g=a.getElementsByTagName(e)[0];s=a.createElement(e);
s.src="//s.union.360.cn/"+f+".js";s.defer=!0;s.async=!0;g.parentNode.insertBefore(s,g)
})(window,document,"script","_qha",326460,false);
//火眼云
(function(para) {
    var p = para.sdk_url, n = 'huoYan', w = window, d = document, s = 'script',x = null,y = null;
    if(typeof(w['huoyanDataAnalytic']) !== 'undefined') {return false;}
    w['huoyanDataAnalytic'] = n;
    w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
    w[n]['quick'] = w[n].call(null, 'quick');
    w[n]['search'] = w[n].call(null, 'search');
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];x.async = 1;x.src = p;w[n].para = para;y.parentNode.insertBefore(x, y);
})({
    sdk_url: 'https://identify.tankeai.com/assets/js/identify.js',
    server_url: 'https://identify.tankeai.com'
});
var g_huoyan_opt = {
    site_id : 457,
    user_company:378
};
huoYan.quick('autoTrack',g_huoyan_opt);
document.writeln("</div>");