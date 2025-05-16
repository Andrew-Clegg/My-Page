
//global variables 
let deck = []
let balance = 1000
let wager = 0

let val_player = [[]]
let val_dealer = []

let hand_copy = val_player
let index = 0                       //index of split hand for card placement

let hand_player = []
let hand_dealer = []
let lastwager = 0


function CreateDeck(){   
    for (let suit=0; suit < 4; suit++){      //suits 0 - clubs   1 - Spades  2 - Hearts  3 - Diamonds   
        for (let i=1; i<=13;i++){
            deck.push([suit, i])
        }
    }           //deck is now a 52 length 2d array of [suit,  number] ie [1,13] is King of Spades

    //shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

}

function FindSuit(suit){
    switch(suit){
        case 0:
            return 'clubs'
            break;
        case 1:
            return 'spades'
            break;
        case 2:
            return 'hearts'
            break;
        case 3:
            return 'diamonds'
            break;

        default:
            return 'diamonds'
    }

}

function FindCard(id){
    return "/images/PNG-cards-1.3/" + id[1] + "_of_" + FindSuit(id[0]) + ".png"
}

function CardValue(val){
    //returns the number value assigned to each card: Aces default 11
    switch(val){
        case 11:
            return 10
            break
        case 12:
            return 10
            break
        case 13:
            return 10
            break

        case 1:
            return 11
            break
            
        default:
            return val
            break
    }
}

function DealPlayer(player){
    //deals a card to player or dealer. Expected input either 'player', 'dealer hide', or 'dealer'
    let hand                                        //location to place cards
    let img = document.createElement('img')         //card img
    let next = deck.pop()                           //value of card off deck

    console.log(player+ " has " + next)

    if(player=='player') {
        hand =  document.getElementById('playerhand')
        hand_player.push(next)
        val_player[0].push(CardValue(next[1]))
        hand_copy = val_player
    }
    else{
        hand =  document.getElementById('dealerhand')
        hand_dealer.push(next)
        val_dealer.push(CardValue(next[1]))
    }

                
    hand.appendChild(img)               //show card
    CheckBust(player,0)                  //count total

    if(player=='dealer hide'){                  //find card image
        img.src='/images/card_back.png'
        img.id = 'hidden-card'
        document.getElementById('dealervalue').textContent = (Sum(val_dealer)- CardValue(next[1]))
        document.getElementById('dealervalue').style='color:white;' 
    } else{
        img.src = FindCard(next)
    }
}

function DealSplit(){
    //when split is called, clear cards and replace correctly
    ClearDiv(document.getElementById('playerhand'))

    let hands = document.getElementById('splithand')    //div containing card locations
    hands.className = 'row'
                 
    var hand = document.createElement('div')            //spots for hand 1 and hand 2
    let hand2 = document.createElement('div')
    hands.appendChild(hand)
    hands.appendChild(hand2)

    let card = document.createElement('img')
    let card2 = document.createElement('img')
    
    hand.appendChild(card)                          //hand 1 first card
    hand.className= 'col'
    card.src = FindCard(hand_player[0])
    card.className = 'cards'
    hand_copy[0].push(hand_player[0])               

    hand2.appendChild(card2)  
    card2.className = 'cards'  
    hand2.className='col'                    //hand 2 
    card2.src = FindCard(hand_player[1])
    hand_copy[1].push(hand_player[1])
    
    

    //get hit/stand/double/(split?) for first hand
    
    //then second hand

    //then dealer turn
    document.getElementById('hit-buttons').className = 'disabled'
    document.getElementById('split-buttons').className=' ' //set classnames

}

function SplitHit(hands){
    // thru hands until bust/stand each

    if(hand_copy.length > 0){       //go thru copy of active hands, hit until stand or bust then delete from copy
        if(Sum(hand_copy[0]) < 21){ //hit
            let next = deck.pop()
            let card = document.createElement('img')
            card.src = FindCard(next)
            card.className='cards'

            hand_copy[0].push(CardValue(next[1]))       //add card

            document.getElementById('splithand').children[index].appendChild(card)

        } else if(Sum(hand_copy[0]) == 21){SplitStand()}
        else{
            hand_copy.splice(0,1)           //remove first hand
            index++
        }
    }
    
}

