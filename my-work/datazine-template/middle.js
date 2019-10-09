const viz = d3.select('#container')
                    .append('svg')
                        .attr('width', 2360)
                        .attr('height', 780)
                        .attr("transform", "translate(" + 10 + ", " + 10 + ")");

const taskSecond = async () => {
    let data = await d3.json('data.json');
    data = data.filter((d) => {
        if (d.platform !== 'Bilitencent') return true;
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
    const newTags = {'other': 0};
    const colorMap = ['#c4302b', '#73c9e5', '#86BA00']

    data.forEach((it) => {
        if (it.tag && !tags[it.tag]) tags[it.tag] = 1;
        else if (it.tag) tags[it.tag] += 1;
    });

    for (const tag in tags) {
        if (tags[tag] > 20) newTags[tag] = tags[tag];
    }

    let xScale = d3.scaleTime().domain([0, 24]).range([80, 2320])
    let xAxis = d3.axisBottom(xScale);
    xAxis.ticks(24).tickFormat((d, i) => {
        return (i > 12) ? `${i % 12} p.m.` : `${i} a.m.`
    });
    let yScale = d3.scaleBand()
                    .range([760, 20])
                    .domain(Object.keys(newTags));
    let yAxis = d3.axisLeft(yScale);
    
    const getTags = (it) => {
        return it.tag ? it.tag : 'other';
    }

    const countTags = (prev, curr) => {
        if (!prev[curr]) prev[curr] = 1;
        else prev[curr] += 1;
        prev.total += 1;
        return prev;
    }

    const youtubeData = data.filter((it) => it.platform === 'Youtube')
    const biliData = data.filter((it) => it.platform === 'Bilibili')
    const tencentData = data.filter((it) => it.platform === 'Tencent')

    let biliTags = biliData.map(getTags).reduce(countTags, {total: 0});
    let youtubeTags = youtubeData.map(getTags).reduce(countTags, {total: 0});
    let tencentTags = tencentData.map(getTags).reduce(countTags, {total: 0});
    delete youtubeTags['total'];

    const youtubeValues = Object.keys(youtubeTags).map((it) => youtubeTags[it])
    console.log(youtubeValues)
    const youtubeScale = d3.scaleLinear().domain([0, Math.max(...youtubeValues)]).range([100, 500]);

    const chart = viz.append('g')
                    .attr('class', 'chart');

    const youtubeChart = chart.append('g')
                                .attr('class', 'youtube');

    youtubeChart.append('svg:image')
                .attr('height', 100)
                .attr('width', 200)
                .attr('y', 100)
                .attr('x', 25)
                .attr('xlink:href', './assets/youtube.png')
    
    const padding = 20;
    const youtubeX = Object.keys(youtubeTags).reduce((prev, curr) => {
        let temp = youtubeScale(youtubeTags[curr]);
        if (prev) temp += prev[prev.length - 1];
        prev.push(temp);
        return prev
    }, [0])
    console.log(youtubeX)
    youtubeChart.selectAll('rect')
                    .data(d3.entries(youtubeTags))
                    .enter()
                    .append('rect')
                        .attr('x', (d, i) => {
                           return 250 + youtubeX[i] + padding*i
                        })
                        .attr('y', 50)
                        .attr('width', (d) => {
                            const w = youtubeScale(d.value);
                            return w;
                        })
                        .attr('height', 200)
                        .style('fill', colorMap[0])
    
    youtubeChart.selectAll('text')
                    .data(d3.entries(youtubeTags))
                    .enter()
                    .append('text')
                        .attr('x', (d, i) => {
                            if (d.key === 'movie cut') return 250 + youtubeX[i] + padding*i + 20;
                            else if (d.key === 'education' || d.key === 'tech') return 250 + youtubeX[i] + padding*i + Math.floor(youtubeScale(d.value) / 3);
                            else if (d.key !== 'performance') return 250 + youtubeX[i] + padding*i + Math.floor(youtubeScale(d.value) / 3);
                            else return 250 + youtubeX[i] + padding*i + 3.5
                        })
                        .attr('y', 150)
                        .style('fill', 'white')
                        .text((d) => d.key)

    // for (const key in biliTags) {
    //     if (key !== 'total')
    //     biliTags[key] = biliTags[key] / biliTags.total;
    // }

    // for (const key in youtubeTags) {
    //     if (key !== 'total')
    //     youtubeTags[key] = youtubeTags[key] / youtubeTags.total;
    // }

    // for (const key in biliTags) {
    //     if (key !== 'total')
    //     youtubeTags[key] = youtubeTags[key] / youtubeTags.total;
    // }

    delete biliTags['total']
    const biliValues = Object.keys(biliTags).map((it) => biliTags[it])
    console.log(biliValues)
    const biliScale = d3.scaleLinear().domain([0, Math.max(...biliValues)]).range([100, 300]);

    const biliChart = chart.append('g')
                                .attr('class', 'bili');

    biliChart.append('svg:image')
                .attr('height', 100)
                .attr('width', 200)
                .attr('y', 350)
                .attr('x', 5)
                .attr('xlink:href', './assets/bilibili.png')
    
    const biliX = Object.keys(biliTags).reduce((prev, curr) => {
        let temp = biliScale(biliTags[curr]);
        if (prev) temp += prev[prev.length - 1];
        prev.push(temp);
        return prev
    }, [0])
    console.log(biliX)
    biliChart.selectAll('rect')
                    .data(d3.entries(biliTags))
                    .enter()
                    .append('rect')
                        .attr('x', (d, i) => {
                           return 250 + biliX[i] + padding*i
                        })
                        .attr('y', 300)
                        .attr('width', (d) => {
                            const w = biliScale(d.value);
                            return w;
                        })
                        .attr('height', 200)
                        .style('fill', colorMap[1])
    
    biliChart.selectAll('text')
                    .data(d3.entries(biliTags))
                    .enter()
                    .append('text')
                        .attr('x', (d, i) => {
                            if (d.key === 'performance') return 250 + biliX[i] + padding*i + 10;
                            return 250 + biliX[i] + padding*i + Math.floor(biliScale(d.value) / 3);
                        })
                        .attr('y', 400)
                        .style('fill', 'white')
                        .text((d) => d.key)
 
// 
        delete tencentTags['total']
        const tencentValues = Object.keys(tencentTags).map((it) => tencentTags[it])
        console.log(tencentValues)
        const tencentScale = d3.scaleLinear().domain([0, Math.max(...tencentValues)]).range([100, 2400]);

        const tencentChart = chart.append('g')
                                    .attr('class', 'tencent');

        tencentChart.append('svg:image')
                    .attr('height', 100)
                    .attr('width', 200)
                    .attr('y', 550)
                    .attr('x', 5)
                    .attr('xlink:href', './assets/tencent.png')

        const tencentX = Object.keys(tencentTags).reduce((prev, curr) => {
            let temp = tencentScale(tencentTags[curr]);
            if (prev) temp += prev[prev.length - 1];
            prev.push(temp);
            return prev
        }, [0])
        console.log(tencentX)
        tencentChart.selectAll('rect')
                        .data(d3.entries(tencentTags))
                        .enter()
                        .append('rect')
                            .attr('x', (d, i) => {
                            return 250 + tencentX[i] + padding*i
                            })
                            .attr('y', 550)
                            .attr('width', (d) => {
                                const w = tencentScale(d.value);
                                return w;
                            })
                            .attr('height', 200)
                            .style('fill', colorMap[2])

        tencentChart.selectAll('text')
                        .data(d3.entries(tencentTags))
                        .enter()
                        .append('text')
                            .attr('x', (d, i) => {
                                return 250 + tencentX[i] + padding*i + Math.floor(tencentScale(d.value) / 2);
                            })
                            .attr('y', 650)
                            .style('fill', 'white')
                            .text((d) => d.key)
}

taskSecond()
//     const radius = 250;
//     const colorSet = d3.scaleSequential()
//                         .domain([0, Object.keys(tags).length])
//                         .interpolator(d3.interpolateRainbow);
//     const pieFunc = d3.pie()
//                       .value((d) => d.value);
//     const pieData = pieFunc(d3.entries(tags));

//     const arc = d3.arc().innerRadius(0).outerRadius(radius);

//     const pieChart = svg.append('g').attr('class', 'pie');
//     pieChart.attr('transform', 'translate(' + 1800 + ',' + 400 + ')')

//     pieChart.selectAll('path')
//             .data(pieData)
//             .enter()
//             .append('path')
//                 .attr('d', arc)
//                 .attr('fill', (d, i) => colorSet(i))
//                 .attr('stroke', 'black')
//                 .style('stroke-width', '2px')
//                 .style('opacity', .6);

//     pieChart.selectAll('mySlices')
//             .data(pieData)
//             .enter()
//             .append('text')
//             .text((d) => {
//                 if (d.data.value > 18) return d.data.key
//                 else if (d.data.value === 18) return 'Other'
//             })
//             .attr("transform", (d) => {
//                 if (d.data.value > 18) return `translate(${ arc.centroid(d) } )`;
//                 else if (d.data.value === 18) {
//                     console.log(arc.centroid(d))
//                     return `translate(${ arc.centroid(d)[0]+10}, ${arc.centroid(d)[1]  - 50} )`;
//                 }
//             })
//             .style("text-anchor", "middle")
//             .style("font-size", (d) => {
//                 if (d.data.value > 18) return 17;
//                 else if (d.data.value === 18) return 24;
//             });
// }

