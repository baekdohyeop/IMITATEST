document.querySelector('.img__btn').addEventListener('click', function () {
    document.querySelector('.cont').classList.toggle('s--signup');
});

$(function(){
    $('#email').keyup(function() {
        console.log('hi');
    });
});