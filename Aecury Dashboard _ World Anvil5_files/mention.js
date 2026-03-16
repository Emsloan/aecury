// Implementation of the bootstra-suggest and the BBcode Bar
function bindmention() {
    console.log('binding mention system');  

    if ( editor == 'wysiwyg' ) {
        console.log('The Mention class is being loaded on WYSIWYG (Old)');
    } else if ( editor == 'legacy' ) {
        console.log('The Mention class is being loaded on Legacy');
    } else if ( editor == 'code' ) {
        console.log('The Mention class is being loaded on Code');
    } else if ( editor == 'plutarch' ) {
        console.log('The Mention class is being loaded on Plutarch');
    }

    var loadClass = '.mention';

    $( loadClass ).suggest('@', {
        data: function(q, provide) {
            if (q) {
                return $.getJSON("/api/article/bbcode.json", { q: q });
            }
        },
        filter: {
            casesensitive: false,
            limit: 15
        },
        map: function(article) {
            console.log( 'article:' + article );
            return {
                value: article.bbcode,
                text: '<span>'+article.title+'</span>'
            }
        }
    });

    $( loadClass ).suggest('[', {
        data: function(q, provide) {
            if (q) {
                return $.getJSON("/api/mention/bbcode.json", { q: q });
            }
        },
        filter: {
            casesensitive: false,
            limit: 15
        },
        map: function(article) {
            console.log( 'article:' + article );
            return {
                value: article.bbcode,
                text: '<span>'+article.title+'</span>'
            }
        }
    });

    if ( editor == 'legacy' ) 
    {
        $( loadClass ).before('<div class="mention-buttons text-left"> \
            <button title="Bold" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[b]" data-after="[/b]">B</button> \
            <button title="Italics" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[i]" data-after="[/i]">I</button> \
            <button title="Underline" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[u]" data-after="[/u]">U</button> \
            <button title="Main Header" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[h1]" data-after="[/h1]">H1</button> \
            <button title="Secondary Header" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[h2]" data-after="[/h2]">H2</button> \
            <button title="Tertiary Header" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[h3]" data-after="[/h3]">H3</button> \
            <button title="Paragraph" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[p]" data-after="[/p]">P</button> \
            <button title="Subtext" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[sub]" data-after="[/sub]">x<sub>y</sub></button> \
            <button title="Supertext" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[sup]" data-after="[/sup]">x<sup>y</sup></button> \
            <button title="Small" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[small]" data-after="[/small]">sm</button> \
            <button title="Breakline" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[br]" data-after="">BR</button> \
            <button title="Horizontal line" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[hr]" data-after="">HR</button> \
            <button title="Quote" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[quote]" data-after="[/quote]"><i class="fa fa-quote-right" aria-hidden="true"></i></button> \
            <button title="Left aligned Paragraph" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[left]" data-after="[/left]"><i class="fa fa-align-left" aria-hidden="true"></i></button> \
            <button title="Right Aligned Paragraph" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[right]" data-after="[/right]"><i class="fa fa-align-right" aria-hidden="true"></i></button> \
            <button title="Centered Paragraph" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[center]" data-after="[/center]"><i class="fa fa-align-center" aria-hidden="true"></i></button> \
            <button title="Justified Paragraph" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[justify]" data-after="[/justify]"><i class="fa fa-align-justify" aria-hidden="true"></i></button> \
            <button title="Unordered List" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[ul][li]" data-after="[/li][/ul]"><i class="fa fa-list-ul" aria-hidden="true"></i></button> \
            <button title="Ordered List" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[ol][li]" data-after="[/li][/ol]"><i class="fa fa-list-ol" aria-hidden="true"></i></button> \
            <button title="URL Link" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[url:]" data-after="[/url]"><i class="far fa-link" aria-hidden="true"></i></button> \
            <button title="Image" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[img:" data-after="]"><i class="far fa-image" aria-hidden="true"></i></button> \
            <button title="Spotify URL Embed" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[spotify:" data-after="]"><i class="fab fa-spotify" aria-hidden="true"></i></button> \
            <button title="Youtube URL Embed" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[youtube:" data-after="]"><i class="fab fa-youtube" aria-hidden="true"></i></button> \
            <button title="Spoiler" type="button" class="btn btn-default btn-xs mention-control tooltipster" data-before="[spoiler]" data-after="[/spoiler]"><i class="fa fa-eye-slash" aria-hidden="true"></i></button> \
            <button type="button" title="Insert comments only visible from the editor." class="btn btn-default btn-xs mention-control tooltipster" data-before="/*" data-after="*/"><i class="far fa-lock" aria-hidden="true"></i></button> \
            <span class="btn btn-info btn-xs tooltipster"  title="Use Ctrl+b for bold, Ctrl+u for Underline, Ctrl+i for Italics, Ctrl+p for Paragraph, Ctrl+s for Strikethrough, Ctrl+Shift+1 or 2 or 3 for headers!, Ctrl+Shift+Up Arrow for [sup] and Ctrl+Shift+Down Arrow for [sub]"><i class="fas fa-info-circle"></i>\
        ');

        $( loadClass ).on( "focus", function() {
            $(this).parent().find(".mention-buttons").show();
        });
    }
}



