$("#get_time").click(function(){
    $.ajax({
        type:"POST",
        url:"/recommend/curriculum/get_time",
        data: { 
            goal_calculus: $("#calculus_level").val(),
            goal_geometry_and_vector: $("#geometry_and_vector_level").val(),
            goal_probability_and_statistic: $("#probability_and_statistic_level").val(), 
        },
        success : function(result) {
            console.log(result);
        }
    });
});

