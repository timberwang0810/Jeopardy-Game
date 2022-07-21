import * as d3 from "https://cdn.skypack.dev/d3@7";

// import chosenGame from './test.json' assert {type: 'json'};

let isClickable = true;

export default function createTable(data){
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
        if (isClickable){
            d3.select(this)
                .style("cursor", "pointer");
        }
	}
	// on mouse out restore defaults
	const mout = function() {
		d3.select(this)
			.style("cursor", "default");
	}
	// on click call up question
	// const mclick = function(){
    //     if (isClickable){
    //         const question = data.filter(d => d.category==this.getAttribute("category"))[0][this.getAttribute('value')].question
    //         d3.select('.textbox').html(question)
    //     }
	// }
    // // on double click call up answer
    // const dblclick = function(){
    //     if (isClickable){
    //         const answer = data.filter(d => d.category==this.getAttribute("category"))[0][this.getAttribute('value')].answer
    //         d3.select('.textbox').html(answer)
    //     }
	// }
    // const clear = function(){
    //     d3.select('.textbox').html('')
    // }

    // d3.select('#clear').on('click', clear)

    const cells = d3.selectAll('.question')


    cells.on("mouseover", mover).on("mouseout", mout).on('click', mclick).on('dblclick', dblclick);
    

    const clickable = function(){
        isClickable = !isClickable

        const c = d3.select('.isClickable');
        c.text(' '+isClickable)
    }

    d3.select('#clickable').on('click', clickable)


}

createTable(chosenGame.game)

const players = ['Danny', 'Tim', 'Ved', 'Zhen', 'Max']

const playerBox = d3.select('.score-panel')

playerBox.selectAll('cells')
    .data(players)
    .enter()
    .append('div')
    .attr('class', 'cell flexvert')
    .attr('id', d => d) 


function updateMoney(playerID, money){
    const playerDiv = d3.select('#'+playerID);
    playerDiv.html('<text class="player">'+playerID+'</text><text class="money" value='+money+'>$'+money+'</text)')
}

for (let i=0; i<players.length; i++){
    updateMoney(players[i], 0)
}


const freeMoney = function(){
    for (let i=0; i<players.length; i++){
        let current = +d3.select('#'+players[i]).select('.money').attr('value')
        updateMoney(players[i], (current+200))
    }
}

d3.select('#freeMoney').on('click', freeMoney)


