const processData = (data) => {
    return data.map((d) => {
        const newD = {};
        newD.length = d['Video-length'];
        const time = new Date(d['Timestamp']);
        newD.time = time.getHours() * 60 + time.getMinutes();
        return newD;
    });
}

const task = async () => {
    let data = await d3.json('./data.json');
    data = processData(data)

    const timeSlots = ['12pm', '6am', '12am', '6pm', '12pm'];

    const viz = d3.select('#viz-container')
                        .append('svg')
                            .attr("height", 500)
                            .attr("width", 800)
                            .attr("id", "viz");
    viz.append('line')
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("x1", 50)
        .attr("y1", 400)
        .attr("x2", 750)
        .attr("y2", 400); 
    const timeGroup = viz.append('g');
    const calculateSep = (d, i) => {
        if (i === 0) return 50;
        else return i*750/4;
    }
    const times = timeGroup.selectAll('line')
                            .data(timeSlots)
                            .enter()
                            .append('line')
                                .style("stroke", "white")
                                .style("stroke-width", 2)
                                .attr('x1', calculateSep)
                                .attr('y1', 400)
                                .attr('x2', calculateSep)
                                .attr('y2', 420)
    timeGroup.selectAll('text')
                .data(timeSlots)
                .enter()
                .append('text')
                    .attr('x', calculateSep)
                    .attr('y', 430)
                    .text((d) => d);
    
    

    const tvGroup = viz.append('g');
    const movieGroup = viz.append('g');
    const computerGroup = viz.append('g');
    const timeRange = d3.scaleLinear()
                        .domain([0, 24*60])
                        .range([50, 750]);

    const classifiedData = {
        'tv': [],
        'movie': [],
        'computer': []
    };
    data.forEach((it) => {
        if (it.length < 10) classifiedData.tv.push(it)
        else if (it.length < 25) classifiedData.computer.push(it)
        else classifiedData.movie.push(it)
    });
    tvGroup.selectAll('image')
                .data(classifiedData.tv)
                .enter()
                .append('image')
                    .attr('xlink:href', './imgs/tv.svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('x', (d) => timeRange(d.time))
                    .attr('y', (d) => Math.random() * 300);

    movieGroup.selectAll('image')
                .data(classifiedData.movie)
                .enter()
                .append('image')
                    .attr('xlink:href', './imgs/movie.svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('x', (d) => timeRange(d.time))
                    .attr('y', (d) => Math.random() * 300);

    computerGroup.selectAll('image')
                .data(classifiedData.computer)
                .enter()
                .append('image')
                    .attr('xlink:href', './imgs/computer.svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('x', (d) => timeRange(d.time))
                    .attr('y', (d) => Math.random() * 400)
}

task();