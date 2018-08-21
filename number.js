module=module.exports={};

module.game=function(host,server){
	this.server=server;
	this.game=7;
	this.players=[host];
	this.min=2;
	this.max=2;
	this.status='open';
	this.playfield=[0,0];
};

module.game.prototype.join=function(player,users){
	this.players.push(player);
};

module.game.prototype.start=function(users){
	this.status='playing';
	return("```\nOn your turn, post a number in `s. Whoever says the largest number wins!\nexample: `5`\n```");
};

module.game.prototype.action=function(m,player,users,games,openGames){
	console.log(this.playfield);
	var val=parseFloat(m);
	if(val&&!this.playfield[this.players.indexOf(player)]){
		this.playfield[this.players.indexOf(player)]=val;
	}
	else{
		if(this.playfield[this.players.indexOf(player)]){
			return("You already went with "+this.playfield[this.players.indexOf(player)]);
		}
		return('Must be a number');
	}
	if(this.playfield[0]&&this.playfield[1]){
		var txt='';
		if(this.playfield[0]>this.playfield[1]){
			txt='<@'+this.players[0]+'> won $'+(this.buyIn>0?this.pot:1);
			users[this.players[0]].won++;
			users[this.players[0]].bank+=this.buyIn>0?this.pot:1;
			users[this.players[1]].lost++;
		}
		else if(this.playfield[0]==this.playfield[1]){
			txt='It was a tie!';
			users[this.players[0]].tied++;
			users[this.players[0]].bank+=this.buyIn;
			users[this.players[1]].tied++;
			users[this.players[1]].bank+=this.buyIn;
		}
		else{
			txt='<@'+this.players[1]+'> won $'+(this.buyIn>0?this.pot:1);
			users[this.players[1]].won++;
			users[this.players[1]].bank+=this.buyIn>0?this.pot:1;
			users[this.players[0]].lost++;
		}
		users[this.players[0]].played++;
		users[this.players[1]].played++;
		delete users[this.players[0]].current[this.server];
		delete users[this.players[1]].current[this.server];
		delete games[this.server][this.players[0]];
		return(txt);
	}
	return("Nice! You're going with "+this.playfield[this.players.indexOf(player)]);
};

module.game.prototype.quit=function(player,users,games,openGames){
	if(this.status==='open'){
		delete openGames[this.server][this.players[0]];
		delete users[player].current[this.server];
		users[player].bank+=this.buyIn>0?this.pot:1;
		delete games[this.server][this.players[0]];
		return('You have terminated your game of Number.');
	}
	for(let i=0;i<2;i++){
		if(this.players[i]===player){
			users[this.players[i]].quit++;
		}
		else{
			users[this.players[i]].won++;
			users[this.players[i]].bank+=this.buyIn>0?this.pot:1;
		}
		users[this.players[i]].played++;
		delete users[this.players[i]].current[this.server];
	}
	delete games[this.server][this.players[0]];
	return('You have forfieted the game of Number.');
};