function SplitStand(){
    if(hand_copy.length > 0){
        hand_copy.splice(0,1)           //remove first hand
        index++
    } else{
        Stand()
    }
}

function StartGame(){
    SetBalance(balance)

    if(deck.length ==0){
        CreateDeck()                //4 decks
        CreateDeck()
        CreateDeck()
        CreateDeck()
    }

    NewDeal()
}
    

function NewDeal(){
    lastwager = wager
    //enable hit or stand buttons
    document.getElementById('hit-buttons').className='row g-1'
    
    //disable newgame button
    document.getElementById('newhand').className='invisible'                        //to undo className='rounded border'
    document.getElementById('newdeal').className='invisible'

    //disable more betting

    document.getElementById('token-slot').className = 'row g-1 disabled'            //row g-1 to undo
    document.getElementById('clear-wager').className = 'board-button disabled'

    DealPlayer('player')
    DealPlayer('dealer')
    DealPlayer('player')
    DealPlayer('dealer hide')

    if (Sum(val_player[0]) == 21){
        EndHand('player 21')
    }
    else if(Sum(val_dealer) == 21){
        Stand()
        EndHand('dealer 21')
        
    } else if (Sum(val_dealer) <=16){
    }
}

function ResetDeal(){
    //clear gameboard and allow rebets before redeal
    //clear any cards
    ClearDiv(document.getElementById('playerhand'))
    ClearDiv(document.getElementById('dealerhand'))
    val_player = [[]]
    val_dealer = []
    hand_player = []
    hand_dealer = []
    
    document.getElementById('win-label').textContent=""
    document.getElementById('newdeal').className='invisible'

    //re enable betting
    document.getElementById('token-slot').className = 'row g-1'
    document.getElementById('clear-wager').className = 'board-button'
    document.getElementById('newhand').className='rounded border'  
    
    //number colours
    document.getElementById('dealervalue').style='color:white'
    document.getElementById('dealervalue').textContent = ""

    document.getElementById('playervalue').textContent = ""
    document.getElementById('playervalue').style='color:white'
}


function Hit(){
    DealPlayer('player')

    if(Sum(val_player[0]) > 21){        //busted
        Stand()
        EndHand('player bust')
    }
    else if(Sum(val_player[0]) < 21){document.getElementById('playervalue').style="color:white;"}

    if (hand_player.length > 4){
        document.getElementById('playerhand').style ='left:20%; height: 150px;'
    } else{
        document.getElementById('playerhand').style ='left:40%; height: 190px;'
    }
}

function Stand(){
    //disable buttons
    document.getElementById('hit-buttons').className='invisible'        //row g-1 to undo

    wait(0.25).then(()=> {
        document.getElementById('hidden-card').src= FindCard(hand_dealer[1])    //flip dealer card
        AddtoTotal('dealer')
    });

    //Start dealers turn
    DealerTurn()
}

function Split(){
    if(val_player[0][0] == val_player[0][1] && val_player[0].length==2){
        //move cards to seperate divs, then hit first then hit second
        DealSplit()
    }
}

function Double(){
    if(val_player[0].length==2){
        AddWager(wager)
        DealPlayer('player')
        Stand()
    }
}

