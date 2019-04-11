$(document).ready(function () {
    console.log(document.getElementById('loginBut'))
    document.getElementById('loginBut').addEventListener('click', function () {
        window.location.href = '/building'
    })
});