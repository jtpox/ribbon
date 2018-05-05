$(document).ready(function() {
    $.getJSON('info.json', function(data) {
        // console.log(data);
        $('#version').html(data.stable);
    });
});