$(document).ready(function() {
    var search_state = {
        page: 1,
        per_page: 4
    }

    var search_api_key = '123';

    function getResults(q, callback) {
        var url = "http://localhost:8108/collections/goodreads_10k/documents/search?q="+ q +
            "&prefix=true&query_by=original_title&sort_by=ratings_count:DESC&page="+search_state.page+"&per_page=" +
            search_state.per_page + "&num_typos=2&x-typesense-api-key=" + search_api_key + "&callback=?";

        console.log(url);
        $.getJSON(url, function(data) {
            callback(data);
        });
    }

    function onResults(data) {
        if(data.found == 0) {
            $('#goodreads-found').html("No results found.");
            $('#goodreads-results').html('');
            $('#goodreads-results-nav a').addClass('disabled');
            return ;
        }

        var total_pages = Math.ceil(Math.min(data.found, 100) / search_state.per_page);
        var found_text = data.found + (data.found > 1 ? " results." : " result.");
        found_text += " Page " + search_state.page + " of " + total_pages + ".";
        $('#goodreads-found').html(found_text);

        var lis = '';
        for(var i = 0; i < data.hits.length; i++) {
            var title = data.hits[i].title;
            var doc = data.hits[i].document;
            lis += '<li><img src="' + doc.small_image_url + '" alt="' + doc.title +
                   '" />' + data.hits[i]._highlight.original_title + '</li>';
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

        search_state.page += 1;
        getResults($('#goodreads-search input').val(), onResults);
        return false;
    });

    $(document).on("click", "#goodreads-results-nav a#prev-page", function() {
        if($(this).hasClass('disabled')) {
            return false;
        }

        if(search_state.page == 0) {
            return false;
        }

        search_state.page -= 1;
        getResults($('#goodreads-search input').val(), onResults);
        return false;
    });

    getResults($('#goodreads-search input').val(), onResults);
});