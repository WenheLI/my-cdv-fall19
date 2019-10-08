const task = async () => {
    let data = await d3.json('data.json');
    data = data.filter((d) => {
        if (d.platform !== 'Bilibili') return true;
        else if (d.progress === -1 || d.progress ) return true;
        return false;
    });
    data = data.map((d) => {
        let date = new Date(d.time);
        let time = date.getMinutes() + date.getHours() * 60;        
        d.time = time;
        d.day = date.getDay();
        d.hour = date.getHours();
        d.printedTime = `${date.getHours()} : ${date.getMinutes()}`;
        return d;
    });
    
    const tags = {};
    
    data.forEach((it) => {
        if (it.tag && !tags[it.tag]) tags[it.tag] = 1;
        else if (it.tag) tags[it.tag] += 1;
    });
    
    const svg = d3.select('#container')
                    .append('svg')
                        .attr('width', 2360)
                        .attr('height', 780)
                        .attr("transform", "translate(" + 10 + ", " + 10 + ")");
    
    const scatterChart = svg.append('g')
                                .attr('class', 'scatter');
    
    const xScale = d3.scaleLinear().domain([0, 23]).range([30, 1100]);
    const yScale = d3.scaleLinear().domain([0, 6]).range([10, 720]);
    
    const xAxis = d3.axisBottom(xScale)
                    .ticks(24)
                    .tickFormat((d, i) => {
                        return (d > 12) ? `${d % 12} p.m.` : `${d} a.m.`
                    });
    const yAxis = d3.axisLeft(yScale)
                    .ticks(7)
                    .tickFormat((d) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d] );
    
    scatterChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + 50 + ',' + 740 + ')')
                .call(xAxis);
    
    scatterChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + 50 + ',' + 0 + ')')
                .call(yAxis);
    
    const colorMap = ['#c4302b', '#73c9e5', '#86BA00']
    
    const videoDuration = data.map((it) => it.duration);
    const minDuration = Math.min(...videoDuration);
    const maxDuration = Math.max(...videoDuration);
    
    const rScale = d3.scaleLinear().range([3, 20]).domain([minDuration, maxDuration]);
    scatterChart.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                    .style('fill', (d, i) => {
                        if (d.platform === 'Bilibili') return colorMap[1];
                        else if (d.platform === 'Youtube') return colorMap[0];
                        else if (d.platform === 'Tencent') return colorMap[2];
                    })
                    .attr('cx', (d) => xScale(d.hour) + 50)
                    .attr('cy', (d) => yScale(d.day))
                    .attr('r', (d) => rScale(d.duration));
    
}


task();