define('library',["exports", "react"], function (exports, _react) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var getAJAXCall = function getAJAXCall(_ref) {
		var method = _ref.method;
		var data = _ref.data;
		var url = _ref.url;
		var deleteCallback = _ref.deleteCallback;
		var callback = _ref.callback;

		$.ajax({
			type: method,
			url: url,
			data: JSON.stringify(data),
			success: callback,
			contentType: "application/json",
			statusCode: deleteCallback && {
				200: deleteCallback
			}
		});
	};

	var createArchiveElements = function createArchiveElements(source, compare, optionByCompare) {
		var archive = {};

		source.map(function (item) {
			var archiveOfItems = [];

			item[optionByCompare] = item[optionByCompare] || [];

			item[optionByCompare].map(function (id) {
				compare.map(function (compareElement) {
					if (id == compareElement.id) {
						archiveOfItems.push(compareElement);
					}
				});
			});

			archive[item.id] = archiveOfItems;
		});

		return archive;
	};

	var createArchiveElementsMatcher = function createArchiveElementsMatcher(source, compare, optionByCompare) {
		var archive = {};

		source.map(function (item) {
			var id = item[optionByCompare];

			compare.map(function (compareElement) {
				if (id == compareElement.id) {
					archive[item.matcherid] = compareElement;
				}
			});
		});

		return archive;
	};

	var checkValidation = function checkValidation(tests, callback, that) {
		var result = {};

		for (var key in tests) {
			if (tests[key]["approve"]) {
				result[key] = tests[key]["descr"];
			}
		}

		that.setState({
			errors: result
		}, callback);
	};

	var deleteConfirmation = function deleteConfirmation() {
		return confirm('Подтверждение удаления');
	};

	var urlsLibrary = {
		contacts: '/rest-service/api/contacts/by/',
		region: '/rest-service/api/contacts/region',
		object: '/rest-service/api/object/',
		operation: '/rest-service/api/operation/',
		answer: '/rest-service/api/answer/',
		question: '/rest-service/api/question/',
		standard: '/rest-service/api/standard/',
		document: '/rest-service/api/document/',
		match: '/rest-service/api/match/',
		theme: '/rest-service/api/theme/',
		faq: '/rest-service/api/faq/'

	};

	exports.default = {
		lib: {
			getAJAXCall: getAJAXCall,
			createArchiveElements: createArchiveElements,
			createArchiveElementsMatcher: createArchiveElementsMatcher,
			checkValidation: checkValidation,
			deleteConfirmation: deleteConfirmation,
			urlsLibrary: urlsLibrary
		}
	};
});
require(["library"], function () {});
define('rrwebContactMaps-portlet-conf',['react', 'react-dom', 'library'], function (_react, _reactDom, _library) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _library2 = _interopRequireDefault(_library);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var lib = _library2.default.lib;

  var ContactMapRegion = function (_React$Component) {
    _inherits(ContactMapRegion, _React$Component);

    function ContactMapRegion(props) {
      _classCallCheck(this, ContactMapRegion);

      var _this = _possibleConstructorReturn(this, (ContactMapRegion.__proto__ || Object.getPrototypeOf(ContactMapRegion)).call(this, props));

      _this.clearState = function () {
        var onChange = _this.props.onChange;

        _this.setState({
          developedRegion: {},
          edit: false,
          addPoint: false,
          success: false,
          currentPointId: null,
          currentRegion: 0,
          errors: []
        }, function () {
          onChange();
        });
      };

      _this.selectChangeOption = function (e) {
        var currentRegion = e.target.value;
        _this.setState({ currentRegion: currentRegion, edit: true, addPoint: true });

        lib.getAJAXCall({
          method: 'GET',
          url: lib.urlsLibrary.contacts + currentRegion,
          callback: function callback(geoObj) {

            _this.setState({
              developedRegion: geoObj,
              edit: true,
              addPoint: false
            });
          }
        });
      };

      _this.createGeo = function () {
        _this.setState({
          developedPoint: {
            title: "",
            address: "",
            point: [0, 0]
          },
          edit: true,
          addPoint: true
        });
      };

      _this.addNewMap = function () {
        var _this$state = _this.state;
        var developedRegion = _this$state.developedRegion;
        var developedPoint = _this$state.developedPoint;
        var currentRegion = _this$state.currentRegion;

        var method = void 0;

        var tests = {
          addtitle: {
            approve: developedPoint.title.length <= 0,
            descr: "Введите название пункта"
          },
          addpoint: {
            approve: developedPoint.point.length <= 1,
            descr: "Введите координаты корректно"
          }
        };

        lib.checkValidation(tests, function () {
          if (Object.keys(_this.state.errors).length === 0) {
            if (developedRegion.map === undefined) {
              method = 'POST';
              developedRegion.map = [];
              developedRegion.map.push(developedPoint);
            } else {
              method = 'PUT';
              developedRegion.map.push(developedPoint);
            }

            lib.getAJAXCall({
              method: method,
              url: lib.urlsLibrary.contacts + currentRegion,
              data: developedRegion,
              callback: function callback(geoObj) {
                _this.setState({
                  developedRegion: geoObj,
                  developedPoint: {
                    title: "",
                    address: "",
                    point: [0, 0]
                  },
                  edit: true,
                  addPoint: true,
                  success: true
                });
              }
            });
          }
        }, _this);
        setTimeout(function () {
          _this.setState({ success: false });
        }, 6000);
      };

      _this.deleteGeo = function (id) {
        var _this$state2 = _this.state;
        var developedRegion = _this$state2.developedRegion;
        var currentRegion = _this$state2.currentRegion;

        var tests = {
          mapdelete: {
            approve: developedRegion.map.length === 1,
            descr: "Нельзя удалить последний пункт"
          }
        };
        lib.checkValidation(tests, function () {
          if (Object.keys(_this.state.errors).length === 0) {
            developedRegion.map.splice(id, 1);
            _this.setState({ developedRegion: developedRegion, currentPointId: null });
          }
        }, _this);
      };

      _this.saveGeo = function () {
        var developedRegion = _this.state.developedRegion;
        var currentRegion = _this.state.currentRegion;


        var errorpoint = developedRegion.map.filter(function (item, id) {
          return item.point.length <= 1;
        });
        var errortitle = developedRegion.map.filter(function (item, id) {
          return item.title.length <= 0;
        });

        var tests = {
          name: {
            approve: developedRegion.phone.length <= 0 || developedRegion.phone == undefined,
            descr: "Введите телефон"
          },
          map: {
            approve: developedRegion.map.length < 1 || developedRegion.map == undefined,
            descr: "Всегда должен быть один пункт"
          },
          title: {
            approve: errortitle.length > 0,
            descr: "Введите название пункта"
          },
          point: {
            approve: errorpoint.length > 0,
            descr: "Введите две координаты корректно"
          }
        };

        lib.checkValidation(tests, function () {
          if (Object.keys(_this.state.errors).length === 0) {
            var method = 'PUT';

            lib.getAJAXCall({
              method: method,
              url: lib.urlsLibrary.contacts + currentRegion,
              data: developedRegion,
              callback: _this.clearState
            });
          }
        }, _this);
      };

      _this.state = {
        currentRegion: 0,
        edit: false,
        addPoint: false,
        success: false,
        currentPointId: null,
        developedPoint: {
          title: "",
          address: "",
          point: [0, 0]
        },
        developedRegion: {
          phone: "",
          fax: "",
          email: "",
          description: ""
        },
        errors: []
      };
      return _this;
    }

    _createClass(ContactMapRegion, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var regionList = this.props.regionList;
        var _state = this.state;
        var currentRegion = _state.currentRegion;
        var edit = _state.edit;
        var addPoint = _state.addPoint;
        var success = _state.success;
        var currentPointId = _state.currentPointId;
        var developedRegion = _state.developedRegion;
        var developedPoint = _state.developedPoint;
        var errors = _state.errors;


        return _react2.default.createElement(
          'div',
          null,
          currentRegion == 0 ? _react2.default.createElement(
            'h3',
            null,
            'Выберите регион'
          ) : _react2.default.createElement(
            'h3',
            null,
            currentRegion
          ),
          !edit ? _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'select',
              { onChange: this.selectChangeOption, className: 'form-control' },
              currentRegion == 0 ? _react2.default.createElement(
                'option',
                null,
                'Выберите регион....'
              ) : null,
              regionList.map(function (item, id) {
                return _react2.default.createElement(
                  'option',
                  { key: id,
                    value: item.name,
                    className: currentRegion === item.id ? 'active' : '' },
                  item.name
                );
              })
            )
          ) : _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'div',
              { className: 'row regionContactInf' },
              _react2.default.createElement(
                'p',
                { className: 'col-xs-12' },
                'Единый справочный телефон:'
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-4' },
                _react2.default.createElement('input', { type: 'text',
                  className: 'form-control',
                  value: developedRegion.phone,
                  onChange: function onChange(e) {
                    developedRegion.phone = e.target.value;
                    _this2.setState({ developedRegion: developedRegion });
                  }
                }),
                errors['name'] ? _react2.default.createElement(
                  'div',
                  { className: 'clearfix col-xs-12' },
                  _react2.default.createElement(
                    'span',
                    { className: 'has-error-text' },
                    errors['name']
                  )
                ) : null
              ),
              _react2.default.createElement(
                'p',
                { className: 'col-xs-12' },
                'Факс:'
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-4' },
                _react2.default.createElement('input', { type: 'text', className: 'form-control',
                  value: developedRegion.fax,
                  onChange: function onChange(e) {
                    developedRegion.fax = e.target.value;
                    _this2.setState({ developedRegion: developedRegion });
                  }
                })
              ),
              _react2.default.createElement(
                'p',
                { className: 'col-xs-12' },
                'Email:'
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-4' },
                _react2.default.createElement('input', { type: 'text', className: 'form-control',
                  value: developedRegion.email,
                  onChange: function onChange(e) {
                    developedRegion.email = e.target.value;
                    _this2.setState({ developedRegion: developedRegion });
                  }
                })
              ),
              _react2.default.createElement(
                'p',
                { className: 'col-xs-12' },
                'Описание:'
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-6' },
                _react2.default.createElement('input', { type: 'text', className: 'form-control',
                  value: developedRegion.description,
                  onChange: function onChange(e) {
                    developedRegion.description = e.target.value;
                    _this2.setState({ developedRegion: developedRegion });
                  }
                })
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'row form-group' },
              developedRegion.map !== undefined && _react2.default.createElement(
                'div',
                { className: 'row form-group btnbox' },
                !addPoint ? _react2.default.createElement(
                  'div',
                  { className: 'col-xs-2' },
                  _react2.default.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-primary', onClick: this.createGeo },
                    'Добавить новую точку'
                  )
                ) : _react2.default.createElement(
                  'div',
                  { className: 'col-xs-2' },
                  _react2.default.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-primary', onClick: function onClick(e) {
                        _this2.setState({ addPoint: !addPoint });
                      } },
                    'Редактировать места'
                  )
                )
              ),
              !addPoint ? _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'label',
                  { className: 'col-xs-2' },
                  _react2.default.createElement(
                    'p',
                    { className: 'col-xs-12' },
                    'Название места:'
                  )
                ),
                _react2.default.createElement(
                  'label',
                  { className: 'col-xs-3' },
                  _react2.default.createElement(
                    'p',
                    { className: 'col-xs-12' },
                    'Адрес:'
                  )
                ),
                _react2.default.createElement(
                  'label',
                  { className: 'col-xs-6' },
                  _react2.default.createElement(
                    'p',
                    { className: 'col-xs-12' },
                    'Координаты:'
                  )
                ),
                developedRegion.map.map(function (item, id) {
                  return _react2.default.createElement(
                    'div',
                    { key: id, className: 'row form-group' },
                    _react2.default.createElement(
                      'label',
                      { className: 'col-xs-2' },
                      _react2.default.createElement('input', { type: 'text', className: 'form-control',
                        value: item.title,
                        onChange: function onChange(e) {
                          var obj = item;
                          obj.title = e.target.value;
                          _this2.setState({ item: obj });
                        }
                      })
                    ),
                    _react2.default.createElement(
                      'label',
                      { className: 'col-xs-3' },
                      _react2.default.createElement('input', { type: 'text', className: 'form-control',
                        value: item.address,
                        onChange: function onChange(e) {
                          var obj = item;
                          obj.address = e.target.value;
                          _this2.setState({ item: obj });
                        }
                      })
                    ),
                    _react2.default.createElement(
                      'label',
                      { className: 'col-xs-3' },
                      _react2.default.createElement(
                        'div',
                        { className: 'col-xs-4' },
                        _react2.default.createElement('input', { type: 'text', className: 'form-control',
                          value: item.point[0],

                          onChange: function onChange(e) {
                            var obj = item;
                            obj.point[0] = e.target.value;
                            _this2.setState({ item: obj });
                          }
                        })
                      ),
                      _react2.default.createElement(
                        'div',
                        { className: 'col-xs-4' },
                        _react2.default.createElement('input', { type: 'text', className: 'form-control',
                          value: item.point[1],

                          onChange: function onChange(e) {
                            var obj = item;
                            obj.point[1] = e.target.value;
                            _this2.setState({ item: obj });
                          }
                        })
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'col-xs-2' },
                      currentPointId !== id ? _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                          'button',
                          { type: 'button', className: 'btn btn-danger', onClick: function onClick(e) {
                              _this2.setState({ currentPointId: id });
                            } },
                          'Удалить'
                        )
                      ) : _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                          'button',
                          { type: 'button', className: 'btn btn_no', onClick: function onClick(e) {
                              _this2.setState({ currentPointId: null });
                            } },
                          'Нет'
                        ),
                        _react2.default.createElement(
                          'button',
                          { type: 'button', className: 'btn btn-danger btn_yes', onClick: function onClick(e) {
                              _this2.deleteGeo(id);
                            } },
                          'Да'
                        ),
                        _react2.default.createElement(
                          'label',
                          { className: 'col-xs-5' },
                          'Вы уверены?'
                        )
                      ),
                      errors['mapdelete'] ? _react2.default.createElement(
                        'div',
                        { className: 'clearfix col-xs-12' },
                        _react2.default.createElement(
                          'span',
                          { className: 'has-error-text' },
                          errors['mapdelete']
                        )
                      ) : null
                    )
                  );
                })
              ) : _react2.default.createElement(
                'div',
                { className: 'row form-group' },
                _react2.default.createElement(
                  'div',
                  { className: 'row' },
                  _react2.default.createElement(
                    'label',
                    { className: 'col-xs-2' },
                    _react2.default.createElement(
                      'p',
                      { className: 'col-xs-12' },
                      'Название места:'
                    )
                  ),
                  _react2.default.createElement(
                    'label',
                    { className: 'col-xs-3' },
                    _react2.default.createElement(
                      'p',
                      { className: 'col-xs-12' },
                      'Адрес:'
                    )
                  ),
                  _react2.default.createElement(
                    'label',
                    { className: 'col-xs-6' },
                    _react2.default.createElement(
                      'p',
                      { className: 'col-xs-12' },
                      'Координаты:'
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'row' },
                  _react2.default.createElement(
                    'label',
                    { className: 'col-xs-2' },
                    _react2.default.createElement('input', { type: 'text', className: 'form-control',
                      value: developedPoint.title,
                      onChange: function onChange(e) {
                        var obj = developedPoint;
                        obj.title = e.target.value;
                        _this2.setState({ developedPoint: obj });
                      }
                    }),
                    errors['addtitle'] ? _react2.default.createElement(
                      'div',
                      { className: 'clearfix col-xs-12' },
                      _react2.default.createElement(
                        'span',
                        { className: 'has-error-text' },
                        errors['addtitle']
                      )
                    ) : null
                  ),
                  _react2.default.createElement(
                    'label',
                    { className: 'col-xs-3' },
                    _react2.default.createElement('input', { type: 'text', className: 'form-control',
                      value: developedPoint.address,
                      onChange: function onChange(e) {
                        var obj = developedPoint;
                        obj.address = e.target.value;
                        _this2.setState({ developedPoint: obj });
                      }
                    })
                  ),
                  _react2.default.createElement(
                    'label',
                    { className: 'col-xs-3' },
                    _react2.default.createElement(
                      'div',
                      { className: 'col-xs-4' },
                      _react2.default.createElement('input', { type: 'text', className: 'form-control',
                        value: developedPoint.point[0],
                        placeholder: 23.434322,

                        onChange: function onChange(e) {
                          var obj = developedPoint;
                          obj.point[0] = e.target.value;
                          _this2.setState({ developedPoint: obj });
                        }
                      })
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'col-xs-4' },
                      _react2.default.createElement('input', { type: 'text', className: 'form-control',
                        value: developedPoint.point[1],
                        placeholder: 23.434322,

                        onChange: function onChange(e) {
                          var obj = developedPoint;
                          obj.point[1] = e.target.value;
                          _this2.setState({ developedPoint: obj });
                        }
                      })
                    ),
                    errors['addpoint'] ? _react2.default.createElement(
                      'div',
                      { className: 'clearfix col-xs-12' },
                      _react2.default.createElement(
                        'span',
                        { className: 'has-error-text' },
                        errors['addpoint']
                      )
                    ) : null
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'col-xs-1' },
                    _react2.default.createElement(
                      'button',
                      { type: 'button', className: 'btn btn-success', onClick: this.addNewMap },
                      'Добавить'
                    )
                  ),
                  success && _react2.default.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    _react2.default.createElement(
                      'span',
                      { className: 'has-success-text' },
                      'Успешно добавлено'
                    )
                  )
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'bs-example' },
              _react2.default.createElement(
                'button',
                { type: 'button', className: 'btn ', onClick: this.clearState },
                'Отменить'
              ),
              _react2.default.createElement(
                'button',
                { type: 'button', className: 'btn btn-success', onClick: this.saveGeo },
                'Сохранить'
              ),
              errors['point'] ? _react2.default.createElement(
                'div',
                { className: 'clearfix col-xs-12' },
                _react2.default.createElement(
                  'span',
                  { className: 'has-error-text' },
                  errors['point']
                )
              ) : null,
              errors['title'] ? _react2.default.createElement(
                'div',
                { className: 'clearfix col-xs-12' },
                _react2.default.createElement(
                  'span',
                  { className: 'has-error-text' },
                  errors['title']
                )
              ) : null,
              errors['map'] ? _react2.default.createElement(
                'div',
                { className: 'clearfix col-xs-12' },
                _react2.default.createElement(
                  'span',
                  { className: 'has-error-text' },
                  errors['map']
                )
              ) : null
            )
          )
        );
      }
    }]);

    return ContactMapRegion;
  }(_react2.default.Component);

  var ContactMapConfiguration = function (_React$Component2) {
    _inherits(ContactMapConfiguration, _React$Component2);

    function ContactMapConfiguration(props) {
      _classCallCheck(this, ContactMapConfiguration);

      var _this3 = _possibleConstructorReturn(this, (ContactMapConfiguration.__proto__ || Object.getPrototypeOf(ContactMapConfiguration)).call(this, props));

      _this3.getRegionList = function () {
        lib.getAJAXCall({
          method: 'GET',
          url: lib.urlsLibrary.region,
          callback: function callback(region) {

            _this3.setState({
              regionList: region
            });
          }
        });
      };

      _this3.state = {
        regionList: []
      };
      return _this3;
    }

    _createClass(ContactMapConfiguration, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.getRegionList();
      }
    }, {
      key: 'render',
      value: function render() {
        var regionList = this.state.regionList;


        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(ContactMapRegion, {
            regionList: regionList,
            onChange: this.getRegionList
          })
        );
      }
    }]);

    return ContactMapConfiguration;
  }(_react2.default.Component);

  _reactDom2.default.render(_react2.default.createElement(ContactMapConfiguration, null), document.getElementById('container-conf'));
});
require(["rrwebContactMaps-portlet-conf"], function () {});
//# sourceMappingURL=main-conf.js.map
