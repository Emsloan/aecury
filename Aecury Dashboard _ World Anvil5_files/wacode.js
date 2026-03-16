//Define Custom BBCode tags
// @[ARTICLENAME](ARTICLELINK)
sceditor.formats.bbcode.set('article', {
  tags: {
    span: {
      'data-wa-article': '1'
    },
    div: {
      'data-wa-article': '1'
    }
  },
  isInline: true,
  isHtmlInline: true,
  isSelfClosing: true,
  allowsEmpty: true,
  excludeClosing: true,
  format: function (element, content) {
    // console.log(element, content)
    // var name = $(element).attr('data-wa-article-name');
    var name = $(element).find('[data-article-text]').text();
    var link = $(element).attr('data-wa-article-link');
    // console.log(name)
    return '@' + name + '(' + link + ')'
  },
  html: function (token, attrs, content) {
    // console.log(token)
    var name = token.attrs['data-wa-article-name']
    var link = token.attrs['data-wa-article-link']
    return '<span data-wa-article="1" contenteditable="false" data-wa-article-name="' + name + '" data-wa-article-link="' + link + '" class="renderLink" style="display: inline;">' +
      // '<span class="sceditor-ignore">'+
      '@' +
      '<span data-article-text contenteditable="true">' +
      name +
      '</span>' +
      '' +
      '<span contenteditable="false" class="">' + //contenteditable="false"
      '(' + link + ')' +
      '</span>' +
      // '</span>'+
      '</span><span>&zwnj;</span>'
  }
})
// [noparse]
sceditor.formats.bbcode.set('noparse', {
  tags: {
    span: {
      'data-wa-noparse': '1'
    }
  },
  isInline: true,
  isHtmlInline: true,
  allowedChildren: ['#', '#newline'],
  format: '[noparse]{0}[/noparse]',
  html: '<span data-wa-noparse="1">{0}</span>'
})
// [url:URL{|TAB?}]NAME[/url]
sceditor.formats.bbcode.set('url', {
  tags: {
    span: {
      'data-wa-base-url': '1'
    }
  },
  isInline: true,
  isHtmlInline: true,
  breakBefore: false,
  breakAfter: false,
  breakStart: false,
  breakEnd: false,
  allowsEmpty: true,
  isSelfClosing: false,
  format: function (element, content) {
    var url = $(element).find('[data-wa-url-location]').text();
    var tab = $(element).attr('data-wa-url-newtab')
    var name = $(element).find('[data-wa-url-display]').text();
    // console.log('URL:' + name + '('+ url + ')')
    if (!name || name.length === 0) {
      name = url;
    }

    if (tab && tab.length > 0) {
      // console.log(tab)
      tab = '|tab'
    } else {
      tab = ''
    }
    // console.log('[url:'+url+tab+']'+name+'[/url]')
    return '[url:' + url + tab + ']' + name + '[/url]'
  },
  html: function (token, attrs, content) {
    // console.log('URL attrs', attrs)
    var url = attrs['data-wa-url-link'];
    var tab = (attrs['data-wa-url-newtab'] ? 'data-wa-url-newtab="1"' : '')
    var name = content
    var tabText = ''

    if (!name || name.length === 0) {
      name = url
    }

    if (tab.length > 0) {
      tabText = '|tab'
    }

    return (
      '<span data-wa-base-url="1" contenteditable="false" data-wa-url-link="' + url + '" ' + tab + '>' +
      '<span class="tag" style="display: inline;">[url:<span contenteditable="true" data-wa-url-location>' + url + tabText + '</span>]</span>' +
      '<span contenteditable="true" data-wa-url-display>' + name + '</span>' +
      '<span contenteditable="false" class="tag" style="display: inline;">[/url]</span>' +
      '</span><span>&zwnj;</span>'
    )
  }
})
//  [br]
sceditor.formats.bbcode.set('br', {
  tags: {
    'span': {
      'data-wa-custom-br': '1'
    }
  },
  isSelfClosing: true,
  isInline: true,
  breakBefore: true,
  breakAfter: false,
  format: '[br]',
  html: '<span class="tag" contenteditable="false" data-wa-custom-br="1" style="margin-bottom:0px;">[br]</span><span>&zwnj;</span>'
});

// tab
sceditor.formats.bbcode.set('tab', {
  tags: {
    span: {
      'data-wa-tab': '1'
    }
  },
  isSelfClosing: true,
  isInline: true,
  isHtmlInline: true,
  breakBefore: false,
  breakAfter: false,
  breakStart: false,
  breakEnd: false,
  format: '\u0009',
  html: '<span data-wa-tab="1" class="editor-tab"></span>'
})
// [dc]
sceditor.formats.bbcode.set('dc', {
  tags: {
    span: {
      'data-wa-dropcap': '1'
    }
  },
  format: '[dc]{0}[/dc]',
  html: '<span class="dropcap" data-wa-dropcap="1">{0}</span>'
})

// [p]
sceditor.formats.bbcode.set('p', {
  tags: {
    'span': {
      'data-editor-paragraph': '1'
    },
    'p': {
      'data-editor-paragraph': '1'
    }
  },
  breakAfter: false,
  breakBefore: false,
  isInline: true,
  isHtmlInline: true,
  allowsEmpty: true,
  format: '[p]{0}[/p]',
  html: '<span data-editor-paragraph="1" class="paragraph-custom">{0}</span>'
});
// [h] (Compiles to h2, alias for [h1])
sceditor.formats.bbcode.set('h', {
  isInline: false,
  isHtmlInline: false,
  tags: {
    h2: {
      'data-wa-element-h': '1'
    }
  },
  allowedChildren: ['#', 'color', 'size'],
  breakBefore: false,
  breakAfter: true,
  format: function (element, content) {
    var id = $(element).attr('id');
    if (!id) {
      id = '';
    } else {
      id = '|' + id;
    }
    return '[h' + id + ']' + content + '[/h]';
  },
  html: function (token, attrs, content) {
    var attr = '';
    if (attrs['id']) {
      attr = ' id="' + attrs['id'] + '"';
    }
    return '<h2 data-wa-element-h="1"' + attr + '>' + content + '</h2>';
  }
})
// [h1] (Compiles to h2)
sceditor.formats.bbcode.set('h1', {
  isInline: false,
  isHtmlInline: false,
  tags: {
    h2: {
      'data-wa-element-h2': '1'
    }
  },
  allowedChildren: ['#', 'color', 'size'],
  breakBefore: false,
  breakAfter: true,
  format: function (element, content) {
    var id = $(element).attr('id');
    if (!id) {
      id = '';
    } else {
      id = '|' + id;
    }
    return '[h1' + id + ']' + content + '[/h1]';
  },
  html: function (token, attribs, content) {
    var attr = '';
    if (attribs['id']) {
      attr = ' id="' + attribs['id'] + '"';
    }
    return '<h2 data-wa-element-h2="1"' + attr + '>' + content + '</h2>';
  }
});

// [h2] (Compiles to h3)
sceditor.formats.bbcode.set('h2', {
  isInline: false,
  tags: {
    h3: {
      'data-wa-element-h3': '1'
    }
  },
  breakAfter: true,
  format: function (element, content) {

    var id = $(element).attr('id');
    if (!id) {
      id = '';
    } else {
      id = '|' + id;
    }
    return '[h2' + id + ']' + content + '[/h2]';
  },
  html: function (token, attribs, content) {
    var attr = '';
    if (attribs['id']) {
      attr = ' id=' + attribs['id'];
    }
    return '<h3 data-wa-element-h3="1"' + attr + '>' + content + '</h3>';
  }
});

