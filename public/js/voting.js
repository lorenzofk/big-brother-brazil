'use strict';

var selectedParticipant = {};


$('.photo').click(function (e) {

    $(".photo").not(this).removeClass('selected');

    $(this).addClass('selected');

    selectedParticipant.id = $(this).attr('data-id');
    selectedParticipant.name = $(this).attr('data-name');
});

$('.vote').click(function (e) {

    let id = $('#elimination').val();

    if (selectedParticipant === null) {
        alert('Selecione um participante!');
        return false;
    }

    $.ajax({
        url: "/votacao/" + id + '/' + selectedParticipant.id,
        type: 'post'
    }).done(function(result) {

        new Chart($('#results'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [
                        parseFloat(result.resume[0].percent * 100).toFixed(2),
                        parseFloat(result.resume[1].percent * 100).toFixed(2)
                    ],
                    backgroundColor:[
                        "rgb(253, 126, 1)",
                        "rgb(233, 236, 239)",
                    ]
                }],
                labels: [
                    result.resume[0].name,
                    result.resume[1].name,
                ]
            },
            options: {
                reverse: true,
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI,
                responsive: true,
            }
        });

        $('.main').hide();
        $('.container-results .message').html('<strong>Parabéns! </strong> Seu voto para <strong>'+ selectedParticipant.name + '</strong> foi enviado com sucesso!</strong>');
        $('.container-results').show();

    }).fail(function(err){
        console.log(err);
    });

});
