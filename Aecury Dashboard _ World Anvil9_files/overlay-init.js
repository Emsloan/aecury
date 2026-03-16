
// $(document).bind('keydown', function(e) {
//     if(e.keyCode === 13 ) {
//         if(e.altKey) {
//             $('#overlay').toggle();
//             if ( $('#widget-previewer-search').val().length == 0  ) {
//                 $('#widget-previewer-search').focus();
//             }
//             e.preventDefault();
//             return false;
//         }
//         else {

//         }
//     }
// });

$(document).on('click', '#overlay-summon', function( event ){
    event.preventDefault(); // avoid to execute the actual submit of the form.
    $('#overlay').toggle();
    if ( $('#widget-previewer-search').val().length == 0  ) {
        $('#widget-previewer-search').focus();
        event.preventDefault();
        return false;
    }
});

$( function() {
    $( ".overlay-widget" ).draggable().resizable({animate: true});
} );

$( document ).ready(function() {
    $('#widget-previewer-search').keyup(
        delay(function (e) {
            thatcontext = $( e.target );
            that = this;
            console.log('previewer is searching for term: ' + that.value );
            if ( that.value.length >= 3 ) {
                loadContent( '#widget-previewer-content', thatcontext.attr('data-url') + '?term=' + that.value +'&type=quick'  );
            }
        }, 350)
    );

    $(document).on('click', '.previewer-article-view', function( event ){
        that = $( this );
        event.preventDefault();
        $.ajax({
            url: that.attr('href') + '?display=previewer&json=true&fetchChildren=true',
            type: "GET",
            dataType: "json",
            async: true,
            success: function (data)
            {
                $('#widget-previewer-content').html( '<div class="ibox"><div class="ibox-content">'+data.data+'</div></div>');
                binddiceroller();
                bindTrackable();
                $('#widget-previewer-search').val('');
                return true;
            }
        });
    });

    $(document).on('click', '.previewer-article-edit', function( event ){
        that = $( this );
        event.preventDefault();
        $.ajax({
            url: that.attr('href'),
            type: "GET",
            dataType: "json",
            async: true,
            success: function (data)
            {
                $('#widget-previewer-content').html( '<div class="ibox"><div class="ibox-content">'+data.contents+'</div></div>');
                $('#widget-previewer-search').val('');
                bindmention();

                $('.previewer-edit-field').keyup(
                    delay(function (e) {
                        thatcontext = $( e.target );
                        that = this;
                        console.log('Saving previewer article edit contents to ' + previewerSaveLocation );

                        $.ajax({
                            url: previewerSaveLocation,
                            type: "POSt",
                            dataType: "json",
                            data: {
                                title: $('#previewer-article-edit-title').val(),
                                content:   $('#previewer-article-edit-content').val(),
                                seeded: $('#previewer-article-edit-seeded').val(),
                            },
                            async: true
                        });

                    }, 350)
                );



                return true;
            }
        });
    });




    $(document).on('click', '.previewer-block-listitem, .previewer-history-listitem', function( event ){
        that = $( this );
        event.preventDefault();
        $.ajax({
            url: that.attr('data-url'),
            type: "GET",
            dataType: "json",
            async: true,
            success: function (data)
            {
                $('#widget-previewer-content').html( data.contents );
                binddiceroller();
                bindTrackable();
                $('#widget-previewer-search').val('');
                return true;
            }
        });
    });
});