// [h3] (Compiles to h4)
sceditor.formats.bbcode.set('h3', {
  isInline: false,
  tags: {
    h4: {
      'data-wa-element-h4': '1'
    }
  },
  breakAfter: true,
  format: function (element, content) {
    var id = $(element).attr('id');
    if (!id) {
      id = '';
    } else {
      id = '|' + id;
    }
    return '[h3' + id + ']' + content + '[/h3]';
  },
  html: function (token, attribs, content) {
    var attr = '';
    if (attribs['id']) {
      attr = ' id=' + attribs['id'];
    }
    return '<h4 data-wa-element-h4="1"' + attr + '>' + content + '</h4>';
  }
});

// [h4] (Compiles to h5)
sceditor.formats.bbcode.set('h4', {
  isInline: false,
  tags: {
    h5: {
      'data-wa-element-h5': '1'
    }
  },
  breakAfter: true,
  format: function (element, content) {
    var id = $(element).attr('id');
    if (!id) {
      id = '';
    } else {
      id = '|' + id;
    }
    return '[h4' + id + ']' + content + '[/h4]';
  },
  html: function (token, attribs, content) {
    var attr = '';
    if (attribs['id']) {
      attr = ' id=' + attribs['id'];
    }
    return '<h5 data-wa-element-h5="1"' + attr + '>' + content + '</h5>';
  }
});

// [row]
sceditor.formats.bbcode.set('row', {
  isInline: false,
  allowsEmpty: true,
  tags: {
    'div': {
      'data-editor-row': '1'
    }
  },
  format: '[row]{0}[/row]',
  html: '<div class="row user-row" data-editor-row="1">{0}</div>'
});

// [col]
sceditor.formats.bbcode.set('col', {
  isInline: false,
  allowsEmpty: true,
  tags: {
    'div': {
      'data-editor-col': '1'
    }
  },
  format: '[col]{0}[/col]',
  html: '<div class="col-md-6" data-editor-col="1"><p>{0}</p></div>'
});

// [col3]
sceditor.formats.bbcode.set('col3', {
  isInline: false,
  allowsEmpty: true,
  tags: {
    div: {
      'data-wa-editor-col3': '1'
    }
  },
  format: '[col3]{0}[/col3]',
  html: '<div class="col-md-4" data-wa-editor-col3="1"><p>{0}</p></div>'
})

// [small]
sceditor.formats.bbcode.set('small', {
  isInline: true,
  tags: {
    'small': {
      'data-editor-smalltext': '1'
    }
  },
  breakBefore: false,
  breakAfter: false,
  format: '[small]{0}[/small]',
  html: '<small data-editor-smalltext="1">{0}</small>'
});

// [strike] (alias for [s])
sceditor.formats.bbcode.set('strike', {
  isInline: true,
  tags: {
    'del': {
      'data-editor-strikethrough': '1'
    }
  },
  format: '[strike]{0}[/strike]',
  html: '<del data-editor-strikethrough="1">{0}</del>'
});

// [in]
sceditor.formats.bbcode.set('in', {
  isInline: true,
  isHtmlInline: true,
  tags: {
    span: {
      'data-editor-indented-paragraph': '1'
    }
  },
  format: '[in]{0}[/in]',
  html: '<span class="paragraph-indent" data-editor-indented-paragraph="1">{0}</span>'
  // html: function(token, attrs, content) {
  //   console.log('[in]')
  //   return '<div class="paragraph-indent" data-editor-indented-paragraph="1">' + content + '</div>';
  // }
});

// [img:id|align|width|nolink]
sceditor.formats.bbcode.set('img', {
  isSelfClosing: true,
  allowsEmpty: true,
  tags: {
    img: {
      src: null,
      'data-wa-format': '1'
    },
    a: {
      'data-wa-img-link': null
    }
  },
  allowedChildren: ['#'],
  format: function (element, content) {
    var attribs = '';
    var imgId, align, width;

    imgId = $(element).attr('data-wa-img-id') || 'test';
    align = $(element).attr('data-wa-img-align') || null;
    width = $(element).attr('data-wa-img-width') || null;
    nolink = $(element).attr('data-wa-img-nolink') || null;

    attribs = ':' + imgId;
    if (align) {
      attribs += '|' + align;
      if (width) {
        attribs += '|' + width;
        if (nolink) {
          attribs += '|' + nolink;
        }
      }
    }
    return '[img' + attribs + ']';
  },
  html: function (token, attrs, content) {
    var attributes = '';
    var style = 'display: block;';
    if (attrs['data-wa-img-id']) {
      attributes += ' data-wa-img-id="' + attrs['data-wa-img-id'] + '"';
    }
    if (attrs['data-wa-img-align']) {
      attributes += ' data-wa-img-align="' + attrs['data-wa-img-align'] + '"';
      if (attrs['data-wa-img-align'] === 'left') {
        style += ' float: left;';
      } else if (attrs['data-wa-img-align'] === 'center') {
        style += ' margin: 0 auto;';
      } else if (attrs['data-wa-img-align'] === 'right') {
        style += ' float: right;';
      }
    } else {
      style += ' max-width: 100%;';
    }
    if (attrs['data-wa-img-width']) {
      attributes += ' data-wa-img-width="' + attrs['data-wa-img-width'] + '"';
      style += ' width: ' + attrs['data-wa-img-width'] + 'px;';
    }
    if (attrs['data-wa-img-nolink']) {
      attributes += ' data-wa-img-nolink="' + attrs['data-wa-img-nolink'] + '"';
      return '<img data-wa-format="1" src="#"' + attributes + 'style="' + style + '" />';
    }

    return '<a data-wa-img-link href="#"><img data-wa-format="1" src="#"' + attributes + 'style="' + style + '" /></a>';

  }
});
// [section:CSS_CLASS]
sceditor.formats.bbcode.set('section', {
  tags: {
    span: {
      'data-wa-section': '1'
    }
  },
  // breakEnd: true,
  isInline: false,
  isHtmlInline: false,
  allowedChildren: null,
  breakEnd: false,
  skipLastLineBreak: true,
  allowsEmpty: true,
  format: function (element, content) {
    var sectionID = $(element).attr('data-wa-section-id');
    return '[section:' + sectionID + ']' + this.toSource(content) + '[/section]';
    // return content;
  },
  html: function (token, attrs, content) {
    var sectionID = attrs['data-wa-section-id'];
    return (
      '<span contenteditable="false" data-wa-section="1" data-wa-section-id="' + sectionID + '" class="' + sectionID + '">' +
      '<span class="tag">' +
      '[section:' + sectionID + ']' +
      '</span>' +
      content +
      '<span class="tag">' +
      '[/section]' +
      '</span>' +
      '</span>'
    );
  }
});

