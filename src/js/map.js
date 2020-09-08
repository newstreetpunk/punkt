$(function() {

    let maps = [
            {
                parent: '.contacts__map',
                id: "map",
                position: [54.728035, 43.395951],
                zoom: 6,
                placemarks: [
                    {
                        position: [55.767241, 37.650945],
                        balloonContentHeader: 'Пункт Права в Москве',
                        balloonContentBody: '<a href="tel:+78002229163" style="color:#000;">☎️ 8-800-222-91-63</a><br>\
                            <a href="mailto:info@bankrot-bg.ru" style="color:#000;">📩 info@bankrot-bg.ru</a><br><br> \
                            ул.Садовая-Черногрязская, д.8, стр.1<br>\
                            <a href="https://yandex.ru/maps/51/samara/?from=api-maps&ll=37.650945%2C55.767241&mode=routes&origin=jsapi_2_1_77&rtext=~55.767241%2C37.650945&rtt=auto&ruri=~&z=17"  target="_blank" style="color:#000;">📍 Проложить маршрут</a><br>',
                        balloonContentFooter: 'ежедневно: 8:00 — 20:00',
                        hintContent: 'Пункт Права'
                    },
                    {
                        position: [53.2028,50.1486],
                        balloonContentHeader: 'Пункт Права в Самаре',
                        balloonContentBody: '<a href="tel:+78002229163" style="color:#000;">☎️ 8-800-222-91-63</a><br>\
                            <a href="mailto:info@bankrot-bg.ru" style="color:#000;">📩 info@bankrot-bg.ru</a><br><br> \
                            Заводское шоссе, 11Б<br>\
                            <a href="https://yandex.ru/maps/51/samara/?from=api-maps&ll=50.148600%2C53.202800&mode=routes&origin=jsapi_2_1_77&rtext=~53.202800%2C50.148600&rtt=auto&ruri=~&z=17"  target="_blank" style="color:#000;">📍 Проложить маршрут</a><br>',
                        balloonContentFooter: 'ежедневно: 8:00 — 20:00',
                        hintContent: 'Пункт Права'
                    },
                    {
                        position: [53.506878, 49.268632],
                        balloonContentHeader: 'Пункт Права в Тольятти',
                        balloonContentBody: '<a href="tel:+78002229163" style="color:#000;">☎️ 8-800-222-91-63</a><br>\
                            <a href="tel:+78482792430" style="color:#000;">☎️ 8-8482-79-24-30</a><br>\
                            <a href="mailto:info@bankrot-bg.ru" style="color:#000;">📩 info@bankrot-bg.ru</a><br><br> \
                            Приморский бульвар, 43<br>\
                            <a href="https://yandex.ru/maps/51/samara/?from=api-maps&ll=49.268632%2C53.506878&mode=routes&origin=jsapi_2_1_77&rtext=~53.506878%2C49.268632&rtt=auto&ruri=~&z=17"  target="_blank" style="color:#000;">📍 Проложить маршрут</a><br>',
                        balloonContentFooter: 'ежедневно: 8:00 — 20:00',
                        hintContent: 'Пункт Права'
                    },
                    {
                        position: [53.157559, 48.462124],
                        balloonContentHeader: 'Пункт Права в Сызрани',
                        balloonContentBody: '<a href="tel:+78002229163" style="color:#000;">☎️ 8-800-222-91-63</a><br>\
                            <a href="mailto:info@bankrot-bg.ru" style="color:#000;">📩 info@bankrot-bg.ru</a><br><br> \
                            ул.Смолина, 5<br>\
                            <a href="https://yandex.ru/maps/51/samara/?from=api-maps&ll=48.462124%2C53.157559&mode=routes&origin=jsapi_2_1_77&rtext=~53.157559%2C48.462124&rtt=auto&ruri=~&z=17"  target="_blank" style="color:#000;">📍 Проложить маршрут</a><br>',
                        balloonContentFooter: 'ежедневно: 8:00 — 20:00',
                        hintContent: 'Пункт Права'
                    },
                ],
            },
        ],
        start_load_script = false, // Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
        end_load_script = false; // Переменная для определения был ли загружен скрипт Яндекс.Карт полностью (чтобы не возникли какие-нибудь ошибки, если мы загружаем несколько карт одновременно)


    //Функция создания карты сайта и затем вставки ее в блок с идентификатором "map-yandex"
    function init() {
        var myMapTemp = new ymaps.Map(this.id, {
            center: this.position, // координаты центра на карте
            zoom: this.zoom, // коэффициент приближения карты
        });
        myMapTemp.behaviors.disable('scrollZoom');

        this.placemarks.forEach(function(placemark){
            var myPlacemarkTemp = new ymaps.Placemark(
                placemark.position, {
                    balloonContentHeader: placemark.balloonContentHeader,
                    balloonContentBody: placemark.balloonContentBody,
                    balloonContentFooter: placemark.balloonContentFooter,
                    hintContent: placemark.hintContent
                }, {
                    preset: 'islands#blueCourtIcon',
                    iconColor: '#51C0FF'
                });
            myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту
        });

        // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
        var layer = myMapTemp.layers.get(0).get(0),
            parent = this.parent;

        // Решение по callback-у для определния полной загрузки карты
        waitForTilesLoad(layer).then(function(value) {
            // Скрываем индикатор загрузки после полной загрузки карты
            jQuery(parent).children('.loader').removeClass('is-active');
        });
    }

    // Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 
    function waitForTilesLoad(layer) {
        return new ymaps.vow.Promise(function(resolve, reject) {
            var tc = getTileContainer(layer),
                readyAll = true;
            tc.tiles.each(function(tile, number) {
                if (!tile.isReady()) {
                    readyAll = false;
                }
            });
            if (readyAll) {
                resolve();
            } else {
                tc.events.once("ready", function() {
                    resolve();
                });
            }
        });
    }

    function getTileContainer(layer) {
        for (var k in layer) {
            if (layer.hasOwnProperty(k)) {
                if (
                    layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer ||
                    layer[k] instanceof ymaps.layer.tileContainer.DomContainer
                ) {
                    return layer[k];
                }
            }
        }
        return null;
    }

    // Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
    function loadScript(url, callback) {
        var script = document.createElement("script");

        if (script.readyState) { // IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { // Другие браузеры
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    // Основная функция, которая проверяет когда мы навели на блок с классом "ymap-container"
    function ymap(map) {
        jQuery(map.parent).one("mouseenter", function() {
            // Показываем индикатор загрузки до тех пор, пока карта не загрузится
            jQuery(map.parent).children('.loader').addClass('is-active');

            if (!start_load_script) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

                // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
                start_load_script = true;

                // Загружаем API Яндекс.Карт
                loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&loadByRequire=1", function() {
                    end_load_script = !end_load_script;
                    // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором "map-yandex"
                    ymaps.load(init, map);
                });
            } else {
                var check_load = setInterval(function() {
                    if(end_load_script) {
                        clearInterval(check_load);
                        ymaps.load(init, map);
                    } 
                }, 100);
            }
        });
    }

    //Запускаем основную функцию для массива карт
    maps.forEach(function(map){
        ymap(map)
    });
});