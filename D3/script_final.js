//Cargue de datos
d3.json("https://raw.githubusercontent.com/JLeon42/Herramientas-de-Visualizacion/main/evolucion_del_paro_sexo_y_general.json").then(function(datos) {
    console.log ("Datos cargados")    
  
	//Preparación de datos totales para gráfica lineal, se ecoge el ID 2 pues este contiene la información del desempleo general 
    var datosUnificados = datosTotales (datos.Datos.Metricas[2].Datos)
	datosTotal = (datosUnificados)

		
	//Preparación de datos por categoría (hombres, mujeres y total) para gráfica de barras.
	var datosCategoria = []
    datos.Datos.Metricas.forEach(function(Metric) {
        Metric.Datos.forEach(function(Anio) {
            datosCategoria.push({
                categoria: Metric.Nombre,
                anio: Anio.Agno,
                valor: Anio.Valor,
                Periodo: Anio.Periodo,  // se modificará a perioto+trimestre 
                q: Anio.Periodo  // se duplica el periodo para filtrarlo posteriormente

            });
        });
    });
       

    //Margenes de la visualización 
	var margin = {top: 50, right: 40, bottom: 90, left: 40},
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    /************* Gráfica 1 *************************** */

	//Creación de objeto SVG para el body
	var svg = d3.select("body")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
    
	//Creación y visualización del eje x  para la gráfica lineal (Gráfica 1)
    var rango = []

    for ( i =0; i< 77; i++){

        rango.push(i*(width/70))
    }
    
    var x = d3.scaleOrdinal()
              .domain(datosTotal.map( function (d) { return d.Periodo; } ))
              .range(rango);
	
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x))
       .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

    //Creación y visualización del eje Y para la gráfica lineal (Gráfica 1)
    var y = d3.scaleLinear()
              .domain([0, d3.max(datosTotal, function(d) { return +d.valor; })])
              .range([ height, 0 ]); 
    
	svg.append("g")
       .call(d3.axisLeft(y));
    
    svg.append("text")
       .attr("x",-10)
       .attr("y",-8)
       .text("%");
    

      
    //Creación de gráfica lineal
    svg.append("path")	
       .datum(datosTotal)	  
       .attr("fill", "none")
    //***COLOR DE LA LINEA
       .attr("stroke", "#d44141")
       .attr("stroke-width", 2)
       .attr("d", d3.line()
                    .x(function(d) { return x(d.Periodo) })		
                    .y(function(d) { return y(d.valor)})
            )
    
        
    /*** Linea vertical  de la crisis de 2008 ***/

        var container = svg.append("g")
            .attr("class", "espanya")

        var lespanya = container
            .append("line")
            .attr("class", "line")
            .style("stroke-width", 2)
            .style("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))
            .style("fill", "none");

        var text = container
         .append("text")
         .attr("x", 325)
         .attr("y", 300)
         .text("Crisis financiera de 2008")
         .attr("fill", "rgb(110, 124, 124)")
                


         var marker = svg.append("line")
            .attr("x1", 300)
            .attr("y1", 0)
            .attr("x2", 300)
            .attr("y2", 360)
            .attr("stroke-width", 1)
            .attr("stroke", "rgb(106, 121, 121)");


     /*** Linea vertical  de la  Covid 19 ***/

        var container = svg.append("g")
            .attr("class", "espanya")

        var lespanya = container
            .append("line")
            .attr("class", "line")
            .style("stroke-width", 2)
            .style("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))
            .style("fill", "none");

        var text = container
            .append("text")
            .attr("x", 980)
            .attr("y", 300)
            .text("Covid 19")
            .attr("fill", "rgb(110, 124, 124)")
            

        var marker = svg.append("line")
            .attr("x1", 1050)
            .attr("y1", 0)
            .attr("x2", 1050)
            .attr("y2", 360)
            .attr("stroke-width", 1)
            .attr("stroke", "rgb(106, 121, 121)");


            

	
	//Creación del primer tooltip (gráfica 1)
    var Tooltip = d3.select("body")
                    .append("div")
                    .attr("class","tooltip")
    
    //Función para el primer tooltip cuando el cursor se posiciona sobre un punto del gráfico lineal dejándolo demarcado
    var mouseover = function(d) {
        Tooltip.style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
	}
	
	//Función para el primer tootltip cuando el cursor se posiciona sobre un punto del gráfico lineal mostrando la información
	var mousemove = function(d) {
        Tooltip.html("<p style='color:#022920;'>A&ntilde;o: "+d.anio+"<br/> <b>"+d.valor.toFixed(2)+"</b> % Desempleo <br/>"+d.Periodo+" </p>")				
               .style ("top", d3.event.pageY + 20 + "px")
               .style ("left", d3.event.pageX + 20 + "px")
               .transition()
               .style("opacity",1)
    }
    
    //Función para borrar el primer tooltip cuando el cursor se aleja del punto 
    var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
		d3.select(this)
		  .style("stroke", "none")
		  .style("opacity", 0.8)
    }
		
	//Adición de puntos a la gráfica lineal 
	svg.append("g")
       .selectAll("dot")
       .data(datosTotal)
       .enter()
       .append("circle")
       .attr("cx", function(d) { return x(d.Periodo) } )
       .attr("cy", function(d) { return y(d.valor) } )
       .attr("r", 3.2)
    //***COLOR DEL PUNTO
       .attr("fill", "rgb(110, 124, 124)")
       .on("mouseover", mouseover)
       .on("mousemove", d => {
            pintarBarras(d.anio, d.q)
            mousemove(d)})
       .on("mouseleave", mouseleave);

       
    //Título de Gráfico 1
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text("Tasa de Desempleo general");



     /**************** Grafica 2*********************************** */  
		
	//Creación de segundo SVG para la gráfica de barras
    var svg2 = d3.select("body")
                 .append("svg")
		         .attr("width", width/2 + margin.left + margin.right-200)
		         .attr("height", height + margin.top + margin.bottom)
	             .append("g")
		         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Creación del segundo tooltip
    var Tooltip2 = d3.select("body")
                     .append("div")
                     .attr("class","tooltip")
    
    //Función para el segundo tooltip cuando el cursor se posiciona sobre una barra del gráfico dejándolo demarcado
    var mouseover2 = function(d) {
        Tooltip2.style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
    }
	
	//Función para el segundo tootltip cuando el cursor se posiciona sobre un punto del gráfico mostrando la información
    var mousemove2 = function(d) {
        Tooltip2.html("<p style='color:#022920;'>A&ntilde;o: "+d.anio+"<br/> <b>"+d.valor.toFixed(2)+"</b> % Desempleo <br/> "+d.q+"</p> ")				
				.style ("top", d3.event.pageY + 20 + "px")
				.style ("left", d3.event.pageX + 20 + "px")
				.transition()
				.style("opacity",1)
	  }
    
    //Función para borrar el segundo tooltip cuando el cursor se aleja del punto 
	var mouseleave2 = function(d) {
        Tooltip2.style("opacity", 0)
		d3.select(this)
		  .style("stroke", "none")
		  .style("opacity", 0.8)
    }

	
	//Creación y visualización del eje X para la gráfica de barras (grafica 2)
    var x = d3.scaleBand()
		      .range([ 0, width/2 -200])
		      .domain(datosCategoria.map(function(d) { return d.categoria; }))
		      .padding(0.3);
    
     svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
        .selectAll("text")
		.attr("transform", "translate(35,0)rotate(0)")
		.style("text-anchor", "end");            

	//Creación y visualización del eje Y para la gráfica de barras (gráfica 2)
    var y = d3.scaleLinear()
		      .domain([0, d3.max(datosCategoria, function(d) { return +d.valor; })*1.15])
		      .range([ height, 0]);
    
    svg2.append("g")
	    .call(d3.axisLeft(y));
    
    svg2.append("text")
        .attr("x", -10)
        .attr("y",-8 )
        .text("%");

    //Título de Gráfico 2
    svg2.append("text")
       .attr("x", (width/6))             
       .attr("y", 0 - (margin.top / 2))
       .attr("text-anchor", "middle")  
       .style("font-size", "20px") 
       .style("text-decoration", "underline")  
       .text("Tasa de Desempleo por género");


    
    //Fuentes  de datos 

    svg2.append("text")
        .attr("x", (80))             
        .attr("y", height+80)
        
        .style("font-size", "15px") 
        .text("Fuente: https://www.epdata.es");
    


    // ****** Funciones ******* //
		  
	//Función que realiza la gráfica de barras por genero recibiendo como para parámetros  el año y el periodo.
    function pintarBarras (vanio, vperiodo) {
        
        //Filtro de dataset con el año y periodo que se selecciona para pintar las barras por generos
		datosFiltrados = datosCategoria.filter(function (d) { return (d.anio === vanio & d.q == vperiodo); });	

        console.log(datosFiltrados)

        //Creación de la gráfica de barras con el dataset del año seleccionado y periodo  
        var selection = svg2.selectAll("rect").data(datosFiltrados)
        
        selection.enter().append("rect")
                         .on("mouseover", mouseover2)
                         .on("mousemove", d => {mousemove2(d)})
                         .on("mouseleave", mouseleave2);
        
        selection.exit().transition().delay(100).duration(300).remove()
        
             
        selection.transition()
                 .duration(300)
        //Modelo de Transicion *REBOTE*
                 .ease(d3.easeBounce)
                 .duration(1200)
                 .attr("x", function(d,i) { return x(d.categoria); })
			     .attr("y", function(d) { return y(d.valor); })
			     .attr("width", x.bandwidth())
			     .attr("height", function(d) { return height - y(d.valor); })
                //***COLOR DE GRAFICO DE BARRAS
			     .attr("fill", "rgb(106, 121, 121)")
               
    }
		
	//Función que nos permite extraer modificar el periodo para hacerlo trimestrar y crear una variable q que permite mantener el periodo. 
	function datosTotales(datosDesempleo){
        var resultados=[]
        datosDesempleo.forEach(UnificarDatos)
        
        //Función que nos permite recorrer los datos
        function UnificarDatos(item, index, arr) {
            var resultado = datosDesempleo.find(d => (d.Parametro==item.Parametro ));
            
            var datos = {
                anio: item.Agno,
                Periodo: item.Agno+"-"+item.Periodo,
                valor: item.Valor,
                q : item.Periodo,
            }
            

            resultados.push(datos)
        }
        console.log("resultados")
        console.log(resultados)
        return resultados
    } 

    

})  
