function onSelectVersion() {
    var version = $(this).val();
    var parts = window.location.pathname.split('/');
    parts[2] = version;
    window.location.href = parts.join('/');
}

$(document).ready(function() {
    var search_state = {
        page: 1,
        per_page: 4
    };

    var search_api_key = 'DK24AQCCw86SEb5kL30gE21UaVWLnBMd';

    $("#goodreads-search input").select();
    $("#goodreads-search input").focus();

    function getResults(q, callback) {
        var url = "https://b7tx4w2zpfvluej3.a1.typesense.net/collections/books/documents/search?q="+ q +
            "&prefix=true&query_by=title&sort_by=ratings_count:DESC&page="+search_state.page+"&per_page=" +
            search_state.per_page + "&num_typos=2";

        $.ajax({
            url: url,
            headers: { 'x-typesense-api-key': search_api_key },
            success: function(data){
                callback(q, data);
            }
        });
    }

    function onResults(q, data) {
        if(data.found == 0) {
            $('#goodreads-found').html("No results found.");
            $('#goodreads-results').html('');
            $('#goodreads-results-nav a').addClass('disabled');
            return ;
        }

        var total_pages = Math.ceil(Math.min(data.found, 100) / search_state.per_page);
        search_state.total_pages = total_pages;
        search_state.q = q;

        // check for stale/out-of-order response
        if(search_state.page != data.page) {
            return ;
        }

        if(data.page > total_pages) {
            $('#goodreads-results-nav a#next-page').addClass('disabled');
            return ;
        }

        var found_text = data.found + (data.found > 1 ? " results." : " result.");
        found_text += " Page " + search_state.page + " of " + total_pages + ".";
        $('#goodreads-found').html(found_text);

        var lis = '';
        for(var i = 0; i < data.hits.length; i++) {
            var title = data.hits[i].title;
            var doc = data.hits[i].document;

            if(data.hits[i].highlights.length == 0) {
                continue;
            }

            var raw_text_length = data.hits[i].highlights[0].snippet.replace(/mark/g, '').length;
            var truncated_title = raw_text_length > 50 ?
                data.hits[i].highlights[0].snippet.substring(0, 50) + '...' : data.hits[i].highlights[0].snippet;

            lis += '<li><img src="' + doc.image_url + '" alt="' + doc.title +
                   '" />' + truncated_title + '</li>';
        }

        if(search_state.page > 1) {
            $('#goodreads-results-nav a#prev-page').removeClass('disabled');
        } else {
            $('#goodreads-results-nav a#prev-page').addClass('disabled');
        }

        if(total_pages != search_state.page) {
            $('#goodreads-results-nav a#next-page').removeClass('disabled');
        } else {
            $('#goodreads-results-nav a#next-page').addClass('disabled');
        }

        $('#goodreads-results').html(lis);
    }


    $("#goodreads-search input").on('input', function() {
        search_state.page = 1;
        getResults($(this).val(), onResults);
    });

    $(document).on("click", "#goodreads-results-nav a#next-page", function() {
        if($(this).hasClass('disabled')) {
            return false;
        }

        if(search_state.q == $('#goodreads-search input').val() && search_state.page >= search_state.total_pages) {
            return false;
        }

        search_state.page += 1;
        getResults($('#goodreads-search input').val(), onResults);
        return false;
    });

    $(document).on("click", "#goodreads-results-nav a#prev-page", function() {
        if($(this).hasClass('disabled')) {
            return false;
        }

        if(search_state.page == 1) {
            return false;
        }

        search_state.page -= 1;
        getResults($('#goodreads-search input').val(), onResults);
        return false;
    });

    $(document).on("change", "#doc-version select", onSelectVersion)

    getResults($('#goodreads-search input').val(), onResults);

    $('a.collapsed').on('click', function() {
        $(this).next().toggle();
        return true;
    })
});