// [container:CSS_CLASS]
sceditor.formats.bbcode.set('container', {
  tags: {
    span: {
      'data-wa-container': '1'
    },
    div: {
      'data-wa-container': '1'
    }
  },
  isInline: false,
  isHtmlInline: false,
  allowedChildren: null,
  isPreFormatted: true,
  breakEnd: true,
  breakStart: true,
  breakBefore: true,
  breakAfter: true,
  // skipLastLineBreak: true,
  isSelfClosing: false,
  allowsEmpty: true,
  // allowedChildren: ['#','h1','h2'],
  format: function (element, content) {
    // console.log('format', element, content)
    var innerContent = $(element).find('.container-content').get(0).innerHTML
    // console.log(innerContent)

    var containerID = $(element).find('.container-name').get(0).innerHTML
    // if(content) {
    //this.toSource(content)
    return '[container:' + containerID + ']' + this.toSource(innerContent) + '[/container]';
    // }
    // return '';

    // return this.toSource(content);
  },
  html: function (token, attrs, content) {
    // console.log('Container html', content)
    // console.log(this);
    //<span class="container-marker">\u00a0</span> &zwj;
    var containerID = attrs['data-wa-container-id'];
    return (
      '<span  data-wa-container="1" data-wa-container-id="' + containerID + '" class="' + containerID + '">' +
      '<span class="tag unselectable" contenteditable="false">' +
      '[container:' + '<span class="container-name" contenteditable="true">' + containerID + '</span>]' +
      '<br >' +
      '</span>' +
      '<span class="container-content">' +
      content +
      '</span>' +
      '<span class="tag unselectable sceditor-ignore">' +
      '<br>' +
      '[/container]' +
      // '<br>' +
      '</span>' +
      '</span><span>&zwnj;</span>'
    );
  }
});

// [anchor|ID]
sceditor.formats.bbcode.set('anchor', {
  isSelfClosing: true,
  tags: {
    span: {
      'data-wa-anchor': '1'
    }
  },
  format: function (element, content) {
    var anchorDest = $(element).attr('id');
    return '[anchor|' + anchorDest + ']';
  },
  html: function (token, attrs, content) {
    var anchorDest = attrs['data-wa-anchor-id'];
    return '<span data-wa-anchor="1" id="' + anchorDest + '"></span>';
  }
});

// [aloud]...[/aloud]
sceditor.formats.bbcode.set('aloud', {
  tags: {
    div: {
      'data-wa-aloud': '1'
    }
  },
  format: function (element, content) {
    return '[aloud]' + content + '[/aloud]';
  },
  html: function (token, attrs, content) {
    return '<div data-wa-aloud="1" class="aloud">' + content + '</div>';
  }
});

// [roll:FORMULA]
sceditor.formats.bbcode.set('roll', {
  tags: {
    span: {
      'data-wa-roll': "1"
    }
  },
  allowsEmpty: true,
  isInline: true,
  isHtmlInline: true,
  isSelfClosing: true,
  format: function (element, content) {
    var formula = $(element).attr('data');
    return '[roll:' + formula + ']';
  },
  html: function (token, attrs, content) {
    var formula = attrs['data'];
    return (
      '<span class="noRender" data-wa-roll="1" data="' + formula + '">' +
      '<span class="tag">' + '[roll:' + formula + ']' + '</span>' +
      '</span>'
    );
  }
});

// [redacted:NUM] (No error handling!)
sceditor.formats.bbcode.set('redacted', {
  isInline: true,
  isHtmlInline: true,
  isSelfClosing: true,
  allowsEmpty: true,
  tags: {
    span: {
      'data-wa-redacted': '1'
    }
  },
  format: function (element, content) {
    var numChars = $(element).attr('data-width');
    return '[redacted:' + numChars + ']';
  },
  html: function (token, attrs, content) {
    var numChars = parseInt(attrs['data-width'], 10);
    var string = '';
    for (var i = 0; i < numChars; i++) {
      string += '█';
    }
    return '<span data-wa-redacted="1" data-width="' + numChars + '" class="redacted">' + string + '</span>';
  }
});

// [podbean:URL]
sceditor.formats.bbcode.set('podbean', {
  tags: {
    div: {
      'data-wa-podbean': "1"
    }
  },
  allowsEmpty: true,
  isInline: false,
  isHtmlInline: false,
  isSelfClosing: true,
  format: function (element, content) {
    var url = $(element).attr('data-wa-podbean-url');
    return '[podbean:' + url + ']';
  },
  html: function (token, attrs, content) {
    var url = attrs['data-wa-podbean-url'];
    return (
      '<div data-wa-podbean="1" data-wa-podbean-url="' + url + '" contenteditable="false">' +
      // '<span class="tag">' + '[podbean:' + url + ']' + '</span>' + 
      '<iframe height="122px" width="100%" frameborder="0" scrolling="no" data-name="pb-iframe-player"' +
      ' src="https://www.podbean.com/media/player/' + url + '?from=site&skin=1&share=1&fonts=Helvetica&auto=0&download=1&version=1"></iframe>' +
      '</div>'
    );
  }
});

// [soundcloud:URL]
sceditor.formats.bbcode.set('soundcloud', {
  tags: {
    div: {
      'data-wa-soundcloud': "1"
    }
  },
  allowsEmpty: true,
  isInline: false,
  isHtmlInline: false,
  isSelfClosing: true,
  format: function (element, content) {
    var url = $(element).attr('data-wa-soundcloud-url');
    return '[soundcloud:' + url + ']';
  },
  html: function (token, attrs, content) {
    var url = attrs['data-wa-soundcloud-url'];
    return (
      '<div data-wa-soundcloud="1" data-wa-soundcloud-url="' + url + '" contenteditable="false">' +
      // '<span class="tag">' + '[soundcloud:' + url + ']' + '</span>' +
      '<iframe width="100%" height="300px" frameborder="0" allow="autoplay" scrolling="no" ' +
      'src="https://w.soundcloud.com/player/?url=' + url + '&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>' +
      '</div>'
    );
  }
});

// [kuula:URL]
sceditor.formats.bbcode.set('kuula', {
  tags: {
    div: {
      'data-wa-kuula': "1"
    }
  },
  allowsEmpty: true,
  isInline: false,
  isHtmlInline: false,
  isSelfClosing: true,
  format: function (element, content) {
    var url = $(element).attr('data-wa-kuula-url');
    return '[kuula:' + url + ']';
  },
  html: function (token, attrs, content) {
    var url = attrs['data-wa-kuula-url'];
    return (
      '<div data-wa-kuula="1" data-wa-kuula-url="' + url + '" contenteditable="false">' +
      // '<span class="tag">' + '[kuula:' + url + ']' + '</span>' +
      '<iframe width="100%" height="640" style="width: 100%; height: 640px; border: none; max-width: 100%;" frameborder="0" allow="vr,gyroscope,accelerometer,fullscreen" scrolling="no" allowfullscreen="true"' +
      ' src="https://kuula.co/share/' + url + '?fs=1&vr=0&zoom=1&thumbs=1&chromeless=0&logo=0"></iframe>' +
      '</div>'
    );
  }
});

// [sketchfab:URL]
sceditor.formats.bbcode.set('sketchfab', {
  tags: {
    div: {
      'data-wa-sketchfab': "1"
    }
  },
  allowsEmpty: true,
  isInline: false,
  isHtmlInline: false,
  isSelfClosing: true,
  format: function (element, content) {
    var url = $(element).attr('data-wa-sketchfab-url');
    return '[sketchfab:' + url + ']';
  },
  html: function (token, attrs, content) {
    var url = attrs['data-wa-sketchfab-url'];
    return (
      '<div data-wa-sketchfab="1" data-wa-sketchfab-url="' + url + '" contenteditable="false">' +
      // '<span class="tag">' + '[sketchfab:' + url + ']' + '</span>' +
      '<iframe height="640" width="100%" frameborder="0" src="https://sketchfab.com/models/' + url + '/embed?autospin=0.2&autostart=1&preload=1" allowfullscreen="true" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>' +
      '</div>'
    );
  }
});

