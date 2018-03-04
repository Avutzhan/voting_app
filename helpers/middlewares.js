exports.GraphCreator = function (poll) {
    this.type = "pie";
    var tempLabels = [],
        tempCount = [],
        tempBGC = []
        
    poll.answers.forEach(function(data){
        tempLabels.push(data.item);
        tempCount.push(data.count);
        tempBGC.push("rgb("+ Math.floor(Math.random()*255) + ", "+ Math.floor(Math.random()*255) + ", "+ Math.floor(Math.random()*255) + ")")
    });
    this.data = {
        labels: tempLabels,
        datasets: [{
            label: "Answers",
            data: tempCount,
            backgroundColor: tempBGC,
            borderWidth: 1
        }]
    },
    this.options = {
        legend: {
            position: "right"
        },
        animation: {
			animateScale: true,
			animateRotate: true
		},
        cutoutPercentage : 50
    }
}


module.exports = exports;
/*
var t = {
                        type: 'pie',
                        data: {
                            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                            datasets: [{
                                label: '# of Votes',
                                data: [12, 19, 3, 5, 2, 3],
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 206, 86)',
                                    'rgb(75, 192, 192)',
                                    'rgb(153, 102, 255)',
                                    'rgb(255, 159, 64)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            legend: {
                                position: "right"
                            },  
                            cutoutPercentage : 50
                        }                
                    }
*/