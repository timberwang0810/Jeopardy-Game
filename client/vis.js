import * as d3 from "https://cdn.skypack.dev/d3@7";

import chosenGame from './test.json' assert {type: 'json'};

let isClickable = true;
let isHost = false;

const findSmall = (small, big, size) => {
    const len = big-small;
    const offset = (size-len)/2;
    return (small-offset)
}

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
        .attr('class', 'cell questionValue')
        .attr('category', d => d.category)
        .attr('value', '200')
        .text('$200')

    column.append('div')
        .attr('class', 'cell questionValue')
        .attr('category', d => d.category)
        .attr('value', '400')
        .text('$400')

    column.append('div')
        .attr('class', 'cell questionValue')
        .attr('category', d => d.category)
        .attr('value', '600')
        .text('$600')

    column.append('div')
        .attr('class', 'cell questionValue')
        .attr('category', d => d.category)
        .attr('value', '800')
        .text('$800')

    column.append('div')
        .attr('class', 'cell questionValue')
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
	//on click call up question
    
    let mclick;
    if(isHost){ // host
        mclick = function(){
            if (isClickable){
                const question = data.filter(d => d.category==this.getAttribute("category"))[0][this.getAttribute('value')].question
                d3.select('.textbox').html(question)
            }
        }
    } else { // contestant
        mclick = function(){
            if (isClickable){
                const elementLocation = this.getBoundingClientRect();
                const question = data.filter(d => d.category==this.getAttribute("category"))[0][this.getAttribute('value')].question
                // const myCell = d3.select(this);
                // myCell.html(question)
                // myCell.attr('class', 'cell question')
                const x = findSmall(elementLocation.left, elementLocation.right, 250)
                const ysmall = elementLocation.top
                const ybig = elementLocation.bottom
                pop_up(question, x, ysmall, ybig)
            }
        }
    }

    // on double click call up answer
    const dblclick = function(){
        if (isClickable){
            const answer = data.filter(d => d.category==this.getAttribute("category"))[0][this.getAttribute('value')].answer
            d3.select('.textbox').html(answer)
        }
	}
    const clear = function(){
        d3.select('.textbox').html('')
        const prev = d3.selectAll(".pop_svg_div") // clear if svg exists
        prev.remove();
    }

    d3.select('#clear').on('click', clear)

    const cells = d3.selectAll('.questionValue')


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


function pop_up(data, x, ysmall, ybig) {
    
    const prev = d3.selectAll(".pop_svg_div") // clear if svg exists
    prev.remove();

    const size = 250;

    // create svg div and svg
    const svg_div = d3.select('body') 
        .append("div")
        .attr("class", "pop_svg_div")


    const svg = svg_div.append("svg")
        .attr("class", "pop_svg")

    const margin = 20;

    const g = svg.append('g')
    // create group element g and move graph to the right and down to make margins
        .attr('transform', `translate(${margin},${margin})`);

    // tooltip text

    let lineHeight = 20

    // text wraps
    function wrap(text, width) {
        text.each(function() {
            let text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", 0)
                    .attr('fill', 'white');
                tspan.style('font-size', '18px')
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", 0)
                        .attr("y", y)
                        .attr('fill', 'white')
                        .attr("dy", ++lineNumber * lineHeight)
                        .text(word);
                    tspan.style('font-size', '18px')
            }
          }
        });
      }
      
    g
        .append("text")
        .attr("y", 10)
        .attr("class","js_popup-text")
        .text(data)
        .call(wrap, size-margin);

    const my_text = g.selectAll(".js_popup-text")

    const tspan_nodes = my_text.selectAll('tspan').nodes()
    
    const lowy = +(tspan_nodes[tspan_nodes.length-1].getAttribute("dy"))+(lineHeight*2)

    svg.attr("height", lowy)  

    const y = findSmall(ysmall, ybig, lowy)

    // style
    svg_div
        .style("height", lowy+"px")
        .style("width", size+"px")
        .style("top", y+'px')
        .style("left", x+'px')

    // TRANSITION

    // get parameters

    const questions = d3.selectAll('.questionValue').nodes()
    const firstBound = questions[0].getBoundingClientRect();
    const lastBound = questions[questions.length-1].getBoundingClientRect();
    const newTop = firstBound.top+10
    const newLeft = firstBound.left+10
    const newBottom = lastBound.bottom-15
    const newRight = lastBound.right-15
    const newHeight = newBottom-newTop;
    const newWidth = newRight - newLeft;



    const t = d3.transition()
        .duration(1000)
        .ease(d3.easeLinear);

    svg_div.transition(t).delay(500)
        .style("height", newHeight+"px")
        .style("width", newWidth+"px")
        .style("top", newTop+'px')
        .style("left", newLeft+'px') 
        
    svg.transition(t).delay(500)
        .attr("height", newHeight+"px") 
        .attr("width", newWidth+"px")

    const tspans = my_text.selectAll('tspan');

    tspans.transition(t).delay(500).style('font-size', '54px');

}