
import React from 'react';
import ReactDOM from 'react-dom';
 
import library from 'library';
let lib = library.lib;

class ContactMapRegion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRegion: 0,
      edit: false,
      addPoint: false,
      success: false,
      currentPointId: null,
      developedPoint: {
        title: "",
        address: "",
        point: [0,0]
      },
      developedRegion: {
        phone: "",
        fax: "",
        email: "",
        description: ""
      },
      errors: [],
    }
  };

  clearState = () => {
    let onChange = this.props.onChange;

    this.setState({
      developedRegion: {},
      edit: false,
      addPoint: false,
      success: false,
      currentPointId: null,
      currentRegion: 0,
      errors: [],
    }, () => {
      onChange()
    });
  };

  selectChangeOption = (e) => {
    let currentRegion = e.target.value;
    this.setState({currentRegion, edit: true, addPoint: true});

    lib.getAJAXCall({
      method: 'GET',
      url: lib.urlsLibrary.contacts + currentRegion,
      callback: (geoObj) => {
        
        this.setState({
          developedRegion: geoObj,
          edit: true,
          addPoint: false
        });
      }
    });
  };

  createGeo = () => {
    this.setState({
      developedPoint: {
        title: "",
        address: "",
        point: [0,0]
      },
      edit: true,
      addPoint: true,
    });
  };

  addNewMap = () => {
      let {developedRegion, developedPoint, currentRegion} = this.state;
      let method;
      
    let tests = {
      addtitle: {
        approve: developedPoint.title.length <= 0,
        descr: "Введите название пункта"
      },
      addpoint: {
        approve: developedPoint.point.length <= 1,
        descr: "Введите координаты корректно"
      }
    };

    lib.checkValidation(tests, () => {
      if (Object.keys(this.state.errors).length === 0) {
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
            callback: (geoObj) => {
              this.setState({
                developedRegion: geoObj,
                developedPoint: {
                  title: "",
                  address: "",
                  point: [0,0]
                },
                edit: true,
                addPoint: true,
                success: true,
              });
            }
          });
      }
    }, this);
    setTimeout(()=>{
      this.setState({success: false});
    }, 6000);
  };

  deleteGeo = (id) => {
    let {developedRegion, currentRegion} = this.state;
      let tests = {
      mapdelete: {
        approve: developedRegion.map.length === 1,
        descr: "Нельзя удалить последний пункт"
      }
    };
    lib.checkValidation(tests, () => {
      if (Object.keys(this.state.errors).length === 0) {
          developedRegion.map.splice(id,1);
          this.setState({developedRegion, currentPointId: null});
      }
    }, this);
  };

  saveGeo = () => {
      let developedRegion = this.state.developedRegion;
      let {currentRegion} = this.state;

      let errorpoint = developedRegion.map.filter((item, id) => { 
            return item.point.length <= 1
          });
      let errortitle = developedRegion.map.filter((item, id) => { 
            return item.title.length <= 0
          });

      let tests = {
        name: {
          approve: (developedRegion.phone.length <= 0) || (developedRegion.phone == undefined),
          descr: "Введите телефон"
        },
        map: {
          approve: (developedRegion.map.length < 1) || (developedRegion.map == undefined),
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

      lib.checkValidation(tests, () => {
        if (Object.keys(this.state.errors).length === 0) {
          let method = 'PUT';

          lib.getAJAXCall({
            method: method,
            url: lib.urlsLibrary.contacts + currentRegion,
            data: developedRegion,
            callback: this.clearState
          });
        }
      }, this);
  };

  render() {
    let {regionList} = this.props;
    let {currentRegion, edit, addPoint, success, currentPointId, developedRegion, developedPoint, errors} = this.state;

    return (
      <div>
        {currentRegion==0 ? <h3>Выберите регион</h3> : <h3>{currentRegion}</h3>}
        {!edit
          ? <div>
              <select onChange={this.selectChangeOption} className="form-control">
                {currentRegion==0 ? <option>Выберите регион....</option> : null}
                {regionList.map((item, id) => {
                  return (
                    <option key={id}
                        value={item.name}
                        className={(currentRegion === item.id) ? 'active' : '' }>
                      {item.name}
                    </option>
                  )
                })}
              </select>
            </div>
          : <div>
              <div className="row regionContactInf">
                <p className="col-xs-12">Единый справочный телефон:</p>
                <div className="col-xs-4">
                  <input type="text" 
                     className="form-control"
                     value={developedRegion.phone}
                     onChange={(e) => {
                       developedRegion.phone = e.target.value;
                       this.setState({developedRegion})
                     }}
                  />
                  {(errors['name']) ? (
                    <div className="clearfix col-xs-12">
                      <span className="has-error-text">{errors['name']}</span>
                    </div>
                  ):(null)}
                </div>
                <p className="col-xs-12">Факс:</p>
                <div className="col-xs-4">
                  <input type="text" className="form-control"
                     value={developedRegion.fax}
                     onChange={(e) => {
                       developedRegion.fax = e.target.value;
                       this.setState({developedRegion})
                     }}
                  />
                </div>
                <p className="col-xs-12">Email:</p>
                 <div className="col-xs-4">
                  <input type="text" className="form-control"
                     value={developedRegion.email}
                     onChange={(e) => {
                       developedRegion.email = e.target.value;
                       this.setState({developedRegion})
                     }}
                  />
                </div>
                <p className="col-xs-12">Описание:</p>
                 <div className="col-xs-6">
                  <input type="text" className="form-control"
                     value={developedRegion.description}
                     onChange={(e) => {
                       developedRegion.description = e.target.value;
                       this.setState({developedRegion})
                     }}
                  />
                </div>
              </div>

              <div className="row form-group">
                  {developedRegion.map !== undefined &&
                    <div className="row form-group btnbox">
                      {!addPoint ? 
                        <div className="col-xs-2">
                          <button type="button" className="btn btn-primary" onClick={this.createGeo}>Добавить новую точку</button>
                        </div>
                      : <div className="col-xs-2">
                          <button type="button" className="btn btn-primary" onClick={(e) => {this.setState({addPoint: !addPoint})}}>Редактировать места</button>
                        </div> 
                      }
                    </div>
                  }
                  {!addPoint
                    ? <div>
                        <label className="col-xs-2">
                          <p className="col-xs-12">Название места:</p>
                        </label>
                        <label className="col-xs-3">
                          <p className="col-xs-12">Адрес:</p>
                        </label>
                        <label className="col-xs-6">
                          <p className="col-xs-12">Координаты:</p>
                        </label>
                        {developedRegion.map.map((item, id) => {
                          return (
                            <div key={id} className="row form-group">
                              <label className="col-xs-2">
                                <input type="text" className="form-control"
                                     value={item.title}
                                     onChange={(e) => {
                                       let obj = item;
                                       obj.title = e.target.value;
                                       this.setState({item: obj})
                                     }}
                                  />
                                
                              </label>

                              <label className="col-xs-3">
                                  <input type="text" className="form-control"
                                     value={item.address}
                                     onChange={(e) => {
                                       let obj = item;
                                       obj.address = e.target.value;
                                       this.setState({item: obj})
                                     }}
                                  />
                              </label>

                              <label className="col-xs-3">
                                <div className="col-xs-4">
                                  <input type="text" className="form-control"
                                     value={item.point[0]}
                                     
                                     onChange={(e) => {
                                       let obj = item;
                                       obj.point[0] = e.target.value;
                                       this.setState({item: obj})
                                     }}
                                  />
                                </div>
                                <div className="col-xs-4">
                                  <input type="text" className="form-control"
                                     value={item.point[1]}
                                     
                                     onChange={(e) => {
                                       let obj = item;
                                       obj.point[1] = e.target.value;
                                       this.setState({item: obj})
                                     }}
                                  />
                                </div>
                              </label>

                              <div className="col-xs-2">
                                {(currentPointId !== id) ? <div>
                                    <button type="button" className="btn btn-danger" onClick={(e) => {
                                      this.setState({currentPointId: id});
                                    }}>Удалить</button>
                                  </div>
                                : <div>
                                    <button type="button" className="btn btn_no" onClick={(e) => {
                                      this.setState({currentPointId: null});
                                    }}>Нет</button>
                                    <button type="button" className="btn btn-danger btn_yes" onClick={(e) => {
                                      this.deleteGeo(id);
                                    }}>Да</button>

                                    <label className="col-xs-5">Вы уверены?</label>
                                  </div>
                                }
                                {(errors['mapdelete']) ? (
                                <div className="clearfix col-xs-12">
                                  <span className="has-error-text">{errors['mapdelete']}</span>
                                </div>
                                ):(null)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    : <div className="row form-group">
                        {
                        // --Добавить новую точку на карту -----------------------------------------------------
                        }
                        <div className="row">
                          <label className="col-xs-2">
                            <p className="col-xs-12">Название места:</p>
                          </label>
                          <label className="col-xs-3">
                            <p className="col-xs-12">Адрес:</p>
                          </label>
                          <label className="col-xs-6">
                            <p className="col-xs-12">Координаты:</p>
                          </label>
                        </div>
                        <div className="row">
                          <label className="col-xs-2">
                            <input type="text" className="form-control"
                                value={developedPoint.title}
                                onChange={(e) => {
                                   let obj = developedPoint;
                                   obj.title = e.target.value;
                                   this.setState({developedPoint: obj})
                                }}
                              />
                              {(errors['addtitle']) ? (
                                <div className="clearfix col-xs-12">
                                  <span className="has-error-text">{errors['addtitle']}</span>
                                </div>
                              ):(null)}
                          </label>

                          <label className="col-xs-3">
                              <input type="text" className="form-control"
                                value={developedPoint.address}
                                onChange={(e) => {
                                  let obj = developedPoint;
                                  obj.address = e.target.value;
                                  this.setState({developedPoint: obj})
                                }}
                              />
                          </label>

                          <label className="col-xs-3">
                            <div className="col-xs-4">
                              <input type="text" className="form-control"
                                value={developedPoint.point[0]}
                                placeholder = {23.434322}
                                
                                onChange={(e) => {
                                   let obj = developedPoint;
                                   obj.point[0] = e.target.value;
                                   this.setState({developedPoint: obj})
                                }}
                              />
                            </div>
                            <div className="col-xs-4">
                              <input type="text" className="form-control"
                                value={developedPoint.point[1]}
                                placeholder = {23.434322}
                                 
                                onChange={(e) => {
                                   let obj = developedPoint;
                                   obj.point[1] = e.target.value;
                                   this.setState({developedPoint: obj})
                                }}
                              />
                            </div>
                            
                            {(errors['addpoint']) ? (
                              <div className="clearfix col-xs-12">
                                <span className="has-error-text">{errors['addpoint']}</span>
                              </div>
                            ):(null)}
                          </label>
                          <div className="col-xs-1">
                            <button type="button"  className="btn btn-success" onClick={this.addNewMap}>Добавить</button>
                          </div>
                          {success &&
                            <div className="col-xs-2">
                              <span className="has-success-text">Успешно добавлено</span>
                            </div>
                          }
                        </div>
                      </div>
                  }
              </div>
              <div className="bs-example">
                <button type="button" className="btn " onClick={this.clearState}>Отменить</button>
                <button type="button" className="btn btn-success" onClick={this.saveGeo}>Сохранить</button>
                {(errors['point']) ? (
                  <div className="clearfix col-xs-12">
                    <span className="has-error-text">{errors['point']}</span>
                  </div>
                ):(null)}
                {(errors['title']) ? (
                  <div className="clearfix col-xs-12">
                    <span className="has-error-text">{errors['title']}</span>
                  </div>
                ):(null)}
                {(errors['map']) ? (
                    <div className="clearfix col-xs-12">
                      <span className="has-error-text">{errors['map']}</span>
                    </div>
                  ):(null)}
              </div>
            </div>
        }
      </div>
    );
  }
}

class ContactMapConfiguration extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      regionList: []
    }
  }

  componentDidMount() {
    this.getRegionList();
  }

  getRegionList = () => {
    lib.getAJAXCall({
      method: 'GET',
      url: lib.urlsLibrary.region,
      callback: (region) => {

        this.setState({
          regionList: region,
        });
      }
    });
  };

  render() {
    let {regionList} = this.state;

    return (
      <div>
        <ContactMapRegion
          regionList={regionList}
          onChange={this.getRegionList}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <ContactMapConfiguration />,
  document.getElementById('container-conf')
);
