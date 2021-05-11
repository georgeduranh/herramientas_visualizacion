//Cargue de datos
d3.json("../evolucion_del_paro_sexo_y_general.json").then(function(datos) {
    console.log ("Datos cargados")    
  
	//Preparación de datos totales para gráfica lineal.
    var datosUnificados = datosTotales (datos.Datos.Metricas[2].Datos)
	datosTotal = (datosUnificados)


    //console.log(datosUnificados)

		
	//Preparación de datos por categoría para gráfica de barras.
	var datosCategoria = []
    datos.Datos.Metricas.forEach(function(Metric) {
        Metric.Datos.forEach(function(Anio) {
            datosCategoria.push({
                categoria: Metric.Nombre,
                anio: Anio.Agno,
                valor: Anio.Valor,
                Periodo: Anio.Periodo,
                q: Anio.Periodo

            });
        });
    });
       

    console.log(datosCategoria)
	//Personalización de márgenes en el área de trabajo
	var margin = {top: 20, right: 40, bottom: 90, left: 40},
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

	//Creación de objeto SVG para el body
	var svg = d3.select("body")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
    
	//Creación y visualización del eje horizontal (X) para la gráfica lineal
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

    //Creación y visualización del eje vertical (Y) para la gráfica lineal
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
       .attr("stroke", "#69b3a2")
       .attr("stroke-width", 1.5)
       .attr("d", d3.line()
                    .x(function(d) { return x(d.Periodo) })		
                    .y(function(d) { return y(d.valor)})
            )
	
	//Creación del primer tooltip
    var Tooltip = d3.select("body")
                    .append("div")
                    .attr("class","tooltip")
    
    //Función para el primer tooltip cuando el cursor se posiciona sobre un punto del gráfico dejándolo demarcado
    var mouseover = function(d) {
        Tooltip.style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
	}
	
	//Función para el primer tootltip cuando el cursor se posiciona sobre un punto del gráfico mostrando la información
	var mousemove = function(d) {
        Tooltip.html("<p style='color:#022920;'>A&ntilde;o: "+d.anio+"<br/> <b>"+d.valor.toFixed(2)+"</b> % Desempleo <br/>"+d.Periodo+" </p>")				
               .style ("top", d3.event.pageY + 20 + "px")
               .style ("left", d3.event.pageX + 20 + "px")
               .transition()
               .style("opacity",1)
    }
    
    //Función para borrar el primer tooltip cuando el cursor se aleja
    var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
		d3.select(this)
		  .style("stroke", "none")
		  .style("opacity", 0.8)
    }
		
	//Adición de puntos a la linea para poder seleccionar más facilmente el año
	svg.append("g")
       .selectAll("dot")
       .data(datosTotal)
       .enter()
       .append("circle")
       .attr("cx", function(d) { return x(d.Periodo) } )
       .attr("cy", function(d) { return y(d.valor) } )
       .attr("r", 3)
       .attr("fill", "#69b3a2")
       .on("mouseover", mouseover)
       .on("mousemove", d => {
            pintarBarras(d.anio, d.q)
            mousemove(d)})
       .on("mouseleave", mouseleave);
		
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
    
    //Función para borrar el segundo tooltip cuando el cursor se aleja
	var mouseleave2 = function(d) {
        Tooltip2.style("opacity", 0)
		d3.select(this)
		  .style("stroke", "none")
		  .style("opacity", 0.8)
    }
	
	//Creación y visualización del eje horizontal (X) para la gráfica de barras
    var x = d3.scaleBand()
		      .range([ 0, width/2 -200])
		      .domain(datosCategoria.map(function(d) { return d.categoria; }))
		      .padding(0.3);
    
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
        .selectAll("text")
		.attr("transform", "translate(35,0)rotate(0)")
		.style("text-anchor", "end");            ;

	////Creación y visualización del eje vertical (Y) para la gráfica de barras
    var y = d3.scaleLinear()
		      .domain([0, d3.max(datosCategoria, function(d) { return +d.valor; })*1.15])
		      .range([ height, 0]);
    
    svg2.append("g")
	    .call(d3.axisLeft(y));
    
    svg2.append("text")
        .attr("x", -10)
        .attr("y",-8 )
        .text("%");
		  
	//Función que realiza la gráfica de barras secundaria recibiendo como para parámetro el año a filtrar
    function pintarBarras (vanio, vperiodo) {
        
        //Filtro de dataset con el año que se selecciona para pintar las barras
		datosFiltrados = datosCategoria.filter(function (d) { return (d.anio === vanio & d.q == vperiodo); });	

        console.log(datosFiltrados)

        //Creación de la gráfica de barras con el dataset del año seleccionado y actualización cuando se selecciona otro año
        var selection = svg2.selectAll("rect").data(datosFiltrados)
        
        selection.enter().append("rect")
                         .on("mouseover", mouseover2)
                         .on("mousemove", d => {mousemove2(d)})
                         .on("mouseleave", mouseleave2);
        
        selection.exit().transition().delay(100).duration(300).remove()
        
        selection.transition()
                 .duration(300)
                 .ease(d3.easeLinear)
                 .attr("x", function(d,i) { return x(d.categoria); })
			     .attr("y", function(d) { return y(d.valor); })
			     .attr("width", x.bandwidth())
			     .attr("height", function(d) { return height - y(d.valor); })
			     .attr("fill", "red")
    }
		
	//Función que nos permite totalizar datos
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


/* 
    var anosVector = [2002, 2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2021]

    for (var i = 0; i < anosVector.length; i++) {     
        
        var result = datosTotal.filter(word => datosTotal.Valor = anosVector[i]);
        console.log(result)
        

    }
 */

 

})  