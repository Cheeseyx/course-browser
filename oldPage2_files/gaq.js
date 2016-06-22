// ANALYTICS

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-3265888-1', 'auto', {'legacyCookieDomain': '.macalester.edu'});
ga('send', 'pageview');

_gaq = function () {
	ga('send', 'event', 'Analytics Error', 'Page attempted to use legacy GA functions');
};