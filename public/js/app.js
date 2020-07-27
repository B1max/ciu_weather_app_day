let lista_tiempos =[];
window.addEventListener('load', async function(){
    await resApiHoy();
    await resApiFuturo();
    await cargar_datos();
    await cargar_fondo();
})
 

class tiempo {
    static date;
    static estado ;
    static icono_estado;
    static temp ;
    static temp_min ;
    static temp_max ;
    static humidity ;
    static pressure ;
    static wind_speed ;
    static sunrise ;
    static sunset ;
    static sunrise_original;
    static sunset_original;
    static dt;
}




function fecha_calculada(diasFuturos){
    let date = new Date();
    let fechaResultado = "";
    const strs_Dias = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const strs_Meses = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let dia_calc = date.getDay()+diasFuturos > 6 ? (date.getDay()+diasFuturos)-6 : date.getDay()+diasFuturos;
    fechaResultado += strs_Dias[dia_calc] + ", ";
    fechaResultado += date.getDate() + " ";
    fechaResultado += strs_Meses[date.getMonth()] + " ";
    fechaResultado += date.getFullYear()+"\n";
    fechaResultado += formatoHorario(date);
    return fechaResultado;
}




function fecha_calculada_corta(diasFuturos){
    let date = new Date();
    date.setDate(date.getDate()+diasFuturos);
    let fechaResultado = "";
    const strs_Dias = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    fechaResultado += strs_Dias[date.getDay()] + ", ";
    fechaResultado += date.getDate();
    return fechaResultado;
}




async function resApiHoy () { 
    await fetch("http://api.openweathermap.org/data/2.5/forecast?q=villa%20tesei,ar&cnt=1&appid=6ca77046e221612d6bc9fe0049aea0d3&units=metric")
    .then(res => {
        let resultado = res.json();
        return resultado;
    })
    .then(async (datas) => {
            let miTiempo = new tiempo();
            let data = datas.list[0];
            let estado = data.weather[0].main;
            let icono_estado = "url(http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png)"
            let temp = data.main.temp;
            let temp_min = data.main.temp_min;
            let temp_max = data.main.temp_max;
            let humidity = data.main.humidity ;
            let pressure = data.main.pressure ;
            let wind_speed = String(data.wind.speed ) + " km/h";
            let sunrise = datas.city.sunrise;
            let sunset = datas.city.sunset;
            let day_time = new Date(data.dt * 1000);
            miTiempo.estado = estado;
            miTiempo.icono_estado = icono_estado;
            miTiempo.temp = temp;
            miTiempo.temp_min = temp_min;
            miTiempo.temp_max = temp_max;
            miTiempo.humidity = humidity + "%";
            miTiempo.pressure = pressure + " mBar";
            miTiempo.wind_speed = wind_speed;
            miTiempo.sunrise = formatoHorario(new Date(sunrise *1000));
            miTiempo.sunrise_original = sunrise;
            miTiempo.sunset = formatoHorario(new Date(sunset * 1000));
            miTiempo.sunset_original = sunset;
            miTiempo.dt = String(day_time.getHours()) + "h " + String(day_time.getMinutes()) + "m";
            lista_tiempos.push(miTiempo);
    })
    .catch(error=>{
        if(error!=null){
            console.log(error);
        }
    })
}




async function resApiFuturo () { 
    await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=-34.5708&lon=-58.6243&exclude=current,hourly&appid=6ca77046e221612d6bc9fe0049aea0d3&units=metric")
    .then(res => {
        let resultado = res.json();
        return resultado;
    })
    .then(async (datas) => {
        console.log("dias traidos "+datas.daily.length);
            for(let i = 0; i < datas.daily.length;i++){
                let miTiempo = new tiempo();
                let data = datas.daily[i];
                let icono_estado = "url(http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png)";
                let temp = data.temp;
                let temp_min = data.temp.min;
                let temp_max = data.temp.max;
                miTiempo.icono_estado = icono_estado;
                miTiempo.temp = temp;
                miTiempo.temp_min = temp_min;
                miTiempo.temp_max = temp_max;
                lista_tiempos.push(miTiempo);
            }
    })
    .catch(error=>{
        if(error!=null){
            console.log(error);
        }
    })
}