/*async function HitDealer(){
    if(Sum(val_dealer) <=16){
        wait(1).then(() => {                                                        //should be done recursively..?
            DealPlayer('dealer')

            if(Sum(val_dealer) <=16){
                wait(1).then(() => {
                    DealPlayer('dealer')
        
                    if(Sum(val_dealer) <=16){
                        DealPlayer('dealer')
                    }
                    if(Sum(val_dealer) > 21){       //dealer busts
                        document.getElementById('win-label').textContent="Dealer Busted. You Win."
                    }
                });
            }
            if(Sum(val_dealer) > 21){       //dealer busts
                document.getElementById('win-label').textContent="Dealer Busted. You Win."
            }
        });
    }
}
*/
async function DealerTurn(){
    if(Sum(val_player[0]) < 22){
        while (Sum(val_dealer) <= 16) {
            await wait(1);
            console.log('dealer has '+val_dealer+" so we hit..")
            DealPlayer('dealer')

            if (hand_dealer.length > 4){
                document.getElementById('dealerhand').style ='left:15%;top:60px; height: 150px;'
            } else{
                document.getElementById('dealerhand').style ='left:40%; height: 190px;'
            }
        }
    }
    if(Sum(val_dealer) > 21){       //dealer busts
        EndHand('dealer bust')
    } 
    else if (Sum(val_dealer) ==  Sum(val_player[0])){                  //push
        EndHand('push')
    }
    else if(Sum(val_dealer) >  Sum(val_player[0])){        //dealer wins no bust
        EndHand('dealer')
    }
    else if(Sum(val_dealer) <  Sum(val_player[0])){        //dealer wins no bust
        EndHand('player')
    }

    wager = 0
    ClearWager()
}

function CheckBust(player,i){
    if(player=='player'){
        if(Sum(val_player[i]) > 21){
            if(val_player[i].includes(11)){            //check aces
                val_player[i][val_player[i].indexOf(11)] = 1
            }
            document.getElementById('playervalue').style="color:red;"
        } 
        else if(Sum(val_player[i]) == 21){document.getElementById('playervalue').style="color:limegreen;"}
       
    } 
    else {
        if(Sum(val_dealer) > 21){
            if(val_dealer.includes(11)){            //check aces
                val_dealer[val_dealer.indexOf(11)] = 1
            }
            document.getElementById('dealervalue').style="color:red;"
        } else if(Sum(val_dealer) == 21){document.getElementById('dealervalue').style="color:limegreen;"}
       
    }
    AddtoTotal(player)
}


function AddtoTotal(player){
    //adds card value to persons total and displays
    
    if(player=='player'){
        document.getElementById('playervalue').textContent = Sum(val_player[0])
    }

    else{ document.getElementById('dealervalue').textContent = Sum(val_dealer)}
}

function Sum(array){
    return array.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0); 

}

function EndHand(end){
    //Set win-label and handle wager payouts
    let win = null

    //enable/disable stuff
    document.getElementById('newdeal').className="game-text"

    if(end=='dealer 21'){
        document.getElementById('win-label').textContent="BlackJack! Dealer Wins."
        SetBalance(balance)
    }
    else if(end=='dealer bust'){
        document.getElementById('win-label').textContent="Dealer Busted. You Win."
        SetBalance(balance += wager*2)          //pay  bets
    }
    else if(end=='player 21'){
        document.getElementById('win-label').textContent="BlackJack! You Win."
        SetBalance(balance += wager*2)          //pay  bets
    }
    else if(end=='player bust'){
        document.getElementById('win-label').textContent="You Busted. Dealer Wins."
        SetBalance(balance)
    }
    else if(end=='player'){
        document.getElementById('win-label').textContent="You Win."
        SetBalance(balance += wager*2)          //pay  bets
    } 
    else if(end=='dealer'){
        document.getElementById('win-label').textContent="Dealer Wins."
        SetBalance(balance)
    }
    else if(end=='push'){
        document.getElementById('win-label').textContent="Push."
        SetBalance(balance += wager)

    }
    
}
    
function AddWager(bet){
    if(balance > 0){
        document.getElementById("wager").textContent ="$" + (wager+=bet)
        SetBalance(balance-bet)
    }
    
}
function AllIn(){
    AddWager(balance)
}
function Rebet(){
    wager = 0
    AddWager(lastwager)
}

function ClearWager(){
    SetBalance(balance+=wager)
    document.getElementById("wager").textContent ="$" + (wager-=wager)
}
function SetBalance(num){ 
    document.getElementById('balance').textContent='$' + num
    balance = num
}

function wait(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}

function ClearDiv(div){         //clears cards
    while(div.firstChild){
        div.removeChild(div.firstChild)
    }
}

function BackHome (){
    console.log('ran')
    window.location.href = "/";
  }