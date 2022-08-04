function main(){
    var mySvg = d3.select("svg"),
    margin = 200,
    width = mySvg.attr("width") - margin,
    height = mySvg.attr("height") - margin;

    mySvg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 40)
        .attr("y", 50)
        .attr("font-size", "20px")
        .text("UK average temperature in January in the UK during 2020-2022.")

    var xAxis = d3.scaleBand().range([0, width]).padding(0.4),
    yAxis = d3.scaleLinear().range([height, 0]);

    var g = mySvg.append("g")
           .attr("transform", "translate(" + 100 + "," + 100 + ")");
    let x = 'uk2.json'
    d3.json(x).then(function(data){

        xAxis.domain(data.map(function(d) { return d.year; }));
        yAxis.domain([0, d3.max(data, function(d) { return d.value; })]);

        g.append("g")
             .attr('transform', 'translate(0,' + height + ')' )
             .call(d3.axisBottom(xAxis))
             .append("text")
             .attr("y", height -350)
             .attr("x", width - 400)
             .attr("text-anchor" , "end")
             .attr("stroke", "black")
             .text("Year")


        g.append('g')
            .call(d3.axisLeft(yAxis).tickFormat(function(d){
                return d + "°C";
            }).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("dy", "-5em")
            .attr('text-anchor' , 'end')
            .attr('stroke', "black")
            .text("Temperature")
        
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseover)
            .on("mouseout", onMouseOut)
            .attr("x", function(d) { return xAxis(d.year); })
            .attr("y", function(d) { return yAxis(d.value); })
            .attr("width", xAxis.bandwidth())
            .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .delay(function(d,i){ return i * 50})
            .attr("height", function(d) { return height - yAxis(d.value); })  
    });

    function onMouseover( x, y){
        var xPos = parseFloat(d3.select(this).attr('x')) + xAxis.bandwidth() / 2;

        d3.select('#data')
            .style('left', (xPos+400) + 'px')
            .style('top' , (margin.top - 1000 )  + 'px')
            .select('#value').text(y.value + "°C")
        d3.select('#data').classed('hide', false); 

        d3.select(this).attr('class', 'highlight')
        d3.select(this)
            .transition()
            .duration(500)
            .attr('width', xAxis.bandwidth() + 5) 
            .attr('y' , function(d) { return yAxis(d.value) - 10;})
            .attr('height' , function(d){return height - yAxis(d.value) + 10;})

    }

    function onMouseOut( x, y){
        d3.select(this).attr('class', 'bar')
        d3.select(this)
            .transition()
            .duration(500)
            .attr('width', xAxis.bandwidth())
            .attr('y', function(d) {return yAxis(d.value);})
            .attr('height' , function(d){return height - yAxis(d.value);})
        d3.select('#data').classed('hide', true);
    };
};