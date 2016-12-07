jQuery(document).ready(function($) {
	if (document.getElementById('close_button')){
		document.getElementById('close_button').onclick = function() {
			var date = new Date();
			date.setTime(date.getTime()+(1*24*60*60*1000));
	        var expires = "; expires="+date.toGMTString();

			document.cookie="pop_state=hidden; expires="+expires;
	    	document.getElementById('popup-sidebar').style.display = "none";
    	}
	}

	var shareBox = {
		num_share: 0,
		fbLoaded: false,
		regShare: function(elm) {
			shareBox.addShare(elm);
			return false;
		},
		windowOptions: "scrollbars=yes,resizable=yes,toolbar=no,location=yes",
		facebook: function(data) {
			var _url = 'http://www.facebook.com/share.php?u=|u|';
			_url = _url.replace('|u|', data.pageUrl).replace('|t|', data.pageTitle).replace('|d|', data.pageDesc).replace('|140|', data.pageTitle.substring(0, 130));
			window.open(_url, shareBox.windowOptions, 'width=640, height=528');
		},
		twitter: function(data) {
			var twAPI = "https://twitter.com/intent/tweet",
				title = encodeURIComponent(data.pageTitle),
				url = encodeURIComponent(data.pageUrl);

			window.open(twAPI + "?text=" + title + "&url=" + url,
				shareBox.windowOptions, "width=550,height=320"
			);
		},
		linkedin: function(data) {
			var inAPI = "http://www.linkedin.com/shareArticle",
				title = encodeURIComponent(data.pageTitle),
				url = encodeURIComponent(data.pageUrl),
				desc = encodeURIComponent(data.pageDesc),
				source = "Jobplanet Indonesia";

			window.open(inAPI + "?mini=true&title=" + title + "&url=" + encodeURIComponent(url) + "&summary=" + desc + "&source=" + source,
				shareBox.windowOptions, "width=550,height=320"
			);
		},
		gplus: function(data) {
			var _url = 'https://plusone.google.com/_/+1/confirm?url=' + encodeURIComponent(data.pageUrl) + '&title=' + encodeURIComponent(data.pageTitle);
			window.open(_url, shareBox.windowOptions, 'width=640, height=528');
		},
		fb_copy: function(data) {
			var obj = {
				method: 'feed',
				display: 'popup',
				link: data.pageUrl,
				picture: data.pageImage,
				name: data.pageTitle,
				// caption: data.pageDesc,
				caption: data.pageUrl,
				description: '',
			};
			FB.ui(obj);
		},
		addShare: function(elm) {
			var url_ex = $(elm).attr('data-url');
			if (url_ex.substr(0, 2) == '//')
				url_ex = 'http:' + url_ex;

			var data = {
				pageUrl: $(elm).attr('data-url'),
				pageTitle: $(elm).attr('data-title'),
				pageDesc: $(elm).attr('data-desc'),
				pageImage: $(elm).attr('data-image')
			}
			if (!data.pageImage) {
				data.pageImage = 'https://jpassetsid.jobplanet.com/assets/global/d/id-id/about_us-ced652def319a28d6c9c849fde514917.jpg';
			}

			if ($(elm).attr('class') == 'share fb') {
				shareBox.fb_copy(data);
			} else if ($(elm).attr('class') == 'share tw') {
				shareBox.twitter(data);
			} else if ($(elm).attr('class') == 'share gp') {
				shareBox.gplus(data);
			} else if ($(elm).attr('class') == 'share in') {
				shareBox.linkedin(data);
			}

			return false;
		},
		addCounter: function(elm) {
			var url_ex = $(elm).attr('data-url');
			if (url_ex.substr(0, 1) == '//')
				url_ex = 'http:' + url_ex;

			var data = {
				pageUrl: url_ex,
				pageTitle: $(elm).attr('data-title'),
				pageDesc: $(elm).attr('data-desc'),
				pageImage: $(elm).attr('data-image')
			}

			if ($(elm).hasClass('fb')) {
				shareBox.countFB(elm);
				$(elm).click(function(e) {
					shareBox.fb_copy(data);
					e.preventDefault();
				});
			} else if ($(elm).hasClass('tw')) {
				shareBox.countTW(elm);
				$(elm).click(function(e) {
					shareBox.twitter(data);
					e.preventDefault();
				});
			} else if ($(elm).hasClass('gplus')) {
				shareBox.countGplus(elm);
				$(elm).click(function(e) {
					shareBox.gplus(data);
					e.preventDefault();
				});
			}
		},
		countFB: function(elm) {
			var pageUrl = $(elm).attr('data-url');
			FB.api({
				method: 'fql.query',
				query: 'SELECT share_count FROM link_stat WHERE url = "' + pageUrl + '"'
			}, function(data) {
				$(elm).find('span').html(data[0].share_count);

				// update total share
				var total_share = $(elm).closest('.share_top').find('.total-share');
				if (typeof $(total_share) !== 'undefined') {
					//var num = $(total_share).find('span').html();
					num = parseInt(total_share) + parseInt(data[0].share_count);
					$(total_share).html(num);
				}
			});
		},
		countTW: function(elm) {
			var pageUrl = $(elm).attr('data-url');
			var tweets;
			$.getJSON('http://urls.api.twitter.com/1/urls/count.json?url=' + pageUrl + '&callback=?', function(data) {
				tweets = data.count;
				$(elm).find('span').html(tweets);

				// update total share
				var total_share = $(elm).closest('.share-count').find('.total-share');
				if (typeof $(total_share) !== 'undefined') {
					//var num = $(total_share).find('span').html();
					num = parseInt(total_share) + parseInt(tweets);
					$(total_share).html(num);
				}
			});
		},
		countGplus: function(elm) {
			var pageUrl = $(elm).attr('data-url');
			var api_url = baseurl + '//share?url=' + pageUrl;

			$.ajax({
				url: api_url,
				dataType: 'json',
				contentType: 'application/json',
				type: 'GET',
				processData: false,
				success: function(data) {
					var google_pluses = data;
					$(elm).find('span').html(google_pluses);
					// update total share
					var total_share = $(elm).closest('.share-count').find('.total-share');
					if (typeof $(total_share) !== 'undefined') {
						//var num = $(total_share).find('span').html();
						num = parseInt(total_share) + parseInt(google_pluses);
						$(total_share).html(num);
					}
				}
			})
		},
		run : function(elm) {
			//shareBox.addCounter(cshare)
		},
		includeFb: function() {
			window.fbAsyncInit = function() {
				FB.init({
					appId: '1644046675828466',
					xfbml: true,
					version: 'v2.3'
				});
			};

			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement(s);
				js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}
	};

	$( ".search-toggle" ).click(function() {
		$( ".search-input, .menu-item, .search-toggle" ).toggleClass('active');
	});

	$('#twitter-slider').owlCarousel({
		loop:true,
		margin:0,
		items:1,
		autoplay:true,
		smartSpeed:1500,
		autoplayTimeout:5000,
		autoplayHoverPause:true,
		dot:true
	});

	shareBox.includeFb();
	$('.share-article').find('a').click(function(e) {
		if ($(this).hasClass('noshare')) {
			var skip;
		} else {
			shareBox.addShare(this);
			e.preventDefault();
		}
	});

	//JQuery Twitter Feed. Coded by Tom Elliott @ www.webdevdoor.com (2013) based on https://twitter.com/javascripts/blogger.js
	//Requires JSON output from authenticating script: http://www.webdevdoor.com/php/authenticating-twitter-feed-timeline-oauth/
  var displaylimit = 10;
  var twitterprofile = "jobplanetid";
	var screenname = "Jobplanet ID";
  var showdirecttweets = false;
  var showretweets = true;
  var showtweetlinks = true;
  var showprofilepic = true;
	var showtweetactions = false;
	var showretweetindicator = false;


  var headerHTML = '';
  var loadingHTML = '';
	//headerHTML += '<h1>'+screenname+' <span style="font-size:13px"><a href="https://twitter.com/'+twitterprofile+'" target="_blank">@'+twitterprofile+'</a></span></h1></div>';
	loadingHTML += '<div id="loading-container"></div>';

	$('#twitter-feed').html(headerHTML + loadingHTML);

    $.getJSON('/wp-content/themes/jobplanet-blog/tweets.php',
        function(feeds) {
		   //alert(feeds);
            var feedHTML = '';
            var displayCounter = 1;
            for (var i=0; i<feeds.length; i++) {
				var tweetscreenname = feeds[i].user.name;
                var tweetusername = feeds[i].user.screen_name;
                var profileimage = feeds[i].user.profile_image_url_https;
                var status = feeds[i].text;
				var isaretweet = false;
				var isdirect = false;
				var tweetid = feeds[i].id_str;

				//If the tweet has been retweeted, get the profile pic of the tweeter
				if(typeof feeds[i].retweeted_status != 'undefined'){
				   profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
				   tweetscreenname = feeds[i].retweeted_status.user.name;
				   tweetusername = feeds[i].retweeted_status.user.screen_name;
				   tweetid = feeds[i].retweeted_status.id_str;
				   status = feeds[i].retweeted_status.text;
				   isaretweet = true;
				 };


				 //Check to see if the tweet is a direct message
				 if (feeds[i].text.substr(0,1) == "@") {
					 isdirect = true;
				 }

				//console.log(feeds[i]);

				 //Generate twitter feed HTML based on selected options
				 if (((showretweets == true) || ((isaretweet == false) && (showretweets == false))) && ((showdirecttweets == true) || ((showdirecttweets == false) && (isdirect == false)))) {
					if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {
						if (showtweetlinks == true) {
							status = addlinks(status);
						}

						if (displayCounter == 1) {
							feedHTML += headerHTML;
						}

						feedHTML += '<div class="twitter-article" id="tw'+displayCounter+'">';
						//feedHTML += '<div class="twitter-pic"><a href="https://twitter.com/'+tweetusername+'" target="_blank"><img src="'+profileimage+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></a></div>';
						feedHTML += '<div class="twitter-text"><p><span class="tweet-time"><a href="https://twitter.com/'+tweetusername+'/status/'+tweetid+'" target="_blank"><i class="fa fa-clock-o" ></i> '+relative_time(feeds[i].created_at)+'</a></span><br/>'+status+'</p>';

						if ((isaretweet == true) && (showretweetindicator == true)) {
							feedHTML += '<div id="retweet-indicator"></div>';
						}
						if (showtweetactions == true) {
							feedHTML += '<div id="twitter-actions"><div class="intent" id="intent-reply"><a href="https://twitter.com/intent/tweet?in_reply_to='+tweetid+'" title="Reply"></a></div><div class="intent" id="intent-retweet"><a href="https://twitter.com/intent/retweet?tweet_id='+tweetid+'" title="Retweet"></a></div><div class="intent" id="intent-fave"><a href="https://twitter.com/intent/favorite?tweet_id='+tweetid+'" title="Favourite"></a></div></div>';
						}

						feedHTML += '</div>';
						feedHTML += '</div>';
						displayCounter++;
					}
				 }
            }

            $('#twitter-feed').html(feedHTML);

			//Add twitter action animation and rollovers
			if (showtweetactions == true) {
				$('.twitter-article').hover(function(){
					$(this).find('#twitter-actions').css({'display':'block', 'opacity':0, 'margin-top':-20});
					$(this).find('#twitter-actions').animate({'opacity':1, 'margin-top':0},200);
				}, function() {
					$(this).find('#twitter-actions').animate({'opacity':0, 'margin-top':-20},120, function(){
						$(this).css('display', 'none');
					});
				});

				//Add new window for action clicks

				$('#twitter-actions a').click(function(){
					var url = $(this).attr('href');
				  window.open(url, 'tweet action window', 'width=580,height=500');
				  return false;
				});
			}

			function animatetweets() {
				var tweetdelaytime = 10000;
				var tweetfadetime = 500;
				var fadeoffsetin = 10;
				var fadeoffsetout = -10;

				var starttweet = 1;
				var animatetweet = starttweet;


				for (var i=starttweet; i<displayCounter; i++) {
					$('#tw'+i).css({'display': 'none', 'opacity':0});
				}
				fadetweet();
				function fadetweet(){

					$('#tw'+animatetweet).css({'display': 'block'});
					$('#tw'+animatetweet).css('margin-top', -fadeoffsetin);
					$('#tw'+animatetweet).animate({'opacity': 1, 'margin-top':0},tweetfadetime, function(){
						$('#tw'+animatetweet).delay(tweetdelaytime).animate({'opacity': 0, 'margin-top':fadeoffsetout},tweetfadetime, function(){
							$('#tw'+animatetweet).css({'display': 'none', 'margin-top':0});
							if (animatetweet < displayCounter-2+starttweet) {
								animatetweet++;
							} else {
								animatetweet = 0+starttweet;
							}
							setTimeout(fadetweet, 0);
						});
					});
				}
			}

			animatetweets();

    }).error(function(jqXHR, textStatus, errorThrown) {
		var error = "";
			 if (jqXHR.status === 0) {
               error = 'Connection problem. Check file path and www vs non-www in getJSON request';
            } else if (jqXHR.status == 404) {
                error = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                error = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                error = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                error = 'Time out error.';
            } else if (exception === 'abort') {
                error = 'Ajax request aborted.';
            } else {
                error = 'Uncaught Error.\n' + jqXHR.responseText;
            }
       		console.log("error: " + error);
    });


    //Function modified from Stack Overflow
    function addlinks(data) {
        //Add link to all http:// links within tweets
         data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
            return '<a href="'+url+'" >'+url+'</a>';
        });

        //Add link to @usernames used within tweets
        data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
            return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
        });
		//Add link to #hastags used within tweets
        data = data.replace(/\B#([_a-z0-9]+)/ig, function(reply) {
            return '<a href="https://twitter.com/search?q='+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
        });
        return data;
    }


    function relative_time(time_value) {
      var values = time_value.split(" ");
      time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
      var parsed_date = Date.parse(time_value);
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	  var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
      delta = delta + (relative_to.getTimezoneOffset() * 60);

      if (delta < 60) {
        return '1m';
      } else if(delta < 120) {
        return '1m';
      } else if(delta < (60*60)) {
        return (parseInt(delta / 60)).toString() + 'm';
      } else if(delta < (120*60)) {
        return '1h';
      } else if(delta < (24*60*60)) {
        return (parseInt(delta / 3600)).toString() + 'h';
      } else if(delta < (48*60*60)) {
        //return '1 day';
		return shortdate;
      } else {
        return shortdate;
      }
    }
});
