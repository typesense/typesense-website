$(document).ready(function() {
    function getResults(q, callback) {
        var url = "http://localhost:8108/collections/goodreads_10k/search?q="+ q +
            "&prefix=true&query_by=original_title&sort_by=ratings_count:DESC&per_page=4&num_typos=2&callback=?"
        $.getJSON(url, function(data) {
            callback(data);
        });
    }

    function onResults(data) {
        if(data.found == 0) {
            $('#goodreads-found').html("No results found.");
            $('#goodreads-results').html('');
            return ;
        }

        var found_text = "Found " +  data.found + (data.found > 1 ? " results." : " result.");
        $('#goodreads-found').html(found_text);

        var lis = '';
        for(var i = 0; i < data.hits.length; i++) {
            var title = data.hits[i].title;
            var title_parts = title.split(' ');
            if(title_parts.length > 6) {
                title = title_parts.slice(0, 6).join(' ') + '...';
            }
            lis += '<li><img src="' + data.hits[i].small_image_url + '" alt="' + data.hits[i].title +
                   '" />' + title + '</li>';
        }


        $('#goodreads-results').html(lis);
    }


    $("#goodreads-search input").on('input', function() {
        getResults($(this).val(), onResults);
    });

    getResults($('#goodreads-search input').val(), onResults);
});