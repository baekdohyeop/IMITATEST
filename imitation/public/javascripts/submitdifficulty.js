$(".cta2 span").click(function(){
    var difficulty = (Number($(".noUi-origin").css("left").replace('px', '')) / (Number($(".noUi-origin").css("left").replace('px', '')) + Number($(".noUi-origin").css("right").replace('px', ''))))*10;
    $.ajax({
        type: 'POST',
        url: '/problem/'+problem_id+'/submitdifficulty',
        data: { difficulty : difficulty },
        success : function(result) {
            location.reload();
            return;
        }
    }); 
});

$("#difficulty_submit").click(function(){
    var difficulty = (Number($(".noUi-origin").css("left").replace('px', '')) / (Number($(".noUi-origin").css("left").replace('px', '')) + Number($(".noUi-origin").css("right").replace('px', ''))))*10;
    $.ajax({
        type: 'POST',
        url: '/test/'+test_id+'/addreview',
        data: { difficulty : difficulty, content: $("#difficulty_content").val(), },
        success : function(result) {
            location.reload();
            return;
        }
    }); 
})