function wrapText(elementID, openTag, closeTag) {
    var textArea = document.getElementById(elementID);

    if (typeof(textArea.selectionStart) != "undefined") {
        var position = textArea.selectionStart + openTag.length;
        var begin = textArea.value.substr(0, textArea.selectionStart);
        var selection = textArea.value.substr(textArea.selectionStart, textArea.selectionEnd - textArea.selectionStart);
        var end = textArea.value.substr(textArea.selectionEnd);
        textArea.value = begin + openTag + selection + closeTag + end;

        textArea.focus();
        textArea.selectionEnd = position;
        var scrollHeight = textArea.scrollHeight;
        var lineHeight = 18;
        var numberOfLines = scrollHeight / lineHeight;
        var charactersInLine = textArea.value.length / numberOfLines; // amount of chars for each line
        var height = Math.floor(position / charactersInLine ); 
        var positionHeight = ( height * lineHeight ) - 50;
        $( '#'+elementID ).scrollTop( positionHeight );
    }
}


$(document).ready(function() {

    $(document).on('click', 'button.mention-control', function( e ){
        e.preventDefault();
        wrapText( $(this).parent().siblings('.mention').attr('id') , $(this).attr('data-before'), $(this).attr('data-after') );
    });

    $(document).on( "keydown",  keyPressed);

    function keyPressed (e){
        e = e || window.e;
        var newchar = e.which || e.keyCode;
    }

    $(window).bind('keydown', function(event) {    
        if( $("input,textarea").is(":focus") ) {

            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 'b':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[b]', '[/b]' );
                        break;
                    case 'u':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[u]', '[/u]' );
                        break;
                    case 'i':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[i]', '[/i]' );
                        break;
                    case 'p':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[p]', '[/p]' );
                        break;
                    case 's':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[strike]', '[/strike]' );
                        break;
                }
            }
            if (event.ctrlKey && event.shiftKey || event.metaKey && event.shiftKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case '1':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[h]', '[/h]' );
                        break;
                    case '2':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[h2]', '[/h2]' );
                        break;
                    case '3':
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[h3]', '[/h3]' );
                        break;
                }
            }
            if (event.ctrlKey && event.shiftKey || event.metaKey && event.shiftKey) {
                switch ( event.keyCode ) {
                    case 38:
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[sup]', '[/sup]' );
                        break;
                    case 40:
                        event.preventDefault();
                        wrapText( $(document.activeElement).attr('id') , '[sub]', '[/sub]' );
                        break;
                }
            }
        }
    });

    bindmention();
    bindtooltipster();

});
