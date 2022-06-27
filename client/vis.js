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
        .attr('value', '200')
        .text('$200')

    column.append('div')
        .attr('class', 'cell question')
        .attr('value', '400')
        .text('$400')

    column.append('div')
        .attr('class', 'cell question')
        .attr('value', '600')
        .text('$600')

    column.append('div')
        .attr('class', 'cell question')
        .attr('value', '800')
        .text('$800')

    column.append('div')
        .attr('class', 'cell question')
        .attr('value', '1000')
        .text('$1000')

 

}

createTable(test.game)

console.log(test)



// function notcreateTable(mycontainer, tableheader, tabledata) {
// 	/*
// 	Create a quasi table. ("quasi" because use HTML <div> tags, not <table> tags)

// 	@param {string} mycontainer An (HTML node) element to which to attach quasi-table
// 	@param {json} tableheader A JS object which includes the keys: header, type, size
// 	@param {json} tabledata A JS object comprising the table data
// 	*/

// 	// select container
// 	const table = d3.select(mycontainer)

// 	// add header div
// 	const headerDiv = table.append('div')
// 		.attr('class', 'flxh-s')

// 	// get size as string from header
// 	const cellSize = 15;

// 	// Add child items to header (i.e., header column titles) into header div
// 	const header = headerDiv.selectAll('cells')
// 		.data(tableheader.header)
// 		.enter()
// 		.append('div')
// 		.attr('class', d => `cell-header ${cellSize(d)}`) 
// 		.attr('value', d => d)
// 		.text(d => d)
// 		.on('click', sorter)

// 	// create body rows
// 	const bodyRows = table.selectAll('rows')
// 		.data(tabledata)
// 		.enter()
// 		.append('div')
// 		.attr('class', 'flxh-s js-selector-row')
// 		.attr('value', d => d.species_taxid)

// 	// fill with cells
// 	const bodyCells = bodyRows.selectAll('cells')
// 		.data(d => Object.values(d).entries()) // returns array: [index, data]
// 		.enter()
// 		.append('div')
// 		.attr('class', d => `cell ${cellSizeIndex(d[0])}`)
// 		.text(d => d[1])

// 	// interactive
// 	const in_dict = data_dict.map(d => d.taxid) // list of taxids in dict
// 	const existing = bodyRows.filter(d => in_dict.includes(d.species_taxid)) // rows for those taxids

// 	// make pointer
// 	const mover = function() {
// 		d3.select(this)
// 			.style("cursor", "pointer");
// 	}
// 	// on mouse out restore defaults
// 	const mout = function() {
// 		d3.select(this)
// 			.style("cursor", "default");
// 	}
// 	// on click call pop up
// 	const mclick = function(){
// 		getTop = el => el.offsetTop + (el.offsetParent && getTop(el.offsetParent))
// 		pop_up(data_dict,'taxid', this.getAttribute("value"), getTop(this))
// 	}
// 	existing.on("mouseover", mover).on("mouseout", mout).on('click', mclick);
// }
