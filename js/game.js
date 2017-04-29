/* by brakdag@gmail.com 
Uso de redes neuronales evolutivas para la implementación de la
función Xor*/

//*********************** Cuenta***********************************************
// modelo matemático que se desea aplicar algoritmo evolutivo.
//*****************************************************************************
var Cuenta = function(json){
this.x = Math.floor(Math.random()*2);
this.y = Math.floor(Math.random()*2);
this.z = 0;
this.story = [];
this.score = 0;
this.alive = true;
this.init(json);	
}

Cuenta.prototype.init = function(json)
{
for(var i in json)
	this[i] = json[i];
}

// si sigue viva la especie se actualiza a nuevos valores para nuevos desafíos.
Cuenta.prototype.update = function()
{
	this.story.push({x:this.x,y:this.y,z:this.z});
	this.score+=100;
	this.x=Math.floor(Math.random()*2);
	this.y=Math.floor(Math.random()*2);
}

// las especies que no cumplen con los requisitos mueren.
Cuenta.prototype.isdead = function()
{
if ((this.x + this.y) == this.z) return false
	else
	return true;
}

//**********************GAME*******************************************
// clase que genera una simulación
//*********************************************************************
var Game = function()
{
	this.canvas = document.querySelector("#tablero");
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;	
	this.generation = 0;
}

// start ocurre cuando una nueva generación se regenera.
Game.prototype.start = function()
{
	console.log(this);
this.generation++;
this.score = 0; 
this.tablero=[];
this.gen = Neuvol.nextGeneration();
	for (var i in this.gen)
		{
			var c = new Cuenta();
			this.tablero.push(c);
		}
this.alives= this.tablero.length;		
this.loop();
}

// El loop realiza el trabajo de calificar el funcionamiento de cada red neuronal.
Game.prototype.loop = function()
{						
    this.score++;
    for (var i in this.tablero) // repetir si esta dentro del tablero.
		if (this.tablero[i].alive == true) //siempre que este viva.
		{ 
			var inputs = [this.tablero[i].x,this.tablero[i].y]; // preparalas entradas para la red neuronal.
			var valor = this.gen[i].compute(inputs)[0]; // hace trabajar a la red neuronal.
			
			 if (valor < 0.5) {this.tablero[i].z =1;} else {this.tablero[i].z =0;}
			 
			 if (!this.tablero[i].isdead()) // si no está muerto.
					{	
						this.tablero[i].update();
					}
					else // si está muerto.
					{
					  this.tablero[i].alive = false; // no está vivo.
					  this.alives--; // uno menos.
					}						
		}

	
	
	if(!this.isItEnd()) // si aún todos no han muerto vuelve a ejecutar el código 
	{
		setTimeout(this.loop(),100);
		
	} 
    else 
    {
    	var poblacion_score =0;
    	for (var i in this.tablero)  {
    	Neuvol.networkScore(this.gen[i], this.tablero[i].score); // carga el puntaje de cada gen.
    	poblacion_score += this.tablero[i].score;
	    }
	    console.log(this.score + "," + poblacion_score);
	    this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.fillText("generación: " + this.generation, 10, 15);
	    this.ctx.fillText("puntaje:" + this.score, 10, 35);
    	
    } 	


}

// verifica si todas las individuos han muerto.
Game.prototype.isItEnd = function(){
	for(var i in this.tablero){
		if(this.tablero[i].alive){
			return false;
		}
	}
	return true;
}

//**********************************Código***************************************************
// comienzo del programa. Corresponde al codigo de ejecución de la aplicación. 
//Las anteriores son todas definiciones.

var Neuvol = new Neuroevolution({population:30,network:[2, [5], 1],eletism:0.01,mutationRate:0}); // crea la población
var g = new Game(); // Crea el entorno.
//for(var x=0;x<9;x++) // arranca el entorno.
g.start() // arranca el entorno.


