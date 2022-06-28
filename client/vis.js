import * as d3 from "https://cdn.skypack.dev/d3@7";

import test from './test.json' assert {type: 'json'};


function createTable(data){

    const table = d3.select('.js-custom-table')

    // add divs
	const columnDiv = table.append('div')
        .attr('class', 'flex main-table')

    // Add child items to header (i.e., header column titles) into header div
	const column = columnDiv.selectAll('cells')
        .data(data)
        .enter()
        .append('div')
        .attr('class', 'column') 

    column.append('div')
        .attr('class', 'cell category')
        .text(d => d.category)

    column.append('div')
        .attr('class', 'cell question')
        .attr('category', d => d.category)
        .attr('value', '200')
        .text('$200')

    column.append('div')
        .attr('class', 'cell question')
        .attr('category', d => d.category)
        .attr('value', '400')
        .text('$400')

    column.append('div')
        .attr('class', 'cell question')
        .attr('category', d => d.category)
        .attr('value', '600')
        .text('$600')

    column.append('div')
        .attr('class', 'cell question')
        .attr('category', d => d.category)
        .attr('value', '800')
        .text('$800')

    column.append('div')
        .attr('class', 'cell question')
        .attr('category', d => d.category)
        .attr('value', '1000')
        .text('$1000')


    // make pointer
	const mover = function() {
		d3.select(this)
			.style("cursor", "pointer");
	}
	// on mouse out restore defaults
	const mout = function() {
		d3.select(this)
			.style("cursor", "default");
	}
	// on click call up question
	const mclick = function(){
        const question = data.filter(d => d.category==this.getAttribute("category"))[0][this.getAttribute('value')].question
        d3.select('.textbox').text(question)
	}
    // on double click call up answer
    const dblclick = function(){
        const answer = data.filter(d => d.category==this.getAttribute("category"))[0][this.getAttribute('value')].answer
        d3.select('.textbox').text(answer)
	}
    const clear = function(){
        d3.select('.textbox').text('')
    }

    d3.select('#clear').on('click', clear)

    const cells = d3.selectAll('.question')
	cells.on("mouseover", mover).on("mouseout", mout).on('click', mclick).on('dblclick', dblclick);
 

}


createTable(test.game)

console.log(test)