function formatoHorario(hora){
    let resultado = "";
    let _hora = hora.getHours();
    let _minuto = hora.getMinutes();
    resultado = (_hora > 12 ? _hora-12 : _hora)+":" ;
    resultado += _minuto < 10 ? "0" + _minuto: _minuto;
    resultado += _hora > 12 ? "PM" : "AM";
    return resultado;
}




function contentDiv(id,contenido){
    try {
        document.getElementById(id).textContent = contenido;
    } catch (error) {
        console.log("Ocurrio un error cargando contenido -> "+error);
    }
}




function cargar_datos(){
    for(let i = 0;i<lista_tiempos.length;i++){
        console.log("lista de->"+lista_tiempos.length);
        if(i==0){
            contentDiv("date",fecha_calculada(0));
            document.getElementById("icono_estado").style.backgroundImage = lista_tiempos[0].icono_estado;
            contentDiv("estado",lista_tiempos[0].estado);
            contentDiv("temperature",String(Math.round(lista_tiempos[0].temp)));
            contentDiv("main_temp_max",String(Math.round(lista_tiempos[0].temp_max)) + "°C");
            contentDiv("main_temp_min",String(Math.round(lista_tiempos[0].temp_min)) + "°C");
            contentDiv("humidity_data",lista_tiempos[0].humidity);
            contentDiv("pressure_data", lista_tiempos[0].pressure);
            contentDiv("wind_data",lista_tiempos[0].wind_speed);
            contentDiv("sunrise_data",lista_tiempos[0].sunrise);
            contentDiv("sunset_data",lista_tiempos[0].sunset);
            contentDiv("dayTime_data", lista_tiempos[0].dt);
        }else{
            cargarDiaExtra(i,lista_tiempos[i]);
        }
    }
}




function cargarDiaExtra(strDia,tiempox){
    let myString = "<div id='day"+strDia+"' class='another_day' style='left: "+(115*(strDia-1))+"px;'>"+
    "<div id='another_day_icon"+strDia+"' class='another_day_icon' ></div>"+
    "<div id='another_day_date"+strDia+"' class='another_day_date'>"+fecha_calculada_corta(strDia)+"</div>"+
    "<div id='another_day_temp_max_text"+strDia+"' class='another_day_temp_max_text'>"+Math.round(tiempox.temp_max)+"°C</div>"+
    "<div id='another_day_vectorMax"+strDia+"' class='another_day_vectorMax'></div>"+
    "<div id='another_day_temp_min_text"+strDia+"' class='another_day_temp_min_text'>"+Math.round(tiempox.temp_min)+"°C</div>"+
    "<div id='another_day_vectorMax"+strDia+"' class='another_day_vectorMin'></div></div>";
    document.getElementById("five-today-row-04").insertAdjacentHTML("beforeend",myString);
    document.getElementById("another_day_icon"+strDia).style.backgroundImage = tiempox.icono_estado;
}




function cargar_fondo(){
    let dif = 30; /*minutos*/
    let minutosAhora = new Date();
    minutosAhora = (minutosAhora.getHours() *60) + minutosAhora.getMinutes();
    let sunriseMinutos = new Date(lista_tiempos[0].sunrise_original * 1000);
    sunriseMinutos = sunriseMinutos.getHours()*60 + sunriseMinutos.getMinutes();
    let sunsetMinutos = new Date(lista_tiempos[0].sunset_original * 1000);
    sunsetMinutos = sunsetMinutos.getHours()*60 + sunsetMinutos.getMinutes();
    let difSunrise = Math.max(minutosAhora, sunriseMinutos) - Math.min(minutosAhora, sunriseMinutos);
    let difSunset = Math.max(minutosAhora, sunsetMinutos) - Math.min(minutosAhora, sunsetMinutos);

    let fondo = document.getElementById("graphic");
    if (difSunrise<dif || difSunset<dif){
            fondo.style.backgroundImage = "url(../img/img-fondoSS.png)";
    }else{
        if(minutosAhora>(sunsetMinutos+dif) && minutosAhora<(sunriseMinutos-dif)){
            fondo.style.backgroundImage = "url(../img/img-fondoN.png)";

        }else{
            if(minutosAhora>(sunriseMinutos+30) && minutosAhora<(sunsetMinutos+dif)){
                fondo.style.backgroundImage = "url(../img/img-fondo.png)";
            }
        }
   }
}
