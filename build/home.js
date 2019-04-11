$(document).ready(function () {
    //document.getElementById("datetime").value = new Date().toLocaleDateString()
    function getTraps(x) {
        $("#myTable").find("tr:gt(0)").remove();
        var uri = ''
        if (!isNaN(parseInt(x))) {
            uri = `https://trap-track.herokuapp.com/api/buildings/${x}`
        }
        else {
            uri = 'https://trap-track.herokuapp.com/api/buildings'
        }
        $.ajax({
            type: 'GET',
            url: uri,
            cache: false,
            success: function (data) {
                console.log(data)
                data.forEach(element => {
                    $('#myTable').append(`<tr><td id=${element.Building_ID}>${element.Building_ID}</td><td id=${element.Building_ID}>${element.Building_name}</td><td id=${element.Building_ID}>${element.Location}</td></tr>`);
                });
            }
        })
        window.setTimeout(function(){
            table = document.getElementById('myTable')
            rows = table.getElementsByTagName('tr')
            for(i in rows){
                
                if(!isNaN(parseInt(i)) && i > 0){
                    table.rows[i].addEventListener('click',function(e){
                            console.log(e.target.id)
                            document.getElementById('b_id').value = e.target.id
                            console.log(document.getElementById('b_id').value)
                            document.getElementById('myform').submit();
                        })
                }
            }
        }, 1000);
    }
    document.getElementById('Trapsearch').addEventListener('click', function () {
        getTraps(document.getElementById('trapInput').value)
    })
    document.getElementById('add_new').addEventListener('click', function () {
        document.getElementById('contaner').style.display = 'block'
    })
    function addBuilding() {
        name = document.getElementById("name").value
        loc = document.getElementById("Location").value

        newData = {
            "Building_name": name,
            "Location": loc
        };
        console.log(newData)
        $.ajax({
            type: "POST",
            url: 'https://trap-track.herokuapp.com/api/buildings/create',
            data: JSON.stringify(newData),
            dataType: 'json',
            contentType: 'application/json',
        });
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