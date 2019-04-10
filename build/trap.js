$(document).ready(function() {
    //document.getElementById("datetime").value = new Date().toLocaleDateString()
    function getTraps(){
        $("#myTable").find("tr:gt(0)").remove();
        $.ajax({
            type: 'GET',
            url: 'https://trap-track.herokuapp.com/api/traps',
            cache: false,
            success:function(data){
                console.log(data)
                data.forEach(element => {
                    
                    $('#myTable').append(`<tr><td>${element.Trap_ID}</td><td>${element.Trap_type}</td><td>${element.Time.substring(0, 10)}</td><td>${element.Bait_left}%</td></tr>`);
                });
            }
        })
    }

    function addTrap(){
        name = document.getElementById("name").value
        AOB = parseInt(document.getElementById("Bait").value*100)
        
        newData = {
            "Trap_type": name,
            "Floor_ID": "1",
            "Bait_left" : AOB
        };
        console.log(newData)
        $.ajax({
            type: "POST",
            url: 'https://trap-track.herokuapp.com/api/traps/create',
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