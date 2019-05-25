$(document).ready(function() {
    var search_state = {
        page: 1,
        per_page: 4
    };

    var search_api_key = 'YhdsuG$Gs72NSNyegdbsa^hTh';

    $("#movies-search input").select();
    $("#movies-search input").focus();

    function getResults(q, callback) {
        var url = "https://t1m.typesense.org/collections/movies/documents/search?q="+ q +
            "&prefix=true&query_by=movie_title&page="+search_state.page+"&per_page=" +
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
            $('#movies-found').html("No results found.");
            $('#movies-results').html('');
            $('#movies-results-nav a').addClass('disabled');
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
            $('#movies-results-nav a#next-page').addClass('disabled');
            return ;
        }

        var found_text = data.found + (data.found > 1 ? " results." : " result.");
        found_text += " Page " + search_state.page + " of " + total_pages + ".";
        $('#movies-found').html(found_text);

        var lis = '';
        for(var i = 0; i < data.hits.length; i++) {
            var title = data.hits[i].movie_title;
            var doc = data.hits[i].document;

            if(data.hits[i].highlights.length == 0) {
                continue;
            }

            var raw_text_length = data.hits[i].highlights[0].snippet.replace(/mark/g, '').length;
            var truncated_title = raw_text_length > 200 ?
                data.hits[i].highlights[0].snippet.substring(0, 200) + '...' : data.hits[i].highlights[0].snippet;

            lis += '<li>' + truncated_title + '</li>';
        }

        if(search_state.page > 1) {
            $('#movies-results-nav a#prev-page').removeClass('disabled');
        } else {
            $('#movies-results-nav a#prev-page').addClass('disabled');
        }

        if(total_pages != search_state.page) {
            $('#movies-results-nav a#next-page').removeClass('disabled');
        } else {
            $('#movies-results-nav a#next-page').addClass('disabled');
        }

        $('#movies-results').html(lis);
    }


    $("#movies-search input").on('input', function() {
        search_state.page = 1;
        getResults($(this).val(), onResults);
    });

    $(document).on("click", "#movies-results-nav a#next-page", function() {
        if($(this).hasClass('disabled')) {
            return false;
        }

        if(search_state.q == $('#movies-search input').val() && search_state.page >= search_state.total_pages) {
            return false;
        }

        search_state.page += 1;
        getResults($('#movies-search input').val(), onResults);
        return false;
    });

    $(document).on("click", "#movies-results-nav a#prev-page", function() {
        if($(this).hasClass('disabled')) {
            return false;
        }

        if(search_state.page == 1) {
            return false;
        }

        search_state.page -= 1;
        getResults($('#movies-search input').val(), onResults);
        return false;
    });

    getResults($('#movies-search input').val(), onResults);
});