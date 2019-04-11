$(document).ready(function () {
    //document.getElementById("datetime").value = new Date().toLocaleDateString()
    function getTraps(x) {
        $("#myTable").find("tr:gt(0)").remove();
        var uri = ''
        if (!isNaN(parseInt(x))) {
            uri = `https://trap-track.herokuapp.com/api/traps/${x}`
        }
        else {
            uri = 'https://trap-track.herokuapp.com/api/traps'
        }
        $.ajax({
            type: 'GET',
            url: uri,
            cache: false,
            success: function (data) {
                console.log(data)
                data.forEach(element => {
                    $('#myTable').append(`<tr><td>${element.Trap_ID}</td><td>${element.Trap_type}</td></tr>`);
                });
            }
        })
    }
    document.getElementById('Trapsearch').addEventListener('click', function () {
        getTraps(document.getElementById('trapInput').value)
    })
    document.getElementById('add_new').addEventListener('click', function () {
        document.getElementById('contaner').style.display = 'block'
    })
    function addBuilding() {
        name = document.getElementById("name").value

        newData = {
            "Trap_type": name,
            "Floor_ID": "1",
        };
        console.log(newData)
        // $.ajax({
        //     type: "POST",
        //     url: 'https://trap-track.herokuapp.com/api/traps/create',
        //     data: JSON.stringify(newData),
        //     dataType: 'json',
        //     contentType: 'application/json',
        // });
        window.setTimeout(function(){
            document.getElementById('contaner').style.display = 'none'
            getTraps("hi")
        }, 1000);
        
    }
    document.getElementById("submit").addEventListener("click", function () {
        addBuilding()
    })

    getTraps("hi")
});