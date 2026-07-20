using System.ComponentModel;

namespace Cinema.Data.Entities;

public enum City
{
    /* === AGUASCALIENTES === */
    [Description("Aguascalientes")] Aguascalientes,

    /* === BAJA CALIFORNIA NORTE  === */
    [Description("Ensenada")] Ensenada,
    [Description("Mexicali")] Mexicali,
    [Description("Tijuana")] Tijuana,

    /* === BAJA CALIFORNIA SUR === */
    [Description("Cabo San Lucas")] CaboSanLucas,
    [Description("La Paz")] LaPaz,
    [Description("San José del Cabo")] SanJoseDelCabo,

    /* === CAMPECHE === */
    [Description("Ciudad del Carmen")] CiudadDelCarmen,
    [Description("San Francisco de Campeche")] Campeche,

    /* === CHIAPAS === */
    [Description("San Cristóbal de las Casas")] SanCristobal,
    [Description("Tapachula")] Tapachula,
    [Description("Tuxtla Gutiérrez")] TuxtlaGutierrez,

    /* === CHIHUAHUA === */
    [Description("Chihuahua")] Chihuahua,
    [Description("Ciudad Juárez")] CiudadJuarez,

    /* === CIUDAD DE MÉXICO === */
    [Description("Ciudad de México")] CiudadDeMexico,

    /* === COAHUILA === */
    [Description("Saltillo")] Saltillo,
    [Description("Torreón")] Torreon,

    /* === COLIMA === */
    [Description("Colima")] Colima,
    [Description("Manzanillo")] Manzanillo,

    /* === DURANGO === */
    [Description("Durango")] Durango,

    /* === ESTADO DE MÉXICO === */
    [Description("Chimalhuacán")] Chimalhuacan,
    [Description("Cuautitlán Izcalli")] CuautitlanIzcalli,
    [Description("Ecatepec de Morelos")] Ecatepec,
    [Description("Naucalpan de Juárez")] Naucalpan,
    [Description("Neza de Juárez")] Nezahualcoyotl,
    [Description("Tlalnepantla de Baz")] Tlalnepantla,
    [Description("Toluca de Lerdo")] Toluca,

    /* === GUANAJUATO === */
    [Description("Celaya")] Celaya,
    [Description("Guanajuato")] Guanajuato,
    [Description("Irapuato")] Irapuato,
    [Description("León de los Aldama")] Leon,
    [Description("Salamanca")] Salamanca,

    /* === GUERRERO === */
    [Description("Acapulco de Juárez")] Acapulco,
    [Description("Chilpancingo de los Bravo")] Chilpancingo,

    /* === HIDALGO === */
    [Description("Pachuca de Soto")] Pachuca,

    /* === JALISCO === */
    [Description("Guadalajara")] Guadalajara,
    [Description("Puerto Vallarta")] PuertoVallarta,
    [Description("Tlaquepaque")] Tlaquepaque,
    [Description("Tonalá")] Tonala,
    [Description("Zapopan")] Zapopan,

    /* === MICHOACÁN === */
    [Description("Morelia")] Morelia,
    [Description("Uruapan")] Uruapan,

    /* === MORELOS === */
    [Description("Cuernavaca")] Cuernavaca,

    /* === NAYARIT === */
    [Description("Tepic")] Tepic,

    /* === NUEVO LEÓN === */
    [Description("Apodaca")] Apodaca,
    [Description("Guadalupe")] Guadalupe,
    [Description("Monterrey")] Monterrey,
    [Description("San Pedro Garza García")] SanPedroGarzaGarcia,

    /* === OAXACA === */
    [Description("Oaxaca de Juárez")] Oaxaca,

    /* === PUEBLA === */
    [Description("Puebla de Zaragoza")] Puebla,

    /* === QUERÉTARO === */
    [Description("Santiago de Querétaro")] Queretaro,

    /* === QUINTANA ROO === */
    [Description("Cancún")] Cancun,
    [Description("Chetumal")] Chetumal,
    [Description("Playa del Carmen")] PlayaDelCarmen,

    /* === SAN LUIS POTOSÍ === */
    [Description("San Luis Potosí")] SanLuisPotosi,

    /* === SINALOA === */
    [Description("Culiacán Rosales")] Culiacan,
    [Description("Los Mochis")] LosMochis,
    [Description("Mazatlán")] Mazatlan,

    /* === SONORA === */
    [Description("Ciudad Obregón")] CiudadObregon,
    [Description("Hermosillo")] Hermosillo,
    [Description("Nogales")] Nogales,

    /* === TABASCO === */
    [Description("Villahermosa")] Villahermosa,

    /* === TAMAULIPAS === */
    [Description("Matamoros")] Matamoros,
    [Description("Nuevo Laredo")] NuevoLaredo,
    [Description("Reynosa")] Reynosa,
    [Description("Ciudad Victoria")] CiudadVictoria,

    /* === TLAXCALA === */
    [Description("Tlaxcala de Xicohténcatl")] Tlaxcala,

    /* === VERACRUZ === */
    [Description("Coatzacoalcos")] Coatzacoalcos,
    [Description("Orizaba")] Orizaba,
    [Description("Veracruz")] Veracruz,
    [Description("Xalapa-Enríquez")] Xalapa,

    /* === YUCATÁN === */
    [Description("Mérida")] Merida,

    /* === ZACATECAS === */
    [Description("Zacatecas")] Zacatecas
}
