// Design / Dribbble by:
// Oleg Frolov
// URL: https://dribbble.com/shots/3072293-Notify-me

$(".cta span").click(function(){
    if($(".cta span").text() == "Correct Answer"){
        location.reload();
        return;
    }
    if($(".cta span")){
        $(".cta").removeClass("span");
        $(".cta").css("border-color", "#00bcd4");
    }
    $(".cta:not(.sent)").addClass("active");
    $("input").focus();
});

var regex = /^[0-9]{1,10}$/;

$("input").on('input', function(){
    if(regex.test($(this).val())) {
        $("#answer_submit").removeAttr("disabled"); }
    else {
        $("#answer_submit").attr("disabled", "disabled"); }
});

$("#answer_submit").click(function(err){
    $.ajax({
        type: 'POST',
        url: '/problem/'+problem_id+'/submit',
        data: {answer : $("#answer").val() },
        success : function(result) {
            if(result.correct == true){
                $(".cta span").text("Correct Answer");
                $(".cta span").css("color", "#4caf50");
                $(".cta").css("border-color", "#4caf50");
                $(".cta").removeClass("active");
            } else {
                $(".cta span").text("Wrong Answer");
                $(".cta span").css("color", "#f44336");
                $(".cta").css("border-color", "#f44336");
                $(".cta").removeClass("active");
            }
        }
    });
});