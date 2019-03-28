$(document).ready(function() {
    document.getElementById("datetime").value = new Date().toLocaleDateString()
    function getTraps(){
        $("#myTable").find("tr:gt(0)").remove();
        $.ajax({
            type: 'GET',
            url: 'https://localhost:5001/api/trap',
            cache: false,
            success:function(data){
                console.log(data)
                data.forEach(element => {
                    
                    $('#myTable').append(`<tr><td>${element.id}</td><td>${element.trapType}</td><td>${element.timestamp.substring(0, 10)}</td><td>${element.location}</td><td>${element.amountOfBait.toString(10).substring(2)}%</td></tr>`);
                });
            }
        })
    }

    function addTrap(){
        name = document.getElementById("name").value
        loc = document.getElementById("location").value
        date = document.getElementById("datetime").value
        AOB = document.getElementById("Bait").value
        
        newData = {
            "trapType": name,
            "timestamp" : date,
            "location" : loc,
            "amountOfBait" : AOB
        };
        console.log(newData)
        $.ajax({
            type: "POST",
            url: 'https://localhost:5001/api/trap',
            data: JSON.stringify(newData),
            dataType: 'json',
            contentType: 'application/json',
            success: function () {console.log('succ') },
  
          }).done(function(ret){
            console.log(ret)
            getTraps()
          });
    }
    document.getElementById("submit").addEventListener("click",function(){
        addTrap()
    })
    //$('#myTable').DataTable();
    getTraps()
});