// [anchorfm:URL]
sceditor.formats.bbcode.set('anchorfm', {
  tags: {
    div: {
      'data-wa-anchorfm': "1"
    }
  },
  allowsEmpty: true,
  isInline: false,
  isHtmlInline: false,
  isSelfClosing: true,
  format: function (element, content) {
    var url = $(element).attr('data-wa-anchorfm-url');
    return '[anchorfm:' + url + ']';
  },
  html: function (token, attrs, content) {
    var url = attrs['data-wa-anchorfm-url'];
    return (
      '<div data-wa-anchorfm="1" data-wa-anchorfm-url="' + url + '" contenteditable="false">' +
      // '<span class="tag">' + '[anchorfm:' + url + ']' + '</span>' +
      '<iframe height="102px" width="100%" frameborder="0" scrolling="no" src="' + url + '"></iframe>' +
      '</div>'
    );
  }
});

// [genesysdice:URL]
sceditor.formats.bbcode.set('genesysdice', {
  tags: {
    span: {
      'data-wa-genesysdice': "1"
    }
  },
  allowsEmpty: true,
  isInline: true,
  isHtmlInline: true,
  isSelfClosing: true,
  format: function (element, content) {
    var type = $(element).attr('data-wa-genesysdice-type');
    return '[genesysdice:' + type + ']';
  },
  html: function (token, attrs, content) {
    var type = attrs['data-wa-genesysdice-type'];
    return (
      '<span data-wa-genesysdice="1" class="noRender" data-wa-genesysdice-type="' + type + '">' +
      '<span class="tag">' + '[genesysdice:' + type + ']' + '</span>' +
      '</span>'
    );
  }
});

// [color:COLOR]
sceditor.formats.bbcode.set('color', {
  isInline: true,
  isHtmlInline: true,
  tags: {
    span: {
      'data-wa-font-color': '1'
    },
    font: {
      color: null
    }
  },
  breakAfter: false,
  breakEnd: false,
  skipLastLineBreak: true,
  format: function (element, content) {
    // console.log(content)
    var color = $(element).attr('color');
    if ((isGuildMember) && (isGuildMember === 1)) {
      return '[color:' + color + ']' + content + '[/color]';
    } else {
      return content
    }

  },
  html: function (token, attrs, content) {
    // console.log
    var color = attrs['data-color'];
    if ((isGuildMember) && (isGuildMember === 1)) {
      return '<font color="' + color + '">' + content + '</font>';
    } else {
      return (
        '<span data-wa-font-color="1" color="' + color + '">' +
        '<span class="tag">' +
        '[color:' + color + ']' +
        '</span>' +
        content +
        '<span class="tag">' +
        '[/color]' +
        '</span>' +
        '</span>'
      )
    }

  }
});

//Not yet stable!!!
// [quote]...(|author)[/quote] (Does not preserve internal bbcode switching modes)
sceditor.formats.bbcode.set('quote', {
  tags: {
    blockquote: null
  },
  isInline: false,
  isHtmlInline: false,
  allowedChildren: null,
  breakStart: true,
  // breakEnd: true,
  allowsEmpty: true,
  breakAfter: true,
  skipLastLineBreak: true,
  format: function (element, content) {
    // var author = $(element).children('.author')[0].textContent;
    var author = '';
    var authorBlock = $(element).find('.author');
    var text = $(element).html()
    // console.log(this)

    if (authorBlock && authorBlock.length > 0) {
      var authorBB = this.toSource(authorBlock[0].innerHTML);
      // console.log(authorBB)
      // author = '|' + authorBB.replace(/[\s\S]$/,'')
      author = '|' + this.toSource(authorBB)
      authorBlock.remove()

      text = this.toSource(element.innerHTML);
      // console.log(text)

    } else {
      text = this.toSource(element.innerHTML);
    }

    // content = $(element).innerHtml;
    // console.log($(element), content, author)

    // content = content.substring(0, content.indexOf(author));
    return '[quote]' + text + author + '[/quote]';
  },
  html: function (token, attrs, content) {
    // console.log('QUOTE called!')
    var author = '';
    if (content.indexOf('|') >= 0) {
      // console.log('Need to set author')
      author = content.substring(content.lastIndexOf('|'));
      // console.log()
      if (author.substr(0, 4) === '|tab') {
        author = false;
        console.log('ignoring |tab')
      } else {
        console.log(author)
        content = content.substring(0, content.lastIndexOf('|'));
      }

      console.log('html', author)
      if (author) {
        author = '<div class="author">' + author.substring(1) + '<div>';
      } else {
        author = '';
      }
    }
    return '<blockquote>' + content + author + '</blockquote>';
  }
});

