const w = 0

const deck=['AS','2S','3S','4S','5S','6S','7S','8S','9S','10S','JS','QS','KS','AH','2H','3H','4H','5H','6H','7H','8H','9H','10H','JH','QH','KH','AD','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD','AC','2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC'];

function shuffleDeck(deck) {
    return deck.sort( ()=>Math.random()-0.5 );
}

shuffleDeck(deck);

// no_of_players
// let n = 6; 
let n = Number(prompt("Please Enter No. of Players", 5));

let player_cards = [];  

for (let i = 0; i < n; i++) {
    player_cards[i] = [deck[i],deck[n+i]];
}

let community_cards = [deck[2*n+1], deck[2*n+2], deck[2*n+3], deck[2*n+5], deck[2*n+7]];
// let community_cards = ['AS', 'AC', 'AD', 'AH', 'KS'];

function flop() {
    document.getElementById("cc").children[0].src = `./cards/${community_cards[0]}.svg`;
    document.getElementById("cc").children[1].src = `./cards/${community_cards[1]}.svg`;
    document.getElementById("cc").children[2].src = `./cards/${community_cards[2]}.svg`;
}

function turn() {
    document.getElementById("cc").children[3].src = `./cards/${community_cards[3]}.svg`;
}

function river() {
    document.getElementById("cc").children[4].src = `./cards/${community_cards[4]}.svg`;
}

for (let i = 0; i < player_cards.length; i++) {
    
    let p = document.createElement("p");
    p.innerHTML = `Player ${i+1}`;

    let img1 = document.createElement("img");
    img1.src = './cards/BB.svg';

    let img2 = document.createElement("img");
    img2.src = './cards/BB.svg';

    let ele = document.createElement("div");
    // ele.id = `p${i+1}`;
    ele.className = 'p';
    ele.appendChild(p);
    ele.appendChild(img1);
    ele.appendChild(img2);
    
    document.getElementById("pc").appendChild(ele);
}

function show() {
    ele = document.getElementsByClassName("p")
    for (let i = 0; i < ele.length; i++) {
        ele[i].getElementsByTagName("img")[0].src = `./cards/${player_cards[i][0]}.svg`
        ele[i].getElementsByTagName("img")[1].src = `./cards/${player_cards[i][1]}.svg`
    }
}

let cc = community_cards.join(',');

let pc = '';
for (let i = 0; i < n; i++) {
    pc+='&pc[]=' + player_cards[i].join(',');

}
console.log(pc);

let url = `https://api.pokerapi.dev/v1/winner/texas_holdem?cc=${cc}${pc}`

async function result() {
    const response = await fetch(url);
    const data = await response.json();  
    // console.log(player_cards);
    // console.log(data);

    let ele = document.getElementById("win");
    
    if (data.winners.length > 1) {
        let x = document.createElement("p");
        x.innerHTML=`No of Winners: ${data.winners.length}`;
        ele.appendChild(x);

        let y = document.createElement("p");
        y.innerHTML = `Winners: `;

        let z = document.createElement("p");

        console.log(player_cards);
        for (let i = 0; i < data.winners.length; i++) {
            let c = data.winners[i]["cards"];
            let ls = c.split(",");
            console.log(ls);

            let w = document.getElementsByClassName("p");

            for (let j = 0; j < player_cards.length; j++) {
                if(ls[0] == player_cards[j][0] && ls[1] == player_cards[j][1])
                {
                    y.innerHTML += `Player ${j+1}, ` ;
                    w[j].style.border = "5px solid yellow";
                    break;
                } 
            }    
            
            let r = data.winners[i]["result"];
            r = r.replaceAll('_', ' ');
            z.innerHTML = 'Hand: ' + r;
        }
        ele.appendChild(y);
        ele.appendChild(z);
    }
    else
    {
        let y = document.createElement("p");
        y.innerHTML = `Winner: `;
        let c = data.winners[0]["cards"];
        let ls = c.split(",");

        let w = document.getElementsByClassName("p")

        for (let j = 0; j < player_cards.length; j++) {
            if(ls[0] === player_cards[j][0] && ls[1] === player_cards[j][1])
            {
                y.innerHTML += `Player ${j+1}`;
                w[j].style.border = "5px solid yellow"
                break;
            } 
        }    
        ele.appendChild(y);

        let z = document.createElement("p");
        let r = data.winners[0]["result"];
        r = r.replaceAll('_', ' ');
        z.innerHTML = 'Hand: ' + r;
        ele.appendChild(z)

        let imgSet = document.createElement('div');
        imgSet.id = 'wimg';
        let hand = data.winners[0].hand.split(',');
        for (let i = 0; i < hand.length; i++) {
            let img = document.createElement("img");
            img.src = `./cards/${hand[i]}.svg`;
            imgSet.appendChild(img);
        }
        ele.appendChild(imgSet);
    }
}

document.getElementById('flop').onclick = flop;
document.getElementById('turn').onclick = turn;
document.getElementById('river').onclick = river;
document.getElementById('show').onclick = show;
document.getElementById('result').onclick = result;




// document.getElementById('turn').onclick = function() {
//     if (document.getElementById('flock').clicked == true) {
//         turn()
//     }
//     else
//     {
//         alert("flock -> turn -> river -> show -> result")
//     }
// };
// document.getElementById('river').onclick = function() {
//     if (document.getElementById('turn').clicked == true) {
//         river()
//     }
//     else
//     {
//         alert("flock -> turn -> river -> show -> result")
//     }
// };
// document.getElementById('show').onclick = function() {
//     if (document.getElementById('river').clicked == true) {
//         show()
//     }
//     else
//     {
//         alert("flock -> turn -> river -> show -> result")
//     }
// };
// document.getElementById('result').onclick = function() {
//     if (document.getElementById('show').clicked == true) {
//         result()
//     }
//     else
//     {
//         alert("flock -> turn -> river -> show -> result")
//     }
// };

// document.getElementById('river').onclick = river;
// document.getElementById('show').onclick = show;
// document.getElementById('result').onclick = result;

    // 1) Determining Winner

    // 0 1 2 3 4
    // # start distributing from the SB -> BB -> .. ... ... .. -> D
    // D => 0, S => 1, BB => 2, order => 1 2 3 4 0 
    // D => 1, S => 2, BB => 3, order => 2 3 4 0 1
    // D => 2, S => 3, BB => 4, order => 3 4 0 1 2
    // D => 3, S => 4, BB => 0, order => 4 0 1 2 3
    // D => 4, S => 0, BB => 1, order => 0 1 2 3 4

    // BB is double of SB 
    // raise should be double or more 

    // round start from left of the dealer i.e SB -> BB -> .. ... ... .. -> D

    // # dealer's right => small blind
    // # small blinds's right => big blind

    // 2) Player methods(check, call, raise(All-in), fold)
    // deal 2 cards to each player => hole card
    // community cards:
    //     first 3 cards => flock
    //     next 1 card => turn
    //     next 1 card => river
    // Burn't cards => 1) before flock, 2) before turn 3) before river

            