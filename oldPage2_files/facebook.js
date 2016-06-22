(function() {
    if ('http:' == document.location.protocol)
		document.write(unescape('%3Cscript%20src%3D%22%2F%2Fwww.macalester.edu%2Fresources%2Fincludes%2Ffacebook_status.js%22%3E%3C%2Fscript%3E'));
  	})();
	
window.onload=function(){
	
	$(".todayOnFB").click(function(){
		window.open("http://www.macalester.edu/macsocial");
	});

};