// [spoiler] (Unable to interact with button)
sceditor.formats.bbcode.set('spoiler', {
  tags: {
    div: {
      'data-wa-spoiler-content': '1'
    }
  },
  isInline: true,
  isHtmlInline: false,
  breakBefore: false,
  breakEnd: false,
  breakStart: false,
  breakAfter: false,
  skipLastLineBreak: true,
  allowsEmpty: true,
  format: function (element, content) {
    //Get spoiler contents
    var content = $(element).find('.spoiler-content')[0].innerHTML

    //Get custom button name
    var buttonName = ($(element).attr('data-wa-spoiler-button-name') ? ' |' + $(element).attr('data-wa-spoiler-button-name') : '');

    //Remove Default Button Text
    if (buttonName === ' |Show Spoiler') {
      buttonName = '';
    }

    //Return the formatted wabbc
    return '[spoiler]' + this.toSource(content) + buttonName + '[/spoiler]';
  },
  html: function (token, attrs, content) {
    var spoilerID = makeid(10);
    var buttonName = 'Show Spoiler';
    var nameIndex = content.lastIndexOf('|')
    if (nameIndex > -1) {
      // console.log('SPOILER BUTTON')
      buttonName = content.substring(nameIndex + 1)
      content = content.substring(0, nameIndex);
      // console.log(buttonName)
    }
    return (
      '<div data-wa-spoiler-content="1" data-wa-spoiler-button-name="' + buttonName + '">' +
      '<a contenteditable="false" class="btn btn-sm spoiler-button btn-primary" data-toggle="collapse" href="#spoiler-' + spoilerID + `">` +
      buttonName +
      '</a>' +
      '<div class="collapse spoiler-container" id="spoiler-' + spoilerID + '">' +
      '<div class="well spoiler-content">' +
      content +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }
});

// [calendar:CALENDARID]
sceditor.formats.bbcode.set('calendar', {
  tags: {
    span: {
      'data-wa-calendar': '1'
    }
  },
  isSelfClosing: true,
  breakBefore: false,
  breakAfter: false,
  skipLastLineBreak: true,
  format: function (element, content) {
    var calendarID = $(element).attr('data-calendar-id');
    return '[calendar:' + calendarID + ']'
  },
  html: function (token, attrs, content) {
    var calendarID = attrs['data-calendar-id'];
    return (
      '<span data-wa-calendar="1" data-calendar-id="' + calendarID + '" contenteditable="false" class="calendar-presentation">' +
      '<span class="tag">' +
      '[calendar:' + calendarID + ']' +
      '</span>' +
      '</span>'
    )
  }
})

// [book:CATEGORYID]
sceditor.formats.bbcode.set('book', {
  tags: {
    span: {
      'data-wa-book': '1'
    }
  },
  isSelfClosing: true,
  format: function (element, content) {
    var bookID = $(element).attr('data-wa-category-id');
    return '[book:' + bookID + ']'
  },
  html: function (token, attrs, content) {
    var bookID = attrs['data-wa-category-id'];
    return (
      '<span data-wa-book="1" data-wa-category-id="' + bookID + '" contenteditable="false" class="bookcove">' +
      '<span class="tag">' +
      '[book:' + bookID + ']' +
      '</span>' +
      '</span>'
    )
  }
})

// [youtube:qj5ZahqBfFE]
sceditor.formats.bbcode.set('youtube', {
  tags: {
    div: {
      'data-wa-youtube': '1'
    }
  },
  allowsEmpty: true,
  isSelfClosing: true,
  isInline: false,
  isHtmlInline: false,
  format: function (element, content) {
    // console.log('format')
    var videoID = $(element).attr('data-wa-youtube-id');
    return '[youtube:https://youtube.com/watch?v=' + videoID + ']';
  },
  html: function (token, attrs, content) {
    // console.log('html')
    var videoID = attrs['data-wa-youtube-id'];
    if (!videoID || typeof videoID === 'undefined') {
      return ''
    }
    if (videoID.length !== 11) {
      videoID = videoID.match(/(?:v=|v\/|embed\/|youtu.be\/)(.{11})/)[1];
    }

    // console.log('ID', videoID)
    return (
      '<div data-wa-youtube="1" data-wa-youtube-id="' + videoID + '"  contenteditable="false">' +
      '<iframe width="560" height="315" frameborder="0" ' +
      'src="https://www.youtube.com/embed/' + videoID + '?wmode=opaque" ' +
      'data-youtube-id="' + videoID + '" allowfullscreen>' +
      '</iframe>' +
      '</div>'
    );
  }
});

// [spotify:68Mm7pDHxvo8j2DFq9GEUT]
sceditor.formats.bbcode.set('spotify', {
  tags: {
    div: {
      'data-wa-spotify': '1'
    }
  },
  allowsEmpty: true,
  isSelfClosing: true,
  isInline: false,
  isHtmlInline: false,
  format: function (element, content) {
    // console.log(element)
    var type = $(element).attr('data-wa-spotify-type').toLowerCase();
    var id = $(element).attr('data-wa-spotify-id');
    if (type === 'http' || type === 'https') {
      // console.log('Spotify URL!')
      var params = type + '://open.spotify.com/embed/' + id;
      return '[spotify:' + params + ']';

    } else {
      // console.log('Spotify ' + type)
      var spotifyID = $(element).attr('data-wa-spotify-id');
      var spotifyType = $(element).attr('data-wa-spotify-type');
      return '[spotify:' + spotifyType + ":" + spotifyID + ']';
    }


  },
  html: function (token, attrs, content) {

    var spotifyID = attrs['data-wa-spotify-id'];
    var spotifyType = attrs['data-wa-spotify-type'];
    var spotifyURL = attrs['data-wa-spotify-url-base'] || '';
    if (spotifyURL && (spotifyType === 'http' || spotifyType === 'https')) {
      // console.log('Spotify URL ATTR', attrs)
      if (spotifyURL.indexOf('embed') < 0) {
        spotifyURL += 'embed/'
      }
      return (
        '<div data-wa-spotify="1" data-wa-spotify-id="' + spotifyID + '" data-wa-spotify-type="' + spotifyType + '" contenteditable="false">' +
        '<iframe src="' + spotifyType + ':' + spotifyURL + spotifyID + '"' +
        'width="650" height="380" frameborder="0" allowtransparency="true">' +
        '</iframe>' +
        '</div>'
      );
    } else {
      // console.log('Spotify RAW ATTR', attrs)
      return (
        '<div data-wa-spotify="1" data-wa-spotify-id="' + spotifyID + '" data-wa-spotify-type="spotify" contenteditable="false">' +
        '<iframe src="https://open.spotify.com/embed/' + spotifyID + '"' +
        'width="650" height="380" frameborder="0" allowtransparency="true">' +
        '</iframe>' +
        '</div>'
      )
    }

  }
});

// --KEY::VALUE--
sceditor.formats.bbcode.set('keyval', {
  isInline: false,
  isHtmlInline: false,
  isSelfClosing: true,
  breakAfter: false,
  breakBefore: false,
  breakStart: false,
  breakEnd: false,
  tags: {
    div: {
      'data-wa-keyval': '1'
    }
  },
  format: function (element, content) {
    // var key = $(element).attr('data-wa-keyval-key');
    // var val = $(element).attr('data-wa-keyval-val');
    var key = $(element).find('.phrase-key').get(0).innerHTML;
    var val = $(element).find('.phrase-value').get(0).innerHTML;
    // console.log(key)
    return '--' + key + '::' + val + '--';
  },
  html: function (token, attrs, content) {
    var key = attrs['data-wa-keyval-key'];
    var val = attrs['data-wa-keyval-val'];
    if (key && val) {
      return (
        '<div data-wa-keyval="1" data-wa-keyval-key="' + key + '" data-wa-keyval-val="' + val + '">' +
        '<strong class="phrase-key">' + key + '</strong><br/>' +
        '<span class="phrase-value">' + val + '</span>' +
        '</div>'
      );
    } else {
      return '';
    }

  }
});

// [map:ID]
sceditor.formats.bbcode.set('map', {
  tags: {
    span: {
      'data-wa-map': '1'
    }
  },
  breakBefore: false,
  isSelfClosing: true,
  format: function (element, content) {
    // console.log('element (format)', element)
    var mapID = $(element).attr('data-wa-map-id');
    return '[map:' + mapID + ']'
  },
  html: function (token, attrs, content) {
    // console.log('token (html)', token, attrs);
    // {class} && {style}
    return (
      '<span contenteditable="false" class="noRender" id="map' + attrs['data-wa-map-id'].substring(0, 5) + '" data-wa-map="1" tabindex="0" data-wa-map-id="' + attrs['data-wa-map-id'] + '">' +
      '<span class="tag">' + '[map:' + attrs['data-wa-map-id'] + ']' + '</span>' +
      '</span>'
    );
  }
});

// [history:ID]TITLE[/history]
sceditor.formats.bbcode.set('history', {
  tags: {
    span: {
      'data-wa-history': '1'
    }
  },
  isInline: true,
  isHtmlInline: true,
  format: function (element, content) {
    var eventID = $(element).attr('data-wa-event-id');
    var title = $(element).attr('data-wa-event-title');
    // console.log(content)
    return '[history:' + eventID + ']' + content + '[/history]';

    // return this.toSource(content)
  },
  isInline: true,
  isHtmlInline: true,
  html: function (token, attrs, content) {

    return (
      '<span class="noRender" data-wa-history="1" data-wa-event-id="' + attrs['data-wa-event-id'] + '" data-wa-event-title="' + content + '">' +
      '<span  contenteditable="false" class="tag sceditor-ignore">' + '[history:' + attrs['data-wa-event-id'] + ']' + '</span>' +
      content +
      '<span  contenteditable="false" class="tag sceditor-ignore">' + '[/history]' + '</span>' +
      '</span>&nbsp;'
    );
  }
});

// [category:ID]TITLE[/category]
sceditor.formats.bbcode.set('category', {
  tags: {
    span: {
      'data-wa-category': '1'
    }
  },
  format: function (element, content) {
    var catID = $(element).attr('data-wa-category-id');
    var title = $(element).find('.category-content').get(0).innerHTML;
    return '[category:' + catID + ']' + title + '[/category]';
  },
  html: function (token, attrs, content) {
    return (
      '<span class="noRender" data-wa-category="1" data-wa-category-id="' + attrs['data-wa-category-id'] + '" data-wa-category-title="' + content + '">' +
      '<span class="tag" contenteditable="false">' + '[category:' + attrs['data-wa-category-id'] + ']' + '</span>' +
      '<span class="category-content">' +
      content +
      '</span>' +
      '<span class="tag" contenteditable="false">' + '[/category]' + '</span>' +
      '</span><span>&zwnj;</span>'
    );
  }
});

// [toc:ID]
sceditor.formats.bbcode.set('toc', {
  tags: {
    span: {
      'data-wa-toc': '1'
    }
  },
  isSelfClosing: true,
  format: function (element, content) {
    var tocID = $(element).attr('data-wa-toc-id');
    if (tocID && tocID !== 'undefined') {
      return '[toc:' + tocID + ']';
    } else {
      return '[toc]';
    }

  },
  html: function (token, attrs, content) {
    var tocID = '';
    if (attrs['data-wa-toc-id']) {
      tocID = ":" + attrs['data-wa-toc-id'];
    }
    return (
      '<span contenteditable="false" class="noRender" data-wa-toc="1" data-wa-toc-id="' + attrs['data-wa-toc-id'] + '">' +
      '<span class="tag">' + '[toc' + tocID + ']' + '</span>' +
      '</span>'
    );
  }
});

// [secret:ID]
sceditor.formats.bbcode.set('secret', {
  tags: {
    span: {
      'data-wa-secret': '1'
    }
  },
  isSelfClosing: true,
  format: function (element, content) {
    var secretID = $(element).attr('data-wa-secret-id');
    return '[secret:' + secretID + ']';
  },
  html: function (token, attrs, content) {
    return (
      '<span class="noRender" data-wa-secret="1" data-wa-secret-id="' + attrs['data-wa-secret-id'] + '">' +
      '<span contenteditable="false" class="tag">' + '[secret:' + attrs['data-wa-secret-id'] + ']' + '</span>' +
      '</span>'
    );
  }
});

// [hero:ID]
sceditor.formats.bbcode.set('hero', {
  tags: {
    span: {
      'data-wa-character': '1'
    }
  },
  isInline: true,
  isSelfClosing: true,
  format: function (element, content) {
    var characterID = $(element).attr('data-wa-character-id');
    return '[hero:' + characterID + ']';
  },
  html: function (token, attrs, content) {
    return (
      '<span contenteditable="false" class="noRender" data-wa-character="1" data-wa-character-id="' + attrs['data-wa-character-id'] + '">' +
      '<span class="tag">' + '[hero:' + attrs['data-wa-character-id'] + ']' + '</span>' +
      '</span>'
    );
  }
});

// Custom WA Editor commands
var headers = [
  'H1', 'H2', 'H3', 'H4', 'H5', 'SMALL'
];

// [h1]
sceditor.command.set('h1', {
  txtExec: ['[h1]', '[/h1]'],
  exec: function (caller) {
    insertHeader(this, 'h2');
    // toggleElement(this, 'h2')


  },
  // exec: 'formatBlock',
  // execParam: 'H2',
  state: function () {
    return getCurrentState(this, 'H2');
  },
  tooltip: 'Insert [h1] Header',
  shortcut: 'Ctrl+1'
});

// [h2]
sceditor.command.set('h2', {
  txtExec: ['[h2]', '[/h2]'],
  exec: function (caller) {
    insertHeader(this, 'h3');
    // toggleElement(this, 'h3')

  },
  // exec: 'formatBlock',
  // execParam: 'H3',
  state: function () {
    return getCurrentState(this, 'H3');
  },
  tooltip: 'Insert [h2] Header',
  shortcut: 'Ctrl+2'
});

// [h3]
sceditor.command.set('h3', {
  txtExec: ['[h3]', '[/h3]'],
  exec: function (caller) {
    insertHeader(this, 'h4');
  },
  // exec: 'formatBlock',
  // execParam: 'H4',
  state: function () {
    return getCurrentState(this, 'H4');
  },
  tooltip: 'Insert [h3] Header',
  shortcut: 'Ctrl+3'
});

// [h4]
sceditor.command.set('h4', {
  txtExec: ['[h4]', '[/h4]'],
  exec: function (caller) {
    insertHeader(this, 'h5');
    // // console.log(this)
    // var rangeHelper = this.getRangeHelper();
    // var body = this.getBody();
    // var doc = body.ownerDocument;
    // var parent = rangeHelper.getFirstBlockParent();
    // var selected = rangeHelper.selectedRange();
    // var content = selected.toString();
    // console.log(content)
    // console.log(parent)
    // if(headers.indexOf(parent.nodeName) > -1){
    //   console.log('Remove Formatting')
    //   // console.log(selected)

    //   // if(selected && content.length > 0){
    //     // selected.surroundContents('H5');
    //   // } else {
    //     parent.parentNode.removeChild(parent)
    //     this.execCommand('insertHTML', parent.innerHTML + '<br>')
    //   // }

    // } else {
    //   if(selected && content.length > 0) {
    //     var el = doc.createElement('h5');
    //     selected.surroundContents(el);
    //     selected.collapse(false);
    //   } else {
    //     this.execCommand('formatblock', '<h5>')
    //   }

    // }

    // // insertHeader(this, 'h5')
  },
  state: function () {
    return getCurrentState(this, 'H5');
  },
  tooltip: 'Insert [h4] Header',
  shortcut: 'Ctrl+4'
  // exec: 'formatBlock',
  // execParam: 'H5'
});

// [quote]...(|author)[/quote]
sceditor.command.set('quote', {
  txtExec: ['[quote]', '[/quote]'],
  exec: function (caller) {
    insertQuote(this, 'blockquote')
    // var editor = this,
    //     body = editor.getBody(),
    //     doc = body.ownerDocument,
    //     helper = editor.getRangeHelper(),
    //     selectedContent = helper.selectedRange();

    // var content = helper.selectedHtml()
    // var author = null;
    // if(content.indexOf('|') > -1){

    //   author = content.substring(content.lastIndexOf('|') + 1);
    //   content = content.substring(0, content.lastIndexOf('|'));
    //   // console.log('CONTENT', content);
    //   // console.log('AUTHOR', author)
    // }

    // var el = doc.createElement('blockquote');
    // el.innerHTML = content;

    // if(author) {
    //   var authorEl = doc.createElement('div');
    //   authorEl.className = 'author';
    //   authorEl.innerHTML = author;
    //   el.append(authorEl);
    // }

    // selectedContent.deleteContents();
    // selectedContent.insertNode(el);
    // selectedContent.collapse(false)
  },
  state: function () {
    return getCurrentState(this, 'BLOCKQUOTE')
  },
  tooltip: 'Insert [quote]'
});

// [dc]
sceditor.command.set('dc', {
  txtExec: ['[dc]', '[/dc]'],
  exec: function (caller) {
    var editor = this,
      body = editor.getBody(),
      doc = body.ownerDocument,
      helper = editor.getRangeHelper(),
      selectedContent = helper.selectedRange(),
      originalSelection = helper.cloneSelected(),
      el = doc.createElement('span');
    //Prepare the element
    el.className = 'dropcap';
    el.setAttribute('data-wa-dropcap', '1');

    selectedContent.setEnd(selectedContent.startContainer, selectedContent.startOffset + 1);
    var char = selectedContent.toString();
    el.textContent = char;

    helper.insertNode(el);
    helper.selectRange(originalSelection);
    originalSelection.collapse(false);

  },
  tooltip: 'Insert [dc] Dropcap'
});

sceditor.command.set('small', {
  txtExec: ['[small]', '[/small]'],
  exec: function (caller) {
    // console.log('Small')
    insertSmall(this, 'small');
    // var editor = this,
    //     body = editor.getBody(),
    //     doc = body.ownerDocument,
    //     win = doc.defaultView,
    //     helper = editor.getRangeHelper(),
    //     selectedContent = helper.selectedRange();

    //     el = doc.createElement('small');
    //     selectedContent.surroundContents(el);
    //     selectedContent.collapse(false);
    // console.log(selectedContent)
    // el.setAttribute('data-editor-smalltext', '1');
    // console.log(selectedContent.commonAncestorContainer.nodeName)
    // var parent = selectedContent.commonAncestorContainer.parentNode;
    // if(selectedContent.toString().length === 0) {
    //   console.log('exiting')
    //   return;
    // }
    // if(parent.nodeName === 'BODY' || parent.nodeName === 'HTML') {
    //   console.log(parent.nodeName)
    //   console.log('exiting')
    //   return;
    // }
    // //Only add element if parent is not <small>
    // if(parent.nodeName !== 'SMALL') {
    // // if(parent.nodeName !== 'SMALL' && parent.parentNode.nodeName !== 'SMALL' ) {
    //   console.log('container is not <small>')
    //   try {
    //     selectedContent.surroundContents(el);
    //   } catch(e) {
    //     console.log(e)
    //   }

    //   selectedContent.collapse(false);
    // } else {
    //   console.log(parent.nodeName)
    //   var contents = selectedContent.toString();

    //   // console.log('NODE', node.parentNode);
    //   var selection = win.getSelection();
    //   if (selection.rangeCount) {
    //     var range = selection.getRangeAt(0);
    //     // console.log(range.commonAncestorContainer.parentNode.nodeName)
    //     parent = range.commonAncestorContainer.parentNode.parentNode
    //     range.selectNode(range.commonAncestorContainer.parentNode)
    //     range.deleteContents();
    //     range.insertNode(document.createTextNode(contents))
    //     range.collapse(false)
    //   }
    //   // selectedContent.deleteContents();

    //   // selectedContent.insertNode(doc.createTextNode(contents));
    // }

    // setCaretEndofRange(editor, parent)
  },
  tooltip: 'Insert [small]'
})

// [p]
sceditor.command.set('p', {
  txtExec: ['[p]', '[/p]'],
  exec: function (caller) {
    insertHeader(this, 'P')

  },
  tooltip: 'Insert Paragraph',
  state: function () {
    return getCurrentState(this, 'P');
  },
  shortcut: 'Ctrl+P'
});

// [br]
sceditor.command.set('br', {
  exec: function (caller) {
    var editor = this,
      body = editor.getBody(),
      doc = body.ownerDocument,
      rangeHelper = editor.getRangeHelper(),
      selected = rangeHelper.selectedRange(),
      html = '<span class="tag" contenteditable="false" data-wa-custom-br="1">[br]</span><span>&zwnj;</span>';
    var el = doc.createElement('div');
    el.innerHTML = html;
    el = el.firstChild;
    selected.insertNode(el);
    selected.collapse(false);

    // editor.wysiwygEditorInsertHtml(html)
  },
  shortcut: 'Shift+Enter',
  tooltip: 'Insert a linebreak'
})
// [aloud]
sceditor.command.set('aloud', {
  exec: function (caller) {
    insertAloud(this, 'div')
  },
  txtExec: ['[aloud]', '[/aloud]'],
  tooltip: 'Insert Aloud'
})
//Helper Functions

// Toggle Secodary Toolbar
sceditor.command.set('toggleToolbar', {
  txtExec: function (caller) {
    var container = caller.parentNode.parentNode.parentNode
    var isVisible = $(container).find('.secondary-toolbar').hasClass('show');
    if (isVisible) {
      $(container).find('.secondary-toolbar').removeClass('show');
      $(container).find('.secondary-toolbar').slideUp()
    } else {
      $(container).find('.secondary-toolbar').addClass('show');
      $(container).find('.secondary-toolbar').slideDown()
    }
  },
  exec: function (caller) {
    var container = caller.parentNode.parentNode.parentNode
    var isVisible = $(container).find('.secondary-toolbar').hasClass('show');
    if (isVisible) {
      $(container).find('.secondary-toolbar').removeClass('show');
      $(container).find('.secondary-toolbar').slideUp()
    } else {
      $(container).find('.secondary-toolbar').addClass('show');
      $(container).find('.secondary-toolbar').slideDown()
    }
  },
  tooltip: 'Additional Options'
})
// Random String
function makeid(length = 5) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function toggleElement(instance, tag) {
  var editor = instance,
    body = editor.getBody(),
    doc = body.ownerDocument,
    // tag = 'h2',
    helper = editor.getRangeHelper(),
    range = helper.selectedRange(),
    content = helper.selectedHtml();
  var rangeParent = range.commonAncestorContainer.parentElement;

  var replaceHeader = headers.indexOf(rangeParent.nodeName) > -1
  if (rangeParent.nodeName === tag.toUpperCase() || replaceHeader) {
    // console.log('Need to undo the element');
    // var parent = range.commonAncestorContainer.parentElement.parentElement
    // console.log('Parent\'s Parent',parent)
    var parent = range.commonAncestorContainer.parentElement;
    var el = doc.createElement((replaceHeader ? tag : 'div')); //replace with textNode
    // var el = doc.createTextNode(content)
    el.innerHTML = content;
    var container = range.commonAncestorContainer
    if (parent.outerHTML) {
      // console.log(parent, el)
      var block = parent.parentNode
      if (block.nodeName !== 'BODY') {
        if (parent.nodeName === tag.toUpperCase()) {
          parent.outerHTML = el.innerHTML
        } else {
          parent.outerHTML = el.outerHTML//$(el).html().toString()
        }

      } else {
        // console.log('BLOCK is BODY')
        // console.log(parent, content)
        range.deleteContents();
        range.setStartAfter(parent)
        range.insertNode(el)
        range.collapse(false)
      }

      // console.log(parent.outerHTML)
      // var sel = doc;
      var sel = doc.createRange();
      var length = el.outerHTML.length
      var newEl = $(body).find(el)
      // console.log(newEl)
      setTimeout(function () {
        sel.selectNode() //TODO: Need to find a way to retarget node so we can place the cursor after it.
        sel.collapse(false)
        // console.log(sel)
      }, 300)

    } else {
      console.log('Outer HTML not supported')
      // var tmpObj = doc.createElement('span')
      // tmpObj.innerHTML = '<!--REPLACE-->';
      // parent.replaceChild(tmpObj, container);

      // parent.innerHTML = parent.innerHTML.replace('<span><!--REPLACE--></span>', el)
    }
  } else {
    var el = doc.createElement(tag);
    el.innerHTML = content;
    console.warn(range.commonAncestorContainer)
    range.deleteContents();
    range.insertNode(el);
    range.collapse(false)
  }
}

function insertHeader(instance, tag) {
  var rangeHelper = instance.getRangeHelper();
  var body = instance.getBody();
  var doc = body.ownerDocument;
  var parent = rangeHelper.getFirstBlockParent();
  var selected = rangeHelper.selectedRange();
  var content = selected.toString();

  // console.log(content);
  // console.log(parent);
  // console.log(selected);
  //h vs h1 when checking
  if (headers.indexOf(parent.nodeName) > -1) {
    // console.log('Remove Header Tags');

    parent.parentNode.removeChild(parent);
    instance.execCommand('insertHTML', parent.innerHTML + '<br/>');
  } else {
    if (selected && content.length > 0) {
      var el = doc.createElement(tag);
      el.setAttribute('data-wa-element-' + tag, '1');
      selected.surroundContents(el);
      selected.collapse(false);
    } else {
      // console.log('Selected', selected)
      var el = doc.createElement(tag);
      el.setAttribute('data-wa-element-' + tag, '1');
      selected.selectNodeContents(selected.commonAncestorContainer);
      selected.surroundContents(el);
      selected.collapse(false);
      // instance.execCommand('formatblock', '<' + tag + '>');
      // instance.execCommand('insertHTML', '<' + tag + '>')
    }
  }
}

function insertSmall(instance, tag) {
  var rangeHelper = instance.getRangeHelper();
  var body = instance.getBody();
  var doc = body.ownerDocument;
  var parent = rangeHelper.parentNode();
  var selected = rangeHelper.selectedRange();
  var content = selected.toString();

  // console.log('Parent Node',parent.parentNode.nodeName);
  if (parent.nodeName === 'SMALL' || parent.parentNode.nodeName === 'SMALL') {
    // console.log('Remove [small]');
    var smallEl;
    if (parent.nodeName === 'SMALL') {
      smallEl = parent;
    } else if (parent.parentNode.nodeName === 'SMALL') {
      smallEl = parent.parentNode;
    }
    // console.log('Content', smallEl)
    var html = smallEl.innerHTML;
    smallEl.parentNode.removeChild(smallEl);
    instance.execCommand('insertHTML', html);
  } else {
    // console.log('Adding [small]');
    if (selected && content.length > 0) {
      var el = doc.createElement(tag);
      selected.surroundContents(el);
      selected.collapse(false);
    } else {
      instance.execCommand('formatblock', '<' + tag + '>');
    }
  }
}

function insertAloud(instance, tag) {
  var rangeHelper = instance.getRangeHelper();
  var body = instance.getBody();
  var doc = body.ownerDocument;
  var parent = rangeHelper.parentNode();
  var $parent = parent.parentNode;
  var selected = rangeHelper.selectedRange();
  var content = rangeHelper.selectedHtml();

  var aloudNode = $(parent).closest('[data-wa-aloud="1"]').get(0);
  // console.log(aloudNode, selected)
  //If there is a parentNode that is 'aloud', remove it's styling
  if (aloudNode) {
    var div = doc.createElement('div');
    div.innerHTML = aloudNode.innerHTML;
    aloudNode.remove();
    // selected.deleteContents();
    selected.insertNode(div);
    // $(aloudNode).removeClass('aloud');
    // $(aloudNode).removeAttr('[data-wa-aloud]');
    selected.collapse(false);
  } else {
    var aloud = doc.createElement('div');
    aloud.setAttribute('data-wa-aloud', '1');
    aloud.classList.add('aloud');
    aloud.innerHTML = content;
    selected.deleteContents();
    selected.insertNode(aloud);
    selected.collapse(false);
  }


}

function insertQuote(instance, tag) {
  var rangeHelper = instance.getRangeHelper();
  var body = instance.getBody();
  var doc = body.ownerDocument;
  var parent = rangeHelper.parentNode();
  var $parent = parent.parentNode;
  var selected = rangeHelper.selectedRange();
  var content = rangeHelper.selectedHtml();
  var author = null;
  var isOList = false;
  var isUList = false;
  // console.log('[QUOTE] invoked.');
  if (parent.nodeName === 'BLOCKQUOTE' || $parent.nodeName === 'BLOCKQUOTE') {
    // console.log('Remove Quote');
  } else {
    if (content.indexOf('|') > '-1') {
      var authorName = content.substring(content.lastIndexOf('|') + 1);
      console.log('AUTHORNAME', authorName)
      if (authorName !== '|tab') {
        console.log('addquote')
        author = doc.createElement('div');
        author.className = 'author';
        author.innerHTML = content.substring(content.lastIndexOf('|') + 1);
        content = content.substring(0, content.lastIndexOf('|'));
      }

    }

    var quote = doc.createElement('blockquote');


    if (parent.nodeName === 'OL' || $parent.nodeName === 'OL') {
      isOList = true;
    } else if (parent.nodeName === 'UL' || $parent.nodeName === 'UL') {
      isUList = true;
    }

    if (isOList) {
      quote.innerHTML = '<ol>' + content + '</ol>';
      selected.selectNode(parent);
    } else if (isUList) {
      quote.innerHTML = '<ul>' + content + '</ul>';
      selected.selectNode(parent);
    } else {
      quote.innerHTML = content;
    }

    if (author) {
      quote.append(author)
    }
    // console.log('Content for <quote>: ', quote.innerHTML)
    selected.deleteContents();
    selected.insertNode(quote);
    selected.collapse(false)
    // var content;
    // console.log('Adding Quote');
    // if(parent.nodeName === '#text') {
    //   console.log('Text only');
    //   // content = parent.textContent;
    // } else {
    //   // content = parent.innerHTML
    // }
    // console.log('Content: ',content);
    // if(parent.nodeName !== 'UL'){
    //   // instance.execCommand('formatblock', 'blockquote');
    // }


  }
  //First, check string if |author is defined
}

function setCaretEndofRange(instance, node) {
  // console.log('setCaret Node', node)
  var body = instance.getBody();
  var helper = instance.getRangeHelper();
  var doc = body.ownerDocument;

  var iframes = $('iframe');
  var frame = null;
  for (var i = 0; i < iframes.length; i++) {
    if (doc === iframes[i].contentDocument) {
      frame = iframes[i];
    }
  }
  if (frame) {
    var nextSiblings = $(node).nextAll()
    // console.log('Sibling', nextSiblings)
    if (nextSiblings && nextSiblings.length > 0) {
      var range = doc.createRange()
      var sel = frame.contentWindow.getSelection();
      for (var i = 0; i < nextSiblings.length; i++) {
        if (nextSiblings[i].nodeName !== 'BR') {
          // console.log('Next sibling is NOT a br')
          range.selectNodeContents(nextSiblings[i]);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range)
          return;
        } else {
          //Only Remove the linebreak if it's not a user-supplied one
          if (!$(nextSiblings[i]).attr('data-wa-custom-br')) {
            $(nextSiblings[i]).remove()
          }

        }
      }
      $(node).append('<span id="next"></span>')
      var mrk = $('<span id="next"></span>')[0]
      range.selectNodeContents(mrk);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range)
    }

    // var tempID = makeid();
    // // var div = `<div class="tempMarker" id="${tempID}">\u00a0</div>`;
    // var div = doc.createElement('span');
    // div.innerHTML = '\u00a0';
    // div.id = tempID;
    // div.className = 'tempMarker';
    // $(div).insertAfter($(node));
    // // helper.insertNodeAt(false, div)
    // var elem = doc.getElementById(tempID);
    // if(elem === null) {
    //   var range = doc.createRange();
    //   var sel = frame.contentWindow.getSelection();
    //   console.log('NODE',node, 'SEL', sel)
    //   range.selectNodeContents(sel.anchorNode)
    //   range.collapse(false)
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    // } else {
    //   console.log('here')
    //   var range = doc.createRange();
    //   // console.log(node.childNodes[0],range)
    //   var sel = frame.contentWindow.getSelection();

    //   range.selectNodeContents(elem);
    //   // range.selectNodeContents(node);
    //   range.collapse(false)
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    //   doc.execCommand('delete', false, null);
    // }   
  }

}

function getCurrentState(instance, cmd) {
  var helper = instance.getRangeHelper();
  var node = helper.getFirstBlockParent();
  if (node && node.nodeName === cmd) {
    return 1;
  } else {
    return 0;
  }
}