/**
* @name WAEditor
* @author Sam Clarke (Initial Framework), Xuroth (Stephan Franz - modified for WorldAnvil) 
* @version 0.8.5
*/

$().ready(function () {
    //Add FA to head
    var FAlight = 'https://pro.fontawesome.com/releases/v5.10.2/css/light.css';
    var FAbrands = 'https://pro.fontawesome.com/releases/v5.10.2/css/brands.css';
    var FAbase = 'https://pro.fontawesome.com/releases/v5.10.2/css/fontawesome.css';

    // $('head').append($('<link />', {
    //     rel: 'stylesheet',
    //     type: 'text/css',
    //     href: FAlight
    // }))
    // $('head').append($('<link />', {
    //     rel: 'stylesheet',
    //     type: 'text/css',
    //     href: FAbrands
    // }))
    // $('head').append($('<link />', {
    //     rel: 'stylesheet',
    //     type: 'text/css',
    //     href: FAbase
    // }))
    $('head').append($('<script />', {
        src: 'https://kit.fontawesome.com/cae7a706b8.js',
        crossorigin: 'anonymous'
    }))
    var editorContentTheme = 'editor-content.css';
    var editorTheme = null;
    if (paneltheme) {
        if (paneltheme === 'dark') {
            editorContentTheme = 'editor-content-dark.css';
            editorTheme = 'editor-dark.css';
        } else if (paneltheme === 'darkest') {
            editorContentTheme = 'editor-content-darkest.css';
            editorTheme = 'editor-darkest.css';
        } else if (paneltheme === 'light') {
            editorContentTheme = 'editor-content-light.css';
            editorTheme = 'editor-light.css';
        } else if (paneltheme === 'marianna') {
            editorTheme = 'editor-marianna.css';
            editorContentThem = "editor-content-marianna.css";
        }
    }

    if (editorTheme) {
        $('#page-wrapper').append($('<link />', {
            rel: 'stylesheet',
            type: 'text/css',
            href: '/modules/wysiwyg/css/' + editorTheme
        }))
    }


    //Implement and bind SCEditor to applicable textarea inputs
    var editorFields = $('textarea.mention');

    //Attach each editor to a specific element
    editorFields.each(function (fieldIndex) {

        var field = editorFields[fieldIndex];
        let editorHeight = calculateHeight(field)
        // Create the instance of the editor
        sceditor.create(field, {
            // Load the custom suggestion plugin
            plugins: 'scsuggest,imageloader,plaintext',
            pastetext: {
                enabled: true
            },
            format: 'bbcode',
            style: '/modules/wysiwyg/css/' + editorContentTheme,
            emoticonsEnabled: false,
            startInSourceMode: (defaultEditorMode && defaultEditorMode === 'source' ? true : false),
            toolbar:
                'bold,italic,underline,link,color,left,center,right,justify,h1,h2,h3,image,table,br,p,bulletlist,orderedlist,quote,toggleToolbar,source,maximize', //removeformat
            secondaryToolbar: 'subscript,superscript,strike,h4,horizontalrule,small,dc,keyval,aloud,youtube,spotify,soundcloud',
            height: editorHeight,
            resizeMinWidth: '200',
            resizeMinHeight: '200',
            resizeMaxWidth: '-1',
            resizeMaxHeight: '-1',
            autoUpdate: true,
            enablePasteFiltering: false,
            autoSaveDelay: 500,
            parserOptions: {
                fixInvalidNesting: false,
                fixInvalidChildren: false,
                breakAfterBlock: false,
                breakBeforeBlock: false,
                breakStartBlock: false,
                breakEndBlock: false
            },
            spellcheck: false,
            bbcodeTrim: false,
        });
    });

    function calculateHeight(field) {
        let rowCount = parseInt(field.getAttribute('rows'), 10) || 3;
        let lineHeight = getComputedStyle(field).lineHeight;
        let multiplier = 3;
        lineHeight = lineHeight.replace(/[^-\d.]/g, '');
        let result = rowCount * lineHeight * multiplier;
        // console.log("Rows: " + rowCount, "Lineheight: " + lineHeight + 'px', "Multiplier: " + multiplier);
        // console.log("Height: ", result + 'px');
        return result;
    }

    $('[data-toggle="tooltip"]').tooltip();
});