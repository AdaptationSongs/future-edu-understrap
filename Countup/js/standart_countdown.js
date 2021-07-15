/*standart countdown protytype_script*/
(function($){
	/// jquery animation for elements	
	$.fn.wpdevart_countdown_extend_animation = function(effect,effect_time) {
		var element = $(this);
		if(typeof(effect_time)=="undefined"){
			var effect_time=0;
		}
		jQuery(window ).scroll(animated_element);
		animated_element();
		setTimeout(function(){animated_element()},100)
		function animated_element(){			
			if(!element.hasClass('animated') && isScrolledIntoView())	{	
				setTimeout(function(){element.css("visibility","visible");element.addClass("animated");element.addClass(effect);},effect_time);			
			}	
		}		
		function isScrolledIntoView(){
			var $window = jQuery(window);
			var docViewTop = $window.scrollTop();
			var docViewBottom = docViewTop + $window.height();
			var elemTop = element.offset().top;
			var elemBottom = elemTop + parseInt(element.css('height'));			
			return ( ( (docViewTop<=elemTop+5) && (elemTop-5<=docViewBottom) )  || ( (docViewTop<=elemBottom+5) && (elemBottom-5<=docViewBottom) ) || (docViewTop==0 && docViewBottom==0) || $window.height()==0);
		}
	}
	$.fn.wpdevart_countdown_extend_animation_children = function(effect,bettwen_interval) {
		var element = $(this);
		if(typeof(bettwen_interval)=="undefined"){
			var effect_time=0;
		}
		jQuery(window).scroll(animated_element);
		animated_element();
		function animated_element(){
			var local_time=0;
			if(!element.hasClass('animated') && isScrolledIntoView())	{
				element.children().each(function(){
					var children =jQuery(this)
					setTimeout(function(){children.css("visibility","visible");children.addClass("animated");children.addClass(effect);},local_time);
					local_time+=bettwen_interval;
				});
			}	
		}		
		function isScrolledIntoView(){
			var $window = jQuery(window);
			var docViewTop = $window.scrollTop();
			var docViewBottom = docViewTop + $window.height();
			var elemTop = element.offset().top;
			var elemBottom = elemTop + parseInt(element.css('height'));			
			return ( ( (docViewTop<=elemTop+5) && (elemTop-5<=docViewBottom) )  || ( (docViewTop<=elemBottom+5) && (elemBottom-5<=docViewBottom) ) || (docViewTop==0 && docViewBottom==0) || $window.height()==0);
		}
	}
	// standart countdown 
	$.fn.wpdevart_countdown_extend_standart = function(options,calback) {
		var element = $(this);
		// curent seconds left
		var seconds_left=options.seconds_left;
		var timer_countup_seconds=-options.timer_start_time;		
		var array_of_dates=['week','day','hour','minut','second'];
		var interval_ids = new Array();
		
		/* calculating Date */
		var kaificents_by_seconds={
				week:604800,
				day:86400,
				hour:3600,
				minut:60,
				second:1,
		}
		var loc_kaificents=get_kaificents();		
		var kaificents=loc_kaificents[0];
		var count_of_display_dates=loc_kaificents[1];
		delete loc_kaificents;
		/*end of Calculating Dates*/		
		create_html();
		if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
			start_counting_up();
		}else{
			start_counting_down();
		}	
		// create html 
		function create_html(){
			for(i=0;i<array_of_dates.length;i++){
				if(typeof(options.display_days[array_of_dates[i]])=="undefined"){
					continue;
				}else{
					element.append('<div class="wpdevart_countdown_extend_element '+array_of_dates[i]+'_block_element"><span class="time_left_extended '+array_of_dates[i]+'_left"></span><span class="time_text '+array_of_dates[i]+'_text"></span></div>')
				}
			}
			set_html_text(options.display_days);
			/*Set animation effect*/
			if(options.gorup_animation=="group"){
				jQuery(element).wpdevart_countdown_extend_animation(options.effect,0);
			}else{
				jQuery(element).wpdevart_countdown_extend_animation_children(options.effect,400)
			}	
		}
		// remove html element
		function remove_html(){
			element.html("");
		}
		
		//  start counting down
		function start_counting_down(){
			time_object=(calculate_time(seconds_left));
			change_html_time(time_object);
			interval_ids.push(setInterval(function(){if(seconds_left<=0){after_countdown();}seconds_left--;time_object=(calculate_time(seconds_left));change_html_time(time_object);},1000));
			if(seconds_left==0){
				after_countdown();
			}else{
				setTimeout(function(){ after_countdown();},Math.min(2147483647,seconds_left*1000));
			}
		}
		//start counting up 
		function start_counting_up(){
			if((typeof(options.time_is_expired)!="undefined" && options.time_is_expired=="1")){
				timer_countup_seconds=options.repeat_seconds-seconds_left;
			}			
			if(seconds_left==0){
				after_countdown();
				return;
			}else{
				setTimeout(function(){ after_countdown();},Math.min(2147483647,seconds_left*1000));
			}
			if(timer_countup_seconds>=0){
				time_object=(calculate_time(timer_countup_seconds));				
				change_html_time(time_object);								
				interval_ids.push(setInterval(function(){timer_countup_seconds++;time_object=(calculate_time(timer_countup_seconds));change_html_time(time_object);},1000));
			}else{
				setTimeout(function(){ timer_countup_seconds=0;remove_html();create_html();start_counting_up();},Math.min(2147483647,(-timer_countup_seconds)*1000));
				before_countup();
			}
		}
		// set text for html
		function set_html_text(text_of_html){			
			jQuery.each(text_of_html,function(index,value){
				element.find('.'+index+'_text').html(options.display_days_texts[index]);
			})
		}
		// change time
		function change_html_time(time_object){	
			jQuery.each(time_object,function(index,value){
				element.find('.'+index+'_left').html(value);
			})
		}
		/* get day kaificents*/
		function get_kaificents(){
			var kaificent={
				week:10000000000,
				day:7,
				hour:24,
				minut:60,
				second:60,
			}
			var k=5;
			if(typeof(options.display_days.week)=="undefined"){
				kaificent["day"]=kaificent["week"]*7;
				delete kaificent.week;
				k--;
			}
			if(typeof(options.display_days.day)=="undefined"){
				kaificent["hour"]=kaificent["day"]*24;
				delete kaificent.day;
				k--;
			}
			if(typeof(options.display_days.hour)=="undefined"){
				kaificent["minut"]=kaificent["hour"]*60;
				delete kaificent.hour;
				k--;
			}
			if(typeof(options.display_days.minut)=="undefined"){
				kaificent["second"]=kaificent["minut"]*60;
				delete kaificent.minut;
				k--;
			}
			if(typeof(options.display_days.second)=="undefined"){
				delete kaificent.second;
				k--;
			}
			return[kaificent,k];
		}
		/*Caluclating time*/
		function calculate_time(seconds){	
			var time_object={};
			var loc_seconds_left=seconds;
			var k=0;
			jQuery.each(kaificents,function(index,value){
				k++;
				if(k==count_of_display_dates && loc_seconds_left!=0){
					time_object[index]=Math.min(Math.ceil(loc_seconds_left/kaificents_by_seconds[index]),value);
					loc_seconds_left=loc_seconds_left-time_object[index]*kaificents_by_seconds[index];
					
				}else{
					time_object[index]=Math.min(Math.floor(loc_seconds_left/kaificents_by_seconds[index]),value);
					loc_seconds_left=loc_seconds_left-time_object[index]*kaificents_by_seconds[index];
				}
			})
			return time_object;
		}
		
		/*after Countdown and functions*/
		function after_countdown(){
			switch(options.after_countdown_end_type){
				case "hide":
					hide_countdown();
					break;
				case "text":
					show_countdown_text();
					break;
				case "repeat":						
					repeat_countdown();
					break;
				case "redirect":
					redirect_countdown();
					break;
				default:
			}
		}
		function before_countup(){
			switch(options.before_countup_start_type){
				case "none":
					hide_countdown();
					break;
				case "text":
					show_countdown_before_text();
					break;
			}
		}
		function hide_countdown(){
			clear_intervals();
			element.remove();
		}
		function show_countdown_text(){
			clear_intervals();
			element.html(options.after_countdown_text);
		}
		function repeat_countdown(){
			seconds_left=options.repeat_seconds;
			if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
				clear_intervals();
				timer_countup_seconds=0;
				start_counting_up();
			}
		}
		function redirect_countdown(){
			clear_intervals();
			if(equals_url(window.location.href,options.after_countdown_redirect) || options.after_countdown_redirect=="" ||  options.after_countdown_redirect==window.location.href ){
				hide_countdown();
			}else{
				window.location=options.after_countdown_redirect
			}
		}
		function show_countdown_before_text(){
			element.html(options.before_countup_text);
		}
		function clear_intervals(){
			var i=interval_ids.length;
			while(i>0){
				i--
				clearInterval(interval_ids[i]);
				interval_ids.pop();				
			}
		}
		if(parseInt(options.inline)){
			jQuery(document).ready(function(){
				initial_start_parametrs();
				display_line();
			})		
			jQuery(window).resize(function(){display_line()})
		}
		
		function display_line(){
			var main_width=element.parent().width();
			var sumary_inside_width=0;
			element.find(".wpdevart_countdown_extend_element").each(function(){
				sumary_inside_width=sumary_inside_width+parseInt(jQuery(this).attr('date-width'))+parseInt(jQuery(this).attr('date-distance'));
			})
			kaificent=(sumary_inside_width)/main_width;
			if(kaificent>=1 && main_width>0){
				element.find(".wpdevart_countdown_extend_element").each(function(){
					jQuery(this).width(Math.floor(parseInt(jQuery(this).attr('date-width'))/kaificent));
					jQuery(this).css("min-width",Math.floor(parseInt(jQuery(this).attr('date-width'))/kaificent));
					jQuery(this).css("margin-right",Math.floor(parseInt(jQuery(this).attr('date-distance'))/kaificent));
					var time_left_extended=jQuery(this).find(".time_left_extended");
					var time_text=jQuery(this).find(".time_text");
					var time_left_extended_param={};
					var time_text_param={};
					time_left_extended_param["font"]=parseInt(time_left_extended.attr("date-font"))/kaificent;
					time_text_param["font"]=parseInt(time_text.attr("date-font"))/kaificent;
					
					time_left_extended_param["margin"]=time_left_extended.attr("date-margin").split(" ");					
					jQuery.each(time_left_extended_param["margin"],function(index,value){
						time_left_extended_param["margin"][index]=Math.floor(parseInt(value)/kaificent);
					})
					time_left_extended_param["margin"]=time_left_extended_param["margin"].join('px ');
					
					time_text_param["margin"]=time_text.attr("date-margin").split(" ");
					jQuery.each(time_text_param["margin"],function(index,value){
						time_text_param["margin"][index]=Math.floor(parseInt(value)/kaificent);
					})
					time_text_param["margin"]=time_text_param["margin"].join('px ');
					
					time_left_extended_param["padding"]=time_left_extended.attr("date-padding").split(" ");
					jQuery.each(time_left_extended_param["padding"],function(index,value){
						time_left_extended_param["padding"][index]=Math.floor(parseInt(value)/kaificent);
					})
					time_left_extended_param["padding"]=time_left_extended_param["padding"].join('px ');
					
					time_text_param["padding"]=time_text.attr("date-padding").split(" ");
					jQuery.each(time_text_param["padding"],function(index,value){
						time_text_param["padding"][index]=Math.floor(parseInt(value)/kaificent);
					})
					time_text_param["padding"]=time_text_param["padding"].join('px ');
					time_left_extended.css("font-size",time_left_extended_param["font"]);
					time_text.css("font-size",time_text_param["font"]);
					time_left_extended.css("margin",time_left_extended_param["margin"]);
					time_text.css("margin",time_text_param["margin"]);
					time_left_extended.css("padding",time_left_extended_param["padding"]);
					time_text.css("padding",time_text_param["padding"]);
					delete(time_left_extended);
					delete(time_text);
					delete(time_left_extended_param);
					delete(time_text_param);
				})	
			}
		}
		function initial_start_parametrs(){
			element.find(".wpdevart_countdown_extend_element").each(function(){
				jQuery(this).attr("date-width",jQuery(this).width());
				jQuery(this).attr("date-distance",jQuery(this).css("margin-right"));
				var time_left_extended=jQuery(this).find(".time_left_extended");
				var time_text=jQuery(this).find(".time_text");
				time_left_extended.attr("date-font",time_left_extended.css("font-size"));
				time_text.attr("date-font",time_text.css("font-size"));
				time_left_extended.attr("date-margin",time_left_extended.css("margin"));
				time_text.attr("date-margin",time_text.css("margin"));
				time_left_extended.attr("date-padding",time_left_extended.css("padding"));
				time_text.attr("date-padding",time_text.css("padding"));
				delete(time_left_extended);
				delete(time_text);
			})
		}
		function equals_url(url1,url2) {		
			// remove any prefix
			url2 = url2.replace("http://", "");
			url2 = url2.replace("http://www.", "");
			url2 = url2.replace("https://", "");
			url2 = url2.replace("https://www.", "");
			
			url1 = url1.replace("http://", "");
			url1 = url1.replace("http://www.", "");
			url1 = url1.replace("https://", "");
			url1 = url1.replace("https://www.", "");
			// assume any URL that starts with a / is on the current page's domain
			if (url1.substr(url1.length - 1) != "/") {
				url1 = url1+"/"
			}
			if (url2.substr(url2.length - 1) != "/") {
				url2 = url2+"/"
			}
			if(url1===url2){
				return true;
			}
			return false;
		}
		/*Countup*/
		
		function show_before_text(){
			
		}
	}
	//vertical countdown
	$.fn.wpdevart_countdown_extend_vertical = function(options,calback) {
		var element = $(this);
		// curent seconds left
		var seconds_left=options.seconds_left;
		var timer_countup_seconds=-options.timer_start_time;		
		var array_of_dates=['week','day','hour','minut','second'];
		var interval_ids = new Array();	
		/* calculating Date */
		var kaificents_by_seconds={
				week:604800,
				day:86400,
				hour:3600,
				minut:60,
				second:1,
		}
		
		var loc_kaificents=get_kaificents();		
		var kaificents=loc_kaificents[0];
		var count_of_display_dates=loc_kaificents[1];
		var height_li_elements=0;
		delete loc_kaificents;
		if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
			var previus_time_object=calculate_time(timer_countup_seconds);
		}		
		else{
			var previus_time_object=calculate_time(seconds_left);
		}
		/*end of Calculating Dates*/		
		create_html();
		if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
			start_counting_up();
		}else{
			start_counting_down();
		}		

		function create_html(){

			for(i=0;i<array_of_dates.length;i++){
				if(typeof(options.display_days[array_of_dates[i]])=="undefined"){
					continue;
				}else{
					var ul_for_time="";
					for(j=0;j<previus_time_object[array_of_dates[i]].length;j++){
						ul_for_time=ul_for_time+"<span><ul><li>"+previus_time_object[array_of_dates[i]][j]+"</li>"+"<li>"+previus_time_object[array_of_dates[i]][j]+"</li></ul></span>";
					}					
					element.append('<div class="wpdevart_countdown_extend_element '+array_of_dates[i]+'_block_element"><div class="time_left_extended '+array_of_dates[i]+'_left">'+ul_for_time+'</div><span class="time_text '+array_of_dates[i]+'_text"></span></div>')
				}
			}
			set_html_text(options.display_days);
			height_li_elements=get_height_element();
			set_requered_css();
			/*Set animation effect*/
			if(options.gorup_animation=="group"){
				jQuery(element).wpdevart_countdown_extend_animation(options.effect,0);
			}else{
				jQuery(element).wpdevart_countdown_extend_animation_children(options.effect,400)
			}	
		}
		// remove html element
		function remove_html(){
			element.html("");
		}
		//  start counting down
		function start_counting_down(){
			time_object=(calculate_time(seconds_left));
			change_html_time(time_object);
			interval_ids.push(setInterval(function(){if(seconds_left<=0){after_countdown();}seconds_left--;time_object=(calculate_time(seconds_left));change_html_time(time_object);},1000));
			if(seconds_left==0){
				after_countdown();
			}else{
				setTimeout(function(){ after_countdown();},Math.min(2147483647,seconds_left*1000));
			}
		}
		//start counting up 
		function start_counting_up(){
			if((typeof(options.time_is_expired)!="undefined" && options.time_is_expired=="1")){
				timer_countup_seconds=options.repeat_seconds-seconds_left;
			}			
			if(seconds_left==0){
				after_countdown();
				return;
			}else{
				setTimeout(function(){ after_countdown();},Math.min(2147483647,seconds_left*1000));
			}
			if(timer_countup_seconds>=0){
				time_object=(calculate_time(timer_countup_seconds));				
				change_html_time(time_object);								
				interval_ids.push(setInterval(function(){timer_countup_seconds++;time_object=(calculate_time(timer_countup_seconds));change_html_time(time_object);},1000));
			}else{
				setTimeout(function(){ timer_countup_seconds=0;remove_html();create_html();start_counting_up();},Math.min(2147483647,(-timer_countup_seconds)*1000));
				before_countup();
			}
		}
		
		function set_html_text(text_of_html){			
			jQuery.each(text_of_html,function(index,value){
				element.find('.'+index+'_text').html(options.display_days_texts[index]);
			})
		}
		function change_html_time(time_object){	
			jQuery.each(time_object,function(index,value){
				for(i=0;i<value.length;i++){					
					if(previus_time_object[index][i]!=value[i]){						
						element.find("."+index+"_left > span").eq(i).find("li").eq(1).html(value[i]);
						element.find("."+index+"_left > span").eq(i).find("ul").addClass("wpdevart_vertical_transition");
						element.find("."+index+"_left > span").eq(i).find("ul").css("top","-"+height_li_elements+"px");
						setTimeout(function(){stop_animation()},"400");
					}
				}
			})
			previus_time_object=time_object;
		}
		function stop_animation(){
			element.find('.wpdevart_vertical_transition').each(function(){
				jQuery(this).find("li").eq(0).html(jQuery(this).find("li").eq(1).html());
				jQuery(this).css("top","0px")
			})
			element.find('.wpdevart_vertical_transition').removeClass("wpdevart_vertical_transition");
		}
		/* get day kaificents*/
		function get_kaificents(){
			var kaificent={
				week:(Math.ceil(seconds_left/604800)+1),
				day:7,
				hour:24,
				minut:60,
				second:60,
			}
			var k=5;
			if(typeof(options.display_days.week)=="undefined"){
				kaificent["day"]=kaificent["week"]*7;
				delete kaificent.week;
				k--;
			}
			if(typeof(options.display_days.day)=="undefined"){
				kaificent["hour"]=kaificent["day"]*24;
				delete kaificent.day;
				k--;
			}
			if(typeof(options.display_days.hour)=="undefined"){
				kaificent["minut"]=kaificent["hour"]*60;
				delete kaificent.hour;
				k--;
			}
			if(typeof(options.display_days.minut)=="undefined"){
				kaificent["second"]=kaificent["minut"]*60;
				delete kaificent.minut;
				k--;
			}
			if(typeof(options.display_days.second)=="undefined"){
				delete kaificent.second;
				k--;
			}
			return[kaificent,k];
		}
		/*Caluclating time*/
		function calculate_time(seconds){	
			var time_object={};
			var loc_seconds_left=seconds;
			var k=0;
			jQuery.each(kaificents,function(index,value){
				k++;
				time_object[index]=[];
				var cur_val=0;
				if(k==count_of_display_dates && loc_seconds_left!=0){					
					cur_val=Math.min(Math.ceil(loc_seconds_left/kaificents_by_seconds[index]),value);					
					loc_seconds_left=loc_seconds_left-cur_val*kaificents_by_seconds[index];
					while((""+cur_val).length<(""+kaificents[index]).length){
						cur_val="0"+cur_val;
					}
					exploded_value = (""+cur_val).split("");
					time_object[index]=exploded_value;
				}else{
					cur_val=Math.min(Math.floor(loc_seconds_left/kaificents_by_seconds[index]),value);					
					loc_seconds_left=loc_seconds_left-cur_val*kaificents_by_seconds[index];
					while((""+cur_val).length<(""+kaificents[index]).length){
						cur_val="0"+cur_val;
					}
					exploded_value = (""+cur_val).split("");
					time_object[index]=exploded_value;
				}
			})
			return time_object;
		}
		
		/*after cCountdown and functions*/
		function after_countdown(){
			switch(options.after_countdown_end_type){
				case "hide":
					hide_countdown();
					break;
				case "text":
					show_countdown_text();
					break;
				case "repeat":	
					repeat_countdown();
					break;
				case "redirect":
					redirect_countdown();
					break;
				default:
			}
		}
		function before_countup(){
			switch(options.before_countup_start_type){
				case "none":
					hide_countdown();
					break;
				case "text":
					show_countdown_before_text();
					break;
			}
		}
		function hide_countdown(){
			clear_intervals();
			element.remove();
		}
		function show_countdown_text(){
			clear_intervals();
			element.html(options.after_countdown_text);
		}
		function repeat_countdown(){
			seconds_left=options.repeat_seconds;
			if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
				clear_intervals();
				timer_countup_seconds=0;
				start_counting_up();
			}
		}
		function redirect_countdown(){
			clear_intervals();
			if(equals_url(window.location.href,options.after_countdown_redirect) || options.after_countdown_redirect=="" ||  options.after_countdown_redirect==window.location.href ){
				hide_countdown();
			}else{
				window.location=options.after_countdown_redirect
			}
		}
		function show_countdown_before_text(){
			element.html(options.before_countup_text);
		}
		function clear_intervals(){
			var i=interval_ids.length;
			while(i>0){
				i--
				clearInterval(interval_ids[i]);
				interval_ids.pop();				
			}
		}
		function set_requered_css(){
			element.find(".time_left_extended > span").css("height",height_li_elements+"px");
			element.find(".time_left_extended > span").css("min-width",(height_li_elements*0.7)+"px");
			//element.find(".time_left_extended").css("height",height_li_elements+"px");
		}
		function get_height_element(){
			element.find(".time_left_extended > span").css("height","initial");
			element.find(".time_left_extended > span").css("min-width","initial");
			var cur_height=element.find(".time_left_extended > span").eq(0).height();
			cur_height=cur_height/2;
			return cur_height;
		}
		if(parseInt(options.inline)){
			jQuery(document).ready(function(){
				initial_start_parametrs();
				display_line();
			})		
			jQuery(window).resize(function(){display_line()})
		}
		function display_line(){
			var main_width=element.parent().width();
			var sumary_inside_width=0;

			element.find(".wpdevart_countdown_extend_element").each(function(){
				sumary_inside_width=sumary_inside_width+parseInt(jQuery(this).attr('date-distance'));
			})
			sumary_inside_width=sumary_inside_width+element.find(".wpdevart_countdown_extend_element .time_left_extended > span").eq(0).attr("date-width")*element.find(".wpdevart_countdown_extend_element .time_left_extended > span").length;
			kaificent=(sumary_inside_width)/main_width;
			if(kaificent>1 && main_width>0){
				element.find(".wpdevart_countdown_extend_element").each(function(){
					jQuery(this).css("margin-right",(parseInt(jQuery(this).attr('date-distance')))/kaificent);
					var time_left_extended=jQuery(this).find(".time_left_extended li");
					var time_left_extended_span=jQuery(this).find(".time_left_extended > span");
					var time_text=jQuery(this).find(".time_text");
					var time_left_extended_param={};
					var time_text_param={};
					
					time_left_extended_param["font"]=parseInt(time_left_extended.eq(0).attr("date-font"))/kaificent;
					time_text_param["font"]=Math.floor(parseInt(time_text.attr("date-font"))/kaificent);
					
					time_text_param["margin"]=time_text.attr("date-margin").split(" ");
					jQuery.each(time_text_param["margin"],function(index,value){
						time_text_param["margin"][index]=Math.floor(parseInt(value)/kaificent);
					})
					time_text_param["margin"]=time_text_param["margin"].join('px ');
					
					
					time_text_param["padding"]=time_text.attr("date-padding").split(" ");
					jQuery.each(time_text_param["padding"],function(index,value){
						time_text_param["padding"][index]=Math.floor(parseInt(value)/kaificent);
					})
					time_text_param["padding"]=time_text_param["padding"].join('px ');
					time_left_extended_span.css("border-width",Math.floor(parseInt(time_left_extended_span.eq(0).attr("date-border-width"))/kaificent))
					time_left_extended.css("font-size",time_left_extended_param["font"]);
					time_text.css("font-size",time_text_param["font"]);
					time_text.css("margin",time_text_param["margin"]);
					time_text.css("padding",time_text_param["padding"]);
										
					delete(time_left_extended);
					delete(time_text);
					delete(time_left_extended_param);
					delete(time_text_param);
				});
				height_li_elements=get_height_element();
				set_requered_css();
			}
		}
		function initial_start_parametrs(){
			element.find(".wpdevart_countdown_extend_element").each(function(){
				jQuery(this).attr("date-width",jQuery(this).width());
				jQuery(this).attr("date-distance",jQuery(this).css("margin-right"));
				var time_left_extended=jQuery(this).find(".time_left_extended li").eq(0);
				var frst_span=jQuery(this).find(".time_left_extended > span").eq(0);
				var time_text=jQuery(this).find(".time_text");				
				frst_span.attr("date-width",frst_span.outerWidth());
				frst_span.attr("date-border-width",frst_span.css("border-width"));
				time_left_extended.attr("date-font",time_left_extended.css("font-size"));
				time_text.attr("date-font",time_text.css("font-size"));
				time_text.attr("date-margin",time_text.css("margin"));
				time_text.attr("date-padding",time_text.css("padding"));
				delete(time_left_extended);
				delete(time_text);
			})
		}		
		
		function equals_url(url1,url2) {		
			// remove any prefix
			url2 = url2.replace("http://", "");
			url2 = url2.replace("http://www.", "");
			url2 = url2.replace("https://", "");
			url2 = url2.replace("https://www.", "");
			
			url1 = url1.replace("http://", "");
			url1 = url1.replace("http://www.", "");
			url1 = url1.replace("https://", "");
			url1 = url1.replace("https://www.", "");
			// assume any URL that starts with a / is on the current page's domain
			if (url1.substr(url1.length - 1) != "/") {
				url1 = url1+"/"
			}
			if (url2.substr(url2.length - 1) != "/") {
				url2 = url2+"/"
			}
			if(url1===url2){
				return true;
			}
			return false;
		}
		
	}
	/*wpdevart circle countdown*/
	
	$.fn.wpdevart_countdown_extend_circle = function(options,calback) {
		var element = $(this);
		// curent seconds left
		var seconds_left=options.seconds_left;
		var timer_countup_seconds=-options.timer_start_time;
		var array_of_dates=['week','day','hour','minut','second'];
		var interval_ids = new Array(); // counting intervals array
		/* calculating Date */
		var kaificents_by_seconds={
				week:604800,
				day:86400,
				hour:3600,
				minut:60,
				second:1,
		}
		var loc_kaificents=get_kaificents();		
		var kaificents=loc_kaificents[0];
		var count_of_display_dates=loc_kaificents[1];
		delete loc_kaificents;
		/*end of Calculating Dates*/
		if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
			var time_object=calculate_time(timer_countup_seconds);
		}		
		else{
			var time_object=calculate_time(seconds_left);
		}
		create_html();
		if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
			start_counting_up();
		}else{
			start_counting_down();
		}
		//
		function create_html(){
			for(i=0;i<array_of_dates.length;i++){
				if(typeof(options.display_days[array_of_dates[i]])=="undefined"){
					continue;
				}else{
					element.append('<div class="wpdevart_countdown_extend_element '+array_of_dates[i]+'_block_element"><div class="wpdevart_countdown_background"></div><input type="text" /><span class="time_left_extended '+array_of_dates[i]+'_left"></span><span class="time_text '+array_of_dates[i]+'_text"></span></div>')
				}
			}
			initializ_circle(time_object);
			set_html_text(options.display_days);
			/*Set animation effect*/
			if(options.gorup_animation=="group"){
				jQuery(element).wpdevart_countdown_extend_animation(options.effect,0);
			}else{
				jQuery(element).wpdevart_countdown_extend_animation_children(options.effect,400)
			}
		}
		// remove html element
		function remove_html(){
			element.html("");
		}
		//  start counting down
		function start_counting_down(){
			time_object=(calculate_time(seconds_left));
			change_html_time(time_object);
			interval_ids.push(setInterval(function(){if(seconds_left<=0){after_countdown();}seconds_left--;time_object=(calculate_time(seconds_left));change_html_time(time_object);},1000));
			if(seconds_left==0){
				after_countdown();
			}else{
				setTimeout(function(){ after_countdown();},Math.min(2147483647,seconds_left*1000));
			}
		}
		//start counting up 
		function start_counting_up(){
			if((typeof(options.time_is_expired)!="undefined" && options.time_is_expired=="1")){
				timer_countup_seconds=options.repeat_seconds-seconds_left;
			}			
			if(seconds_left==0){
				after_countdown();
				return;
			}else{
				setTimeout(function(){ after_countdown();},Math.min(2147483647,seconds_left*1000));
			}
			if(timer_countup_seconds>=0){
				time_object=(calculate_time(timer_countup_seconds));				
				change_html_time(time_object);								
				interval_ids.push(setInterval(function(){timer_countup_seconds++;time_object=(calculate_time(timer_countup_seconds));change_html_time(time_object);},188));
			}else{
				setTimeout(function(){ timer_countup_seconds=0;remove_html();create_html();start_counting_up();},Math.min(2147483647,(-timer_countup_seconds)*1000));
				before_countup();
			}
		}
		
		function initializ_circle(time_object){
			jQuery.each(time_object,function(index,value){
				element.find('.'+index+'_block_element input').knob(jQuery.extend({
					width: '100%',
					displayInput: false,
					readOnly: true,
					'fgColor': options.fg_color,
					'bgColor': options.bg_color,
					max: kaificents[index],
					thickness:options.thickness,
					lineCap:options.linecap
				}));
			
			});
		}
		function set_html_text(text_of_html){			
			jQuery.each(text_of_html,function(index,value){
				element.find('.'+index+'_text').html(options.display_days_texts[index]);
			})
		}
		function change_html_time(time_object){	
			jQuery.each(time_object,function(index,value){
				if(options.direction=="right"){
					element.find('.'+index+'_block_element input').val(kaificents[index]-value).trigger('change');
				}else{
					element.find('.'+index+'_block_element input').val(value).trigger('change');
				}
				element.find('.'+index+'_left').html(value);
			})
		}
		/* get day kaificents*/
		function get_kaificents(){
			var kaificent={
				week:Math.ceil(options.start_time/604800),
				day:7,
				hour:24,
				minut:60,
				second:60,
			}
			var k=5;
			if(typeof(options.display_days.week)=="undefined"){
				kaificent["day"]=kaificent["week"]*7;
				delete kaificent.week;
				k--;
			}
			if(typeof(options.display_days.day)=="undefined"){
				kaificent["hour"]=kaificent["day"]*24;
				delete kaificent.day;
				k--;
			}
			if(typeof(options.display_days.hour)=="undefined"){
				kaificent["minut"]=kaificent["hour"]*60;
				delete kaificent.hour;
				k--;
			}
			if(typeof(options.display_days.minut)=="undefined"){
				kaificent["second"]=kaificent["minut"]*60;
				delete kaificent.minut;
				k--;
			}
			if(typeof(options.display_days.second)=="undefined"){
				delete kaificent.second;
				k--;
			}
			return[kaificent,k];
		}
		/*Caluclating time*/
		function calculate_time(seconds){	
			var time_object={};
			var loc_seconds_left=seconds;
			var k=0;
			jQuery.each(kaificents,function(index,value){
				k++;
				if(k==count_of_display_dates && loc_seconds_left!=0){
					time_object[index]=Math.min(Math.ceil(loc_seconds_left/kaificents_by_seconds[index]),value);
					loc_seconds_left=loc_seconds_left-time_object[index]*kaificents_by_seconds[index];
					
				}else{
					time_object[index]=Math.min(Math.floor(loc_seconds_left/kaificents_by_seconds[index]),value);
					loc_seconds_left=loc_seconds_left-time_object[index]*kaificents_by_seconds[index];
				}
			})
			return time_object;
		}
		
		/*after cCountdown and functions*/
		function after_countdown(){
			switch(options.after_countdown_end_type){
				case "hide":
					hide_countdown();
					break;
				case "text":
					show_countdown_text();
					break;
				case "repeat":	
					repeat_countdown();
					break;
				case "redirect":
					redirect_countdown();
					break;
				default:
			}
		}
		function before_countup(){
			switch(options.before_countup_start_type){
				case "none":
					hide_countdown();
					break;
				case "text":
					show_countdown_before_text();
					break;
			}
		}
		function hide_countdown(){
			clear_intervals();
			element.remove();
		}
		function show_countdown_text(){
			clear_intervals();
			element.html(options.after_countdown_text);
		}
		function repeat_countdown(){
			seconds_left=options.repeat_seconds;
			if(options.coundown_type=="countup" || options.coundown_type=="session_countup"){
				clear_intervals();
				timer_countup_seconds=0;
				start_counting_up();
			}
		}
		function redirect_countdown(){
			clear_intervals();
			if(equals_url(window.location.href,options.after_countdown_redirect) || options.after_countdown_redirect=="" ||  options.after_countdown_redirect==window.location.href ){
				hide_countdown();
			}else{
				window.location=options.after_countdown_redirect
			}
		}
		function show_countdown_before_text(){
			element.html(options.before_countup_text);
		}
		function clear_intervals(){
			var i=interval_ids.length;
			while(i>0){
				i--
				clearInterval(interval_ids[i]);
				interval_ids.pop();				
			}
		}
		if(parseInt(options.inline)){
			jQuery(window).resize(function(){display_line()})
			initial_start_parametrs();
			display_line();				
			jQuery(window).trigger("resize");
		}
		function display_line(){
			var main_width=element.parent().width();
			var sumary_inside_width=0;
			element.find(".wpdevart_countdown_extend_element").each(function(){
				sumary_inside_width=sumary_inside_width+parseInt(jQuery(this).attr('date-width'))+parseInt(jQuery(this).attr('date-distance'));
			})
			kaificent=(sumary_inside_width)/main_width;
			if(kaificent>1 && main_width>0){
				element.find(".wpdevart_countdown_extend_element").each(function(){
					jQuery(this).width(Math.floor(parseInt(jQuery(this).attr('date-width'))/kaificent));
					jQuery(this).height(Math.floor(parseInt(jQuery(this).attr('date-width'))/kaificent));
					jQuery(this).css("margin-right",Math.floor(parseInt(jQuery(this).attr('date-distance'))/kaificent));
					var time_left_extended=jQuery(this).find(".time_left_extended");
					var time_text=jQuery(this).find(".time_text");
					var time_left_extended_param={};
					var time_text_param={};
					time_left_extended_param["font"]=Math.floor(parseInt(time_left_extended.attr("date-font"))/kaificent);
					time_text_param["font"]=Math.floor(parseInt(time_text.attr("date-font"))/kaificent);
					
					time_left_extended_param["margin"]=time_left_extended.attr("date-margin").split(" ");					
					jQuery.each(time_left_extended_param["margin"],function(index,value){
						time_left_extended_param["margin"][index]=Math.floor((parseInt(value)/kaificent));
					})
					time_left_extended_param["margin"]=time_left_extended_param["margin"].join('px ');
					time_left_extended_param["margin"]+="px"
					
					time_text_param["margin"]=time_text.attr("date-margin").split(" ");
					jQuery.each(time_text_param["margin"],function(index,value){
						time_text_param["margin"][index]=Math.floor((parseInt(value)/kaificent));
					})					
					time_text_param["margin"]=time_text_param["margin"].join('px ');
					time_text_param["margin"]+="px"
					
					time_left_extended_param["padding"]=time_left_extended.attr("date-padding").split(" ");
					jQuery.each(time_left_extended_param["padding"],function(index,value){
						time_left_extended_param["padding"][index]=Math.floor((parseInt(value)/kaificent));
					})
					time_left_extended_param["padding"]=time_left_extended_param["padding"].join('px ');
					time_left_extended_param["padding"]+="px"
					
					time_text_param["padding"]=time_text.attr("date-padding").split(" ");
					jQuery.each(time_text_param["padding"],function(index,value){
						time_text_param["padding"][index]=Math.floor((parseInt(value)/kaificent));
					})					
					time_text_param["padding"]=time_text_param["padding"].join('px ');
					time_text_param["padding"]+="px"
					
					time_left_extended.css("font-size",time_left_extended_param["font"]);
					time_text.css("font-size",time_text_param["font"]);
					time_left_extended.css("margin",time_left_extended_param["margin"]);
					time_text.css("margin",time_text_param["margin"]);
					time_left_extended.css("padding",time_left_extended_param["padding"]);
					time_text.css("padding",time_text_param["padding"]);
					delete(time_left_extended);
					delete(time_text);
					delete(time_left_extended_param);
					delete(time_text_param);
				})	
			}
		}
		function initial_start_parametrs(){
			element.find(".wpdevart_countdown_extend_element").each(function(){
				jQuery(this).attr("date-width",jQuery(this).width());
				jQuery(this).attr("date-distance",jQuery(this).css("margin-right"));
				var time_left_extended=jQuery(this).find(".time_left_extended");
				var time_text=jQuery(this).find(".time_text");
				time_left_extended.attr("date-font",time_left_extended.css("font-size"));
				time_text.attr("date-font",time_text.css("font-size"));
				time_left_extended.attr("date-margin",time_left_extended.css("margin"));
				time_text.attr("date-margin",time_text.css("margin"));
				time_left_extended.attr("date-padding",time_left_extended.css("padding"));
				time_text.attr("date-padding",time_text.css("padding"));
				delete(time_left_extended);
				delete(time_text);
			})
		}
		function equals_url(url1,url2) {		
			// remove any prefix
			url2 = url2.replace("http://", "");
			url2 = url2.replace("http://www.", "");
			url2 = url2.replace("https://", "");
			url2 = url2.replace("https://www.", "");
			
			url1 = url1.replace("http://", "");
			url1 = url1.replace("http://www.", "");
			url1 = url1.replace("https://", "");
			url1 = url1.replace("https://www.", "");
			// assume any URL that starts with a / is on the current page's domain
			if (url1.substr(url1.length - 1) != "/") {
				url1 = url1+"/"
			}
			if (url2.substr(url2.length - 1) != "/") {
				url2 = url2+"/"
			}
			if(url1===url2){
				return true;
			}
			return false;
		}
	}
})(jQuery)
	