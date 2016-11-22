
  ymaps.ready(init);
  var clusterer, placemark, geoLocation;

  function init() {
    // Получить город или область в строке ("Москва")
    geoLocation = $('#top_location .current_location').text();
    
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

      // var clusterer = new ymaps.Placemark([55.76, 37.64], {
      //  hintContent: 'Москва!',
      //  balloonContent: 'Столица России'
      // });

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
      }),
      zoomControl = new ymaps.control.ZoomControl({
        options: {
          layout: ZoomLayout
        }
      });
      myMap.controls.add(zoomControl, {
        position: {
          right: 20,
          top: 400
        }
      });
      // Шаблон балуна
      var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
        '<div class="marker_info"><div class="office">$[properties.name]</div>$[properties.text]<a href="http://rosreestr.ru/wps/portal/cc_ib_office" class="online-rec-link">Записаться на прием</a></div>'
      );
      var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
              '<div class="marker_info">',
              // Выводим в цикле список всех геообъектов.
              '{% for geoObject in properties.geoObjects %}',
                  '<div class="office">{{ geoObject.properties.balloonContentHeader|raw }}</div>',
              '{% endfor %}',
              '<a href="http://rosreestr.ru/wps/portal/cc_ib_office" class="online-rec-link">Записаться на прием</a></div>'
        ].join(''));

      // Создаем точки
      MyIconContentLayout = ymaps.templateLayoutFactory.createClass('<span style="color: #006EB8; font-weight: bold; font-size: 10px; display: block; margin-top: -1px;">$[properties.geoObjects.length]</span>');
        

      var listGeo = {};
      $('#contact_header .tabs_contact .tab__btn .active').html(regname);
      
      $.ajax({
        method: 'GET',
        url: "/rest-service/api/contacts/by/" + geoLocation,
        success: (obj) => {
          console.log(obj);
          listGeo = obj;
          

          myGroup = new ymaps.GeoObjectCollection({}, {
            iconLayout: 'default#image',
            iconImageHref: '/rrwebContactMaps-portlet/images/pog1.png',
            iconImageSize: [20, 28],
            iconImageOffset: [-15, -24],
            balloonOffset: [-15, 24]
          });
          
          // Добавляем в группу метки.
          clusterer = new ymaps.Clusterer({clusterDisableClickZoom: false, preset: 'islands#darkRedClusterIcons',
          //clusterBalloonItemContentLayout: customItemContentLayout
          clusterBalloonPanelMaxMapArea: 0,
                // По умолчанию опции балуна balloonMaxWidth и balloonMaxHeight не установлены для кластеризатора,
                // так как все стандартные макеты имеют определенные размеры.
                clusterBalloonMaxHeight: 200,
                // Устанавливаем собственный макет контента балуна.
                clusterBalloonContentLayout: customBalloonContentLayout, 
                 // Зададим массив, описывающий иконки кластеров разного размера.
                clusterIcons: [{
                    href: '/rrwebContactMaps-portlet/images/pog2.png',
                    size: [20, 28],
                    offset: [-5, -10]  
                }],
                // Эта опция отвечает за размеры кластеров.
                // В данном случае для кластеров, содержащих до 100 элементов,
                // будет показываться маленькая иконка. Для остальных - большая.
                //clusterNumbers: [100],
                  
                clusterIconContentLayout: MyIconContentLayout

                });
          // Добавляем в группу метки.

          for (var i = 0; i < listGeo.map.length; i++) {
            
            myGroup.add(new ymaps.Placemark(
              listGeo.map[i].point, {
                name: listGeo.map[i].title,
                text: listGeo.map[i].address
              }, {
                balloonShadow: false,
                balloonContentLayout: MyBalloonContentLayoutClass
              }
            ));

           
            if(regObject.geometry.contains(listGeo.map[i].point)) {
            placemark = new ymaps.Placemark(
              listGeo.map[i].point, {
                clusterCaption: listGeo.map[i].title,
                name: listGeo.map[i].title,
                text: listGeo.map[i].address,
                balloonContentBody: listGeo.map[i].address,
                    balloonContentHeader: listGeo.map[i].title,
              }, {
                iconLayout: 'default#image', 
                iconImageHref: '/images/pog1.png', 
                iconImageSize: [20, 28],
                iconImageOffset: [-15, -24], 
                balloonOffset: [-38, 15], 
                balloonShadow: false,
                balloonContentLayout: MyBalloonContentLayoutClass,
                
              }
            );

            clusterer.add(placemark);
            };
          }

          // Добавляем группу на карту. Устанавливаем карте центр и масштаб так, чтобы охватить группу целиком.
          myMap.geoObjects.add(clusterer);

        }
      });


      });
    });
  }