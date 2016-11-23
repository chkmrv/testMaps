
ymaps.ready(init);
var clusterer, placemark, geoLocation;

function init() {
  // Получить город или область в строке ("Москва")
  geoLocation = "Москва";
  
  // Параметры карты
  ymaps.geocode(geoLocation, { results: 1 }).then(function (res) {
    var firstGeoObject = res.geoObjects.get(0);
    bounds = firstGeoObject.properties.get('boundedBy');

    var myMap = new ymaps.Map("map", {
      center: firstGeoObject.geometry.getCoordinates(), //[55.730826, 37.607565],
      zoom: 9,
      controls: []
    },
    {suppressMapOpenBlock: true}); 

    myMap.setBounds(bounds, {
        checkZoomRange: true // проверяем наличие тайлов на данном масштабе.
    });
    myMap.behaviors.disable('scrollZoom');
  
    ymaps.regions.load('RU', {
          lang: 'ru',
          quality: '3'
    }).then(function (result) { 
      regname = firstGeoObject.properties.get('name');
      console.log(regname);
      // область города
      lastCollection = result.geoObjects;
      lastCollection.each(function (reg) {
          if (reg.properties.get('name') == regname) {
              reg.options.set('fillColor', 'E5AFAC');
              reg.options.set('opacity', '0.30');
              reg.options.set('strokeColor', 'AD3F37');
              regObject = reg;
              myMap.geoObjects.add(reg);
          } else {}
      });

      // Кастомный zoom
      
      ZoomLayout = ymaps.templateLayoutFactory.createClass("<div class='width_fix'><div class='custom_map_controls'>" + "<div id='zoom-in' class='zoom_button'><span>&plus;</span></div>" +
      "<div id='zoom-out' class='zoom_button'><span>&minus;</span></div>" + "</div></div>",
      {
        // Переопределяем методы макета, чтобы выполнять дополнительные действия при построении и очистке макета.
        build: function() {
          // Вызываем родительский метод build.
          ZoomLayout.superclass.build.call(this);
          // Привязываем функции-обработчики к контексту и сохраняем ссылки на них, чтобы потом отписаться от событий.
          this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
          this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);
          // Начинаем слушать клики на кнопках макета.
          $('#zoom-in').bind('click', this.zoomInCallback);
          $('#zoom-out').bind('click', this.zoomOutCallback);
        },
        clear: function() {
          // Снимаем обработчики кликов.
          $('#zoom-in').unbind('click', this.zoomInCallback);
          $('#zoom-out').unbind('click', this.zoomOutCallback);
          // Вызываем родительский метод clear.
          ZoomLayout.superclass.clear.call(this);
        },
        zoomIn: function() {
          var map = this.getData().control.getMap();
          // Генерируем событие, в ответ на которое элемент управления изменит коэффициент масштабирования карты.
          this.events.fire('zoomchange', {
            oldZoom: map.getZoom(),
            newZoom: map.getZoom() + 1
          });
        },
        zoomOut: function() {
          var map = this.getData().control.getMap();
          this.events.fire('zoomchange', {
            oldZoom: map.getZoom(),
            newZoom: map.getZoom() - 1
          });
        }
      });
      zoomControl = new ymaps.control.ZoomControl({
        options: {
          layout: ZoomLayout
        }
      });
      myMap.controls.add(zoomControl, {
        position: {
          right: 20,
          bottom: 50
        }
      });

   
      var listGeo = {};
      checkChangeFile();
      setInterval(() => {
        // myMap.geoObjects.removeAll();
        checkChangeFile();
      }, 60000);

      function checkChangeFile() {
        $.ajax({
          method: 'GET',
          url: "../test.csv",
          success: (obj) => {
            
            listGeo = obj.split('\n');
            listGeo.map((item)=>{
              let currentGeocoder = ymaps.geocode(geoLocation+item);
              currentGeocoder.then(
                  function (res) {
                      myMap.geoObjects.add(res.geoObjects);
                  },
                  function (err) {}
              );
            })
            
            myGroup = new ymaps.GeoObjectCollection({}, {
              iconLayout: 'default#image',
              iconImageHref: '../images/pog1.png',
              iconImageSize: [20, 28],
              iconImageOffset: [-15, -24],
              balloonOffset: [-15, 24]
            });

          }
        });
      }

    });
  });
}