var app = angular.module('reader', []);

app.controller('MainCtrl', function($scope) {
  $scope.name = 'World';
});

app.directive('fileReader', function() {
  return {
    scope: {
      fileReader:"="
    },
    link: function(scope, element) {
      $(element).on('change', function(changeEvent) {
        var files = changeEvent.target.files;
		var error = 0;
		var error_text = 'Invalid File';
        if (!files.length) {
			error++;
		}else{
			var ec = files[0].name.split('.');
			if(ec.length != 0){
				if(ec[ec.length-1] != 'csv')
					error++;
			}else{
				error++;
			}
		}
        if (error == 0) {
          var r = new FileReader();
		  r.onload = function(e) {
              var contents = e.target.result;
			  // split content based on new line
				var allTextLines = contents.split(/\r\n|\n/);
				var lines = [];
				var dpdata = '';
				for ( var i = 0; i < allTextLines.length; i++) {
					// split content based on comma
					var data = allTextLines[i].split(',');
					var tarr = [];
					for ( var j = 0; j < data.length; j++) {							
						if(data[j] != '' && data[j]){
							var count = (allTextLines[i].split(data[j]).length - 1);
							if(count > 1){
								error++
								dpdata+='-'+data[j];
							}		
							if(j != 0){								
								var xy = data[j].split('|');
								var temp = { 'x': parseInt(xy[0]), 'y': parseInt(xy[1]) };
								tarr.push(temp);
							}
						}
					}
					var test =  {
						'type': "line",
						'dataPoints': tarr
					  };
					lines.push(test);
				}
				if(error == 0){
				var chart = new CanvasJS.Chart("chartContainer",
				{
				  title:{
					text: "CSV File Reader"
				  },
				  axisX: {
					interval:1
				  },
				  axisY:{
					includeZero: false
				  },
				  data: lines
				});
				chart.render();
				}else{
					alert('Duplicate Data Found'+dpdata);
					$(element).val('');
				}
          };  
          r.readAsText(files[0]);
        }else{
			alert(error_text);
			$(element).val('');
		}
      });
    }
  };
});