var request = require('request');
var cheerio = require('cheerio');

function getTorneoStr(id){
    switch(id){
        case 1:
            return("2020CL&id=01_TO_Primera-A");
        case 2:
            return("2020CL&id=04_TO_Nacional-B");
        case 3:
            return("2020CL&id=08_TO_Primera-B");
    }
}

module.exports = {
    index: (req,res,next) => {
        console.log("indexxxxxxxx");
        res.json({
            status: "success",
            message: "okiii"
        });
    },
    getTop10: (req,res,next) => {
        request('http://www.lamfo.club/', (err,resp,body)=>{
            if(!err && resp.statusCode == 200){
                let $ = cheerio.load(body);
                let top10 = [];
                            
                let top10lamfo = $('.list-group-item');

                top10lamfo.each(function(i,el){
                    let manager = {};
                    let imagenes = [];
                
                    const imgs = $(this).find('img');
                    imgs.each(function(a,img){
                        imagenes.push(img.attribs.src);
                    });
                
                    manager = {
                        posicion: parseInt($(this).children().eq(1).html()), //posicion
                        nombre: $(this).children().eq(3).html(), //nombre
                        puntos: parseInt($(this).children().eq(4).text().split(' ', 1)), //puntos
                        imagenes
                    };
                
                    top10.push(manager);
                
                });
                res.json({
                    status: "success",
                    data: top10
                });

            } else {
                res.json({
                    status: "error",
                    message: "No se puede acceder a www.lamfo.club, preguntale a Gato o a Quintela qué mierda pasa"
                });
            }
        });
    },
    getPosiciones: (req,res,next) => {
        let torneo = parseInt(req.params.torneo);
        let torneoStr = getTorneoStr(torneo);

        request(`http://www.lamfo.club/competicion.php?temp=${torneoStr}`, (err,resp,body)=>{
            if(!err && resp.statusCode == 200){
                let $ = cheerio.load(body);
                let posiciones = [];
                let titulo = $('.page-title').children().text();

                let equipos = $('tbody').first().children('tr');
                
                equipos.each(function(i,el){
                    posiciones.push({
                        pos: parseInt($(this).children('td').eq(0).text()),
                        equipo: $(this).children('td').eq(1).text().trim(),
                        //pj: parseInt($(this).children('td').eq(2).text()),
                        pg: parseInt($(this).children('td').eq(3).text()),
                        pe: parseInt($(this).children('td').eq(4).text()),
                        pp: parseInt($(this).children('td').eq(5).text()),
                        dg: parseInt($(this).children('td').eq(8).text()),
                        pts: parseInt($(this).children('td').eq(9).text())
                    });
                });                
                res.json({
                    status: "success",
                    torneo: titulo,
                    data: posiciones
                });

            } else {
                res.json({
                    status: "error",
                    message: "No se puede acceder a www.lamfo.club, preguntale a Gato o a Quintela qué mierda pasa"
                });
            }
        });
    },
    getUltimaFecha: (req,res,next) => {
        let torneo = parseInt(req.params.torneo);
        let torneoStr = getTorneoStr(torneo);

        request(`http://www.lamfo.club/competicion.php?temp=${torneoStr}`, (err,resp,body)=>{
            if(!err && res.statusCode == 200){
                let $ = cheerio.load(body);
                
                let link = $('.page-content-wrap a').last().attr('href');
                        
                request(`http://www.lamfo.club/${link}`, (err2,res2,body2)=>{
                    if(!err2 && res2.statusCode == 200){
                        let $ = cheerio.load(body2);
                        let titulo = $('.page-title').children().text();
                        let resultados = [];
                        
                        let result = $('tbody tr');
                                                
                        let locales = result.find('.locres');
                        let visitantes = result.find('.visres');
                        let goles = result.find('.golres');
                        let escudos = result.find('img');
                        
                        for (let i = 0; i < locales.length ; i++){
                            resultados.push({
                                local: {
                                    escudo: escudos[i*2].attribs.src,
                                    nombre: locales.eq(i).html(),
                                    goles: goles.eq(i*2).html() ,
                                } ,
                                visitante: {
                                    escudo: escudos[i*2+1].attribs.src,
                                    nombre: visitantes.eq(i).html() ,
                                    goles: goles.eq(i*2+1).html(),
                                },
                            });
                        }              
                        res.json({
                            status: "success",
                            torneo: titulo,
                            data: resultados
                        });
                    } else {
                        res.json({
                            status: "error",
                            message: "No se puede acceder a www.lamfo.club, preguntale a Gato o a Quintela qué mierda pasa"
                        });  
                    }
                });
            } else {
                res.json({
                    status: "error",
                    message: "No se puede acceder a www.lamfo.club, preguntale a Gato o a Quintela qué mierda pasa"
                });
            }
        });
    },
}