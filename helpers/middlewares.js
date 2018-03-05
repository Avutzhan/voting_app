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
