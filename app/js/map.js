var map = function(geoData) {
    var that = this;
    
    this.markers = new Array();

    $('#googleMap').empty();

    var mapProp = {
        center:new google.maps.LatLng(51.508742,-0.120850),
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

    $.each(geoData, function(index, row) {
        $('#geoData-table').append('<tr><td>'+row.id+'</td>'+'<td>'+row.name+'</td>'+'<td>'+row.lat+'</td>'+'<td>'+row.lng+'</td></tr>');
        myLatlng = new google.maps.LatLng(row.lat,row.lng);

        marker = new google.maps.Marker({
            position: myLatlng,
            title: row.name
        });
        that.markers.push(marker);
        marker.setMap(that.map);
    });

};
