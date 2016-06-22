var _gaq = _gaq || [];
var global_more_nav_open = false;
// Check for footer navigation use
function catchFooterClick(e) {
    var targetLink = "";
    if(e.target) {
    	if (e.target.nodeName == "A" || e.target.parentNode.nodeName == "A") {
    		targetLink = e.target.href || e.target.parentNode.href;
    		if (typeof targetLink != 'undefined')
    			_gaq.push(['_trackEvent', "Footer Links", "Click", targetLink]);
    	}
    }
}
jQuery("#footer").bind("mousedown", catchFooterClick);


/**
 * @author Eugene Efimochkin
 * @extends jQuery()
 * @extends $()
 * @addon
 * 
 * This is a plugin for jQuery JavaScript library
 * It extends the jQuery() class with `.placehold()` method,
 * which is effective for text inputs and treats the default 
 * value those inputs have in HTML markup as a placehold value
 * which has to be cleared out, when a user wants to input 
 * a text in it and returned back if user had put nothing.
 * Additionally, this method can add a specified class to
 * active and inactive fields separately, enabling you to 
 * style and detect placeholded and active inputs. 
 * 
 * !!! REQUIRES jQuery v.1.2+ !!!
 * 
 * Example calls:
 *     $(":text").placehold()  -- treats a `value` attribute of each text input individually as its placeholder value
 *     $(":text").placehold({blurClass: "placehold"})  -- the same as above, but add a "placehold" to `class` of each element, when it is not in focus
 *     $(":text").placehold({focusClass: "focus"})  -- same as first, but adds a "focus" to active input class
 *     $("input[name='email']").placehold({placeholdValue: "Your email here"}) -- uses the value as a common placeholder string (a value from markup will be omitted)
 *     
 * You can use any combination of `blurClass`, `focusClass` and `value`
 * fields of `options` hash.
 *     
 * Please, remember to validate the form on submit, additionally 
 * checking fields for containing a placeholder, because 
 * placeholder strings are obviously treated as normal input 
 * values by UAs. If a user submits such form, it might even 
 * appear valid on the server side, filling your DB with bogus data
 *     
 */
(function(){
    jQuery.fn.extend(
        {
            /**
             * placehold()
             * @return {jQuery} - unchanged current jQuery selection
             * @param {Object} options Optional, an object with focusClass, blurClass and placeholdValue fields 
             */
            placehold: function(){
                var $query = this; // this is a current jQuery selection
                
                var placeholdOptions = arguments[0] || {}; 
                
                var $inputs = $query.filter(":text, :password");
                
                $inputs
                    .each(
                        function(){
                           var $this = jQuery(this);
                           this.placeholdValue = placeholdOptions.placeholdValue || jQuery.trim($this.val());
                           $this.val(this.placeholdValue);                                        
                           $this.addClass(placeholdOptions.blurClass || "");
                        }    
                    )
                   .bind("focus",function(){
                       var $this = jQuery(this);
                       var val = jQuery.trim($this.val());
                       if(
                          val == this.placeholdValue || 
                          val == ""
                       )
                       {
                           $this
                               .val("")
                               .removeClass(placeholdOptions.blurClass || "")
                               .addClass(placeholdOptions.focusClass || "");
                       }
                   })
                   .bind("blur",function(){
                       var $this = jQuery(this);
                       var val = jQuery.trim($this.val());
                       if(
                          val == this.placeholdValue || 
                          val == ""
                       )
                       {
                           $this
                               .val(this.placeholdValue)
                               .addClass(placeholdOptions.blurClass || "")
                               .removeClass(placeholdOptions.focusClass || "")
                       }
                       
                           
                   });
               return $query;
                       
            }
        }
    )
})();



		jQuery(document).ready(function($)
		{   // $('#taskNav > li').bind('mouseover', jsddm_open)
		    // $('#taskNav > li').bind('mouseout',  jsddm_timer)

	// Check placement of side nav
	if ($("div.subSiteMenu").length && $("div.documentHead").length && ($("div.documentHead").height() > 80)) {
		$("div.subSiteMenu").css("margin-top", (34 - $("div.documentHead").height()) + "px");
	}

	 $(".navGift").click(function() {
		var pageTracker = "";
		_gat._createTracker('UA-3265888-1', 't2');
		pageTracker = _gat._getTrackerByName('t2');
		pageTracker._trackPageview("/giving/homepagelink");
	  });

     $("span.seeMoreOptionsLabel").click(function() { //When trigger is clicked...  
   		
		_gaq.push(['_trackEvent', 'GlobalNav', 'More Button Click', '']);

		//Following events are applied to the subnav itself (moving subnav up and down)  
         if (!global_more_nav_open)
		  {
		  $("ul#internalLinks").show(); //Drop down the subnav on click  
		  global_more_nav_open = true;
		  }
		 else
		  {
             $("ul#internalLinks").slideUp('fast'); //When the mouse hovers out of the subnav, move it backup  
			 global_more_nav_open = false;
		  }
   
         $(this).parent().hover(function() {  
         }, function(){  
             $("ul#internalLinks").slideUp('fast'); //When the mouse hovers out of the subnav, move it backup  
			 global_more_nav_open = false;
         });  
   
         //Following events are applied to the trigger (Hover events for the trigger)  
         }).hover(function() {  
             $(this).addClass("subhover"); //On hover over, add class "subhover"  
         }, function(){  //On Hover Out  
             $(this).removeClass("subhover"); //On hover out, remove class "subhover"  
	 });  
	 
			$("input.placehold").placehold({blurClass: "placehold"})
		
		});

$("body").delegate("a.download", "mousedown", function(e) {
  _gaq.push(['_trackEvent', "Document Download", "Title: " + $(this).attr("title"), $(this).attr("href")]);
});
		


