// Custom Suggestion Plugin for SCEditor
// -> Requires Tribute.js (my modified version for compatibility)
sceditor.plugins.scsuggest = function() {
	// Wait until the editor is ready.
	this.signalReady = function() {
		// Create a reference of the instance
		var that = this;
		// Get instance of the editor's body
		var body = this.getBody();
		// Get the iframe in use by this instance
		var frame = null;
		var frames = parent.document.getElementsByTagName('iframe'); //have to get it from the parent (window)
		for (var i = 0; i < frames.length; i++) {
			if (frames[i].contentDocument === body.ownerDocument) {
				frame = frames[i];
				// console.log(frame.parentNode)
			}
		}
		var container = $(frame).closest('.sceditor-container').get(0);
		// console.log($(frame).closest('.sceditor-container'))
		//Make collection of triggers
		var triggers = [
			{
				trigger: '[',
				values: function(text, cb) {
					getMentions(text, function(mentions) {
						return cb(mentions);
					});
				},
				lookup: function(mention, text) {
					return mention.title;
				},
				selectTemplate: function(suggest) {
					var ret = nonArticleTemplate(suggest, that);
					// console.log(ret)
					return ret;
				}
			},
			{
				trigger: '@',
				// Parse the values
				values: function(text, cb) {
					// Retrieve them from server
					getArticles(text, function(articles) {
						// console.log('Aricles', articles)
						return cb(articles);
					});
				},
				// Search through the values
				lookup: function(article, text) {
					return article.title;
				},
				// Format the output (need to check if editor instance is in source/wysiwyg mode)
				selectTemplate: function(article) {
					var ret = articleTemplate(article, that);
					return ret;
				}
			}
		];
		// Initialize Tribute to fetch the data and present it
		var mentions = new Tribute({
			// menuContainer: document.body, //Testing positioning
			menuContainer: frame.parentNode,
			positionMenu: true,
			collection: triggers
		});

		var sourceMentions = new Tribute({
			menuContainer: container,
			positionMenu: true,
			collection: triggers
		});
		// console.log($(container).find('textarea'))
		// Bind Tribute instance to editor instance
		mentions.attach(body);
		sourceMentions.attach($(container).find('textarea').get(0));
	};
};

var ignoreList = [ 'container', 'section', 'youtube', 'spoiler' ];
var inlineTags = [ 'event', 'history' ];

//Functions for mention.selectTemplate
function nonArticleTemplate(suggest, that) {
	if (that.inSourceMode()) {
		return '[' + suggest.original.bbcode;
	}
	var ret = that.fromBBCode('[' + suggest.original.bbcode);
	// console.log(suggest, inlineTags.indexOf(suggest.original.type))
	if (suggest.original.type && inlineTags.indexOf(suggest.original.type) > -1) {
		// console.log('Element should be inline')
		// console.log(ret.substring(0,5) === '<div>',ret.substring(0,5))
		// console.log(ret.substring(ret.length-7) === '</div>',ret.substring(ret.length-7) )
		// console.log(ret)
		if (ret.substring(0, 5) === '<div>' && ret.substring(ret.length - 7).indexOf('</div>') > -1) {
			// console.log('Need to remove wrapping div')
			ret = ret.substring(5, ret.length - 7);
		}
	}
	// console.log(ret);

	return ret;
}
function articleTemplate(article, that) {
	var name = article.original.title;
	var bbcode = article.original.bbcode;
	var link = bbcode.substring(bbcode.lastIndexOf('(') + 1, bbcode.lastIndexOf(')'));
	// console.log(name, bbcode, link)
	name = bbcode.substring(0, bbcode.indexOf('('));
	// console.log('name ',name)
	if (that.inSourceMode()) {
		return '@' + article.original.bbcode;
	}
	return (
		'<span data-wa-article="1" contenteditable="false" data-wa-article-name="' +
		name +
		'" data-wa-article-link="' +
		link +
		'" class="renderLink" style="display: inline;">' +
		'@' +
		'<span data-article-text contenteditable="true">' +
		name +
		'</span>' +
		'' +
		'<span contenteditable="false">' +
		'(' +
		link +
		')' +
		'</span>' +
		'</span><span>&zwnj;</span>'
	);
}
//Function for retrieving articles from server
function getArticles(text, cb) {
	var URL = '/api/article/bbcode.json?q=' + text;
	// var URL = 'http://localhost:9010/demo?q=' + text;
	if (ignoreList.indexOf(text) > -1) {
		// console.log('query found in IgnoredCommand List');
		return cb([]);
	}
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var data = JSON.parse(xhr.responseText);
				if (data) {
					cb(data);
				} else {
					cb([]);
				}
			} else if (xhr.status === 403) {
				cb([]);
			} else {
				cb([]);
			}
		}
	};

	xhr.open('GET', URL, true);
	xhr.send();
}

function getMentions(text, cb) {
	var URL = '/api/mention/bbcode.json?q=' + text;
	// var URL = 'http://localhost:9010/image?q='+text;
	if (ignoreList.indexOf(text) > -1) {
		// console.log('query found in IgnoredCommand List');
		return cb([]);
	}
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var data = JSON.parse(xhr.responseText);
				if (data) {
					cb(data);
				} else {
					cb([]);
				}
			} else if (xhr.status === 403) {
				cb([]);
			} else {
				cb([]);
			}
		}
	};

	xhr.open('GET', URL, true);
	xhr.send();
}
