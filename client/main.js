Template.main.events({
    'click #go': function (e) {
        e.preventDefault();
        $("#res, #commitNum b").empty();
        $("#result, #err").hide();
        var btn = $('#go');
        btn.button('loading');
        var exam = $("#url").val();

        var since = $("#fromDate").val();
        var until = $("#toDate").val();

        if (since) {
            since = moment(since).format('YYYY-MM-DD');
        } else {
            since = '1993-10-04'
        };

        if (until) {
            until = moment(until).format('YYYY-MM-DD');
        } else {
            until = moment().format('YYYY-MM-DD');
        }


        if (exam.indexOf("github.com") > -1) {

            var exa = exam.split('github.com/');
            var val = exa[1].split('/');
            var url = "https://github.com/" + val[0] + "/" + val[1];

           
            function finish(){
                btn.button('reset');
                $('#res').prepend("Last update: `" + until + "` created with: [gitLog](http://gitlog.meteor.com)");
                var count = $("#res li").length;
                $('#commitNum b').prepend(count);
                var container = $('html, body'),
                    scrollTo = $('.url-top');
                $('#result').show();
                container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                }, '1000');
            
            }
            
            function commiter(a) {
                if (a < 10) {
                Meteor.call('getCommits', val[0], val[1], a, since, until, function (error, result) {
                    if (error) {
                        
                    }

                    if (result) {
                        for (i = 0; i < result.length; i++) {

                            var commit_url = result[i].html_url;
                            var url_issues = url + "/issues/";
                            var message = result[i].commit.message;

                            if (message.indexOf('#') != -1) {
                                var hash = message.match(/#\d+/g);
                                var num = message.match(/\d+/g);
                                for (g = 0; g < hash.length; g++) {
                                    var message = message.replace(hash[g], "[" + hash[g] + "](" + url_issues + num[g] + ")");
                                    //fixes += "[" + hash[g] + "](" + url_issues + num[g] + ")"
                                }
                            } else {
                                var message = result[i].commit.message;
                            }
                            var sha = result[i].sha;
                            var commit = sha.substring(0, 7);

                            $("#res").append("<li>* " + message + " - [`" + commit + "`](" + commit_url + ") </li>")

                        };
                        
                    }else{
                        btn.button('reset');
                        $('#err').show();
                    };
                    
                    if(result.length !== 0){
                        if( a < 9){
                        commiter(a + 1);
                        }
                    }else{
                        finish();
                    }

                });
                }else{
                    finish();
                }
            };
            commiter(1)
            
 


        } //if index of
        else {
            $("#err").show();
            $("#result").children().slideUp();
            btn.button('reset');
            $("#res, #commitNum b").delay('1000').empty();
        }
    },
    'click .more': function () {
        if (Session.get("nyil")) {
            Session.set("nyil", false);
        } else {
            Session.set("nyil", true);
        }
        $('#more').slideToggle(200);

    }

});

Template.main.helpers({
    nyil: function () {
        if (Session.get("nyil")) {
            return "left"
        } else {
            return "right"
        }
    },
    nyil1: function () {
        if (Session.get("nyil")) {
            return "right"
        } else {
            return "left"
        }
    },

})

Template.main.rendered = function () {

    Session.setDefault("nyil", false)
    $('#fromDate').datepicker();
    $('#toDate').datepicker();

}