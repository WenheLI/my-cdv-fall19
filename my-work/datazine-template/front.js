const task = async () => {
    let data = await d3.json('data.json');
    data = data.filter((d) => {
        if (d.platform !== 'Bilibili') return true;
        else if (d.progress === -1 || d.progress ) return true;
        return false;
    });
    const colorMap = ['#c4302b', '#73c9e5', '#86BA00']

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
    data = data.sort((a, b) => {
        if(a.duration > b.duration) return -1;
        else return 1;
    })
    
    const svg = d3.select('#container')
                    .append('svg')
                        .attr('width', 1200)
                        .attr('height', 780)
                        .attr("transform", "translate(" + 10 + ", " + 10 + ")");


    const textContainer = svg.append('g')
                                .attr('class', 'desc')
                                .attr('transform', 'translate(' + 950 + ',' + 10 + ')');


    textContainer.append('text')
                .attr('transform', 'translate(' + -40 + ',' + 200 + ')')
                .style('font-size', '22px')
                .text('This chart collects 3-week')

    textContainer.append('text')
                .attr('transform', 'translate(' + -40 + ',' + 225 + ')')
                .style('font-size', '22px')
                .text('of watching history.')

    textContainer.append('text')
                .attr('transform', 'translate(' + -40 + ',' + 250 + ')')
                .style('font-size', '22px')
                .text('It shows when and where');
    textContainer.append('text')
                .attr('transform', 'translate(' + -40 + ',' + 275 + ')')
                .style('font-size', '22px')
                .text('I watch videos.');   
    textContainer.append('text')
                .attr('transform', 'translate(' + -40 + ',' + 300 + ')')
                .style('font-size', '22px')
                .text('The size of circles shows')
    textContainer.append('text')
                .attr('transform', 'translate(' + -40 + ',' + 325 + ')')
                .style('font-size', '22px')
                .text('how long I have watched.'); 
    

    textContainer.append('circle')
        .attr('transform', 'translate(' + -30 + ',' + 500 + ')')
        .style('fill', colorMap[0])
        .attr('cx', 0)
        .attr('cy', 0)
        .style('opacity', .8)
        .attr('r', 10);   

    textContainer.append('text')
                .text('=>')
                .style('font-size', '22px')
                .attr('transform', 'translate(' + 0 + ',' + 505 + ')')

    textContainer.append('text')
            .text('Youtube')
            .style('font-size', '22px')
            .attr('transform', 'translate(' + 40 + ',' + 505 + ')')

    textContainer.append('circle')
        .attr('transform', 'translate(' + -30 + ',' + 550 + ')')
        .style('fill', colorMap[1])
        .attr('cx', 0)
        .attr('cy', 0)
        .style('opacity', .8)
        .attr('r', 10);   

    textContainer.append('text')
                .text('=>')
                .style('font-size', '22px')
                .attr('transform', 'translate(' + 0 + ',' + 555 + ')')

    textContainer.append('text')
            .text('Bilibili')
            .style('font-size', '22px')
            .attr('transform', 'translate(' + 40 + ',' + 555 + ')')

    textContainer.append('circle')
        .attr('transform', 'translate(' + -30 + ',' + 600 + ')')
        .style('fill', colorMap[2])
        .attr('cx', 0)
        .attr('cy', 0)
        .style('opacity', .8)
        .attr('r', 10);   

    textContainer.append('text')
                .text('=>')
                .style('font-size', '22px')
                .attr('transform', 'translate(' + 0 + ',' + 605 + ')')

    textContainer.append('text')
            .text('Tencent')
            .style('font-size', '22px')
            .attr('transform', 'translate(' + 40 + ',' + 605 + ')')


            
    const scatterChart = svg.append('g')
                                .attr('class', 'scatter');
    
    const xScale = d3.scaleLinear().domain([0, 11]).range([30, 800]);
    const yScale = d3.scaleLinear().domain([0, 6]).range([50, 700]);
    
    const xAxis = d3.axisBottom(xScale)
                    .ticks(12)
                    .tickFormat((d, i) => {
                        return (d * 2 > 12) ? `${d * 2 % 12} p.m.` : `${d * 2} a.m.`
                    });
    const yAxis = d3.axisLeft(yScale)
                    .ticks(7)
                    .tickFormat((d) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d] );
    
    scatterChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + 50 + ',' + 740 + ')')
                .call(xAxis)
                .call(g => g.select(".domain").remove());
    
    scatterChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + 50 + ',' + 0 + ')')
                .call(yAxis)
                .call(g => g.select(".domain").remove());
    
    
    const videoDuration = data.map((it) => it.duration);
    const minDuration = Math.min(...videoDuration);
    const maxDuration = Math.max(...videoDuration);
    
    const rScale = d3.scaleLinear().range([5, 30]).domain([minDuration, maxDuration]);
    scatterChart.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                    .style('fill', (d, i) => {
                        if (d.platform === 'Bilibili') return colorMap[1];
                        else if (d.platform === 'Youtube') return colorMap[0];
                        else if (d.platform === 'Tencent') return colorMap[2];
                    })
                    .attr('cx', (d) => xScale(Math.floor(d.hour/2)) + 50)
                    .attr('cy', (d) => yScale(d.day))
                    .style('opacity', .8)
                    .attr('r', (d) => rScale(d.duration));
    
}


task();