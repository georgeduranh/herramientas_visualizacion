// El siguiente script resuelve el siguiente problema de negocio: Crecimiento de las emisiones de CO2 en el mundo y cómo es la aportación según el tipo de economía
// El dataset se obtiene de epdata: https://www.epdata.es/evolucion-emisiones-co2-tipo-economia/5fdd49c1-dad8-4566-9588-ce19155ced6a
// La carga de datos se realiza a través de un repositorio github para su tratamiento

 var globalDatos =[]

//Carga de datos

d3.csv("https://raw.githubusercontent.com/JLeon42/Herramientas-de-Visualizacion/main/Datos4.csv")

//d3.dsv(";", "https://raw.githubusercontent.com/jduran2305/herramientas_visualizacion/main/desempleo_espana.csv")

//d3.dsv(";", "https://raw.githubusercontent.com/jduran2305/herramientas_visualizacion/main/datos_2.csv")
.then(function(datos) {
    console.log ("Datos cargados")    

    console.log(datos[0])

   
    //******** Gráfica 1************
    var height = 600
    var width = 900
    
    var margin  = {
        top: 40,
        botton: 50,
        left:40,
        right:50            
    }

   /*  var anosVector = [2002, 2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020]
    var datosAnos = []
    
    k = 0 
    j = 0
    var suma = 0
    for (var i = 0; i < 77; i++) {     
        
        if( j < 4){   
            suma = parseFloat(datos[i].tasa_paro) + suma
            j+=1
        }
        else{
            datosAnos[k]=suma/4
            suma =0
            j=0
            k+=1
            i-=1
        }
    }

    dictionaryAnos = {};

    for  (var i = 0; i < anosVector.length; i++) {   
        dictionaryAnos[i]={ "ano": String(anosVector[i]),
                             "tasaPromedio": String( datosAnos[i])}
    } 

    console.log(dictionaryAnos[0]) */

 
    /*** Creando la primera gráfica  */
    var elementosvg=d3.select ("body")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
    
     
    var escalaX = d3.scaleLinear()
        .domain ([2003, 2021])
        .range ([0 + margin.left, width - margin.right])
    
    
    var escalaY= d3.scaleLinear()
        //.domain (d3.extent(datos, d => d.tasa_paro))
        .domain ([0,35])
        .range ([height - margin.botton, 0 + margin.top])
    
    //******** Se crea el EJE X gráfica 1************
    var ejeX = d3.axisBottom (escalaX)    
    // PONER TICKS
        .ticks (21)        
    
           
    //Pintar eje X
    elementosvg
        .append("g")
        .attr("transform","translate (0," + (height - margin.botton+5) + ")")
        .call(ejeX)              


              
    //******** Se crea el EJE Y gráfica 1************
    var ejeY = d3.axisLeft (escalaY)
    
    //Pintar eje Y
    elementosvg
        //estas dos líneas antes del .call (ejeY). MUEVEN EL EJE 
        .append("g")
        .attr("transform","translate (" + margin.left + ",0)")
        .call(ejeY)
    

    //Grafica de lineas 
    
    elementosvg.append("path")	
       .datum(datos)	  
       .attr("fill", "none")
       .attr("stroke", "#69b3a2")
       .attr("stroke-width", 1.5)
       .attr("d", d3.line()
                    .x(function(d) { return escalaX(d.Periodo) })		
                    
                    .y(function(d) { return escalaY(d.Tada_de_paro)})
                    
            )


   	//Adición de puntos a la linea para poder seleccionar más facilmente el año
    elementosvg.append("g")
        .selectAll("dot")
        .data(datos)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return escalaX(d.Periodo) } )
        .attr("cy", function(d) { return escalaY(d.Tada_de_paro) } )
        .attr("r", 3)
        .attr("fill", "red")
    //.on("mouseover", mouseover)
    //.on("mousemove", d => {
    //     pintarBarras(d.ano)
    //     mousemove(d)})
    //.on("mouseleave", mouseleave);




    //Grafica 2 

    //******** Gráfica 2************
    var height2 = 600
    var width2 = 300
    
    var margin2  = {
        top: 40,
        botton: 50,
        left:40,
        right:50            
    }

    var elementosvg2=d3.select ("body")
        .append("svg")     
        .attr("width",width2)
        .attr("height",height2)


    var escalaX2 = d3.scaleLinear()
        .domain ([1, 4])
        .range ([0 + margin.left, width2 - margin.right])

      //******** Se crea el EJE X gráfica 1************
    var ejeX2 = d3.axisBottom (escalaX2)    
      // PONER TICKS
        .ticks (4)   
            
    //Pintar eje X
    elementosvg2
        .append("g")
        .attr("transform","translate (0," + (height2 - margin.botton+5) + ")")
        .call(ejeX2)              
    
    
     //Pintar eje Y
     elementosvg2
     //estas dos líneas antes del .call (ejeY). MUEVEN EL EJE 
        .append("g")
        .attr("transform","translate (" + margin.left + ",0)")
        .call(ejeY)

    
    
    elementosvg2.append("path")	
        .datum(datos)	  
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
                     .x(function(d) { return escalaX(d.Periodo) })		
                     
                     .y(function(d) { return escalaY(d.Tada_de_paro)})
                     
             )
 

    //Creación y visualización del eje horizontal (X) para la gráfica de barras
    var x = d3.scaleBand()
		      .range([ 0, width -200])
		      .domain(datosCategoria.map(function(d) { return d.categoria; }))
		      .padding(0.3);
    
        
    
      
   
 
})  