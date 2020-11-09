var problem_num = 1;

$("#start_ajax").click(function(){
    $.ajax({
        type:"POST",
        url:"/measurement/calculus/submit",
        data: {answer : $("#answer").val(), problem_num: problem_num},
        success : function(result) {
            console.log(result);
            $("#problem").text(result.problem);
            problem_num++;
        }
    });
});