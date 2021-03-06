'use strict';

var selectedParticipant = {};

var counterDown = function (date) {
    // Set the date we're counting down to
    var countDownDate = new Date(date).getTime();

    // Update the count down every 1 second
    var counter = setInterval(function() {

        var now = new Date().getTime();

        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        hours = hours < 10 ? "0" + hours: hours;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        $('.counter').html(hours + ":" + minutes + ":" + seconds + "");

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(counter);
        }
    }, 1000);
};

$(document).ready(function () {

    let endsAt = $('#elimination').attr('ends-at');

    // Active counterdown
    counterDown(endsAt);

    $('.photo').click(function (e) {

        $(".photo").not(this).removeClass('selected');

        $(this).addClass('selected');

        selectedParticipant.id = $(this).attr('data-id');
        selectedParticipant.name = $(this).attr('data-name');
    });

    $("#voting-form").on("submit", function(e) {
        e.preventDefault();

        let id = $('#elimination').val();

        if (selectedParticipant.id === undefined) {
            alert('Selecione um participante!');
            return false;
        }

        $.ajax({
            url: "/votacao/",
            type: 'post',
            data: {
                id: id,
                captcha: grecaptcha.getResponse(),
                participantId: selectedParticipant.id
            }
        }).done(function(result) {

            let element = $('#results');

            new Chart(element, {
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
                    cutoutPercentage: 70,
                    circumference: 1.5 * Math.PI,
                    rotation: 0.75 * Math.PI,
                    maintainAspectRatio: false,
                    legend: { display: true },
                    title: {
                        display: true,
                        text: 'TOTAL PARCIAL DE VOTOS'
                    },
                }
            });

            $('.voting').hide();
            $('.results .message').html('<strong>Parabéns! </strong> Seu voto para <strong>'+ selectedParticipant.name + '</strong> foi enviado com sucesso!</strong>');
            $('.results').show();


        }).fail(function(err){
            console.log(err);
        });

    });
});