import React from 'react';
import BindToMixin from 'react-binding';
import _ from 'underscore';
import Json from 'react-json';
import genie from 'genie'

import {TabbedArea,TabPane,Button} from 'react-bootstrap';

import SmoothLineChartDemo from './SmoothLineChartDemo.js';
import StockLineChartDemo from './StockLineChartDemo.js';
import ScatterPlotDemo from './ScatterPlotDemo.js';
import BarChartDemo from './BarChartDemo.js';
import PieChartDemo from './PieChartDemo.js';
import TreeChartDemo from './TreeChartDemo.js';
import RadarChartDemo from './RadarChartDemo.js';

var patternsOptions = [
'firstName',
'lastName',
'fullName',
'zipCode',
'zipCode5',
'zipCode9',
'city',
'streetName',
'streetAddress',
'secondaryAddress',
'brState',
'brStateAbbr',
'ukCounty',
'ukCountry',
'usState',
'usStateAbbr',
'latitude',
'longitude',
'phoneNumber',
'email',
'userName',
'domainName',
'domainWord',
'ipAddress',
'companyName',
'companySuffix',
'sentence',
'paragraph'];
//
//var colors = {
//    "turquoise"     : "#1ABC9C",
//    "green-sea"     : "#16A085",
//    "emerald"       : "#2ECC71",
//    "nephritis"     : "#27AE60",
//    "peter-river"   : "#3498DB",
//    "belize-hole"   : "#2980B9",
//    "amethyst"      : "#9B59B6",
//    "wisteria"      : "#8E44AD",
//    "wet-asphalt"   : "#34495E",
//    "midnight-blue" : "#2C3E50",
//    "sun-flower"    : "#F1C40F",
//    "orange"        : "#F39C12",
//    "carrot"        : "#E67E22",
//    "pumpkin"       : "#D35400",
//    "alizarin"      : "#E74C3C",
//    "pomegranate"   : "#C0392B",
//    "clouds"        : "#ECF0F1",
//    "silver"        : "#BDC3C7",
//    "concrete"      : "#95A5A6",
//    "asbestos"      : "#7F8C8D"
//};
//
//var fontFamilies =[
//    'Arial',
//    'Verdana',
//    'Helvetica',
//    'Times New Roman',
//    'Courier New',
//    'Papyrus'
//]

var TickValues = React.createClass({
    mixins: [BindToMixin],
    onChange(){
        if (this.props.onChange!== undefined) this.props.onChange();
    },
    add(){
        this.props.tickValues.add({value: 0});
        this.onChange();
    },
    remove(item){
        this.props.tickValues.remove(item);
        this.onChange();
    },
    clear(){

        var source = this.props.tickValues.sourceObject;
        source.splice(0,source.length);
        this.props.tickValues.notifyChange();

        this.onChange();

    },

    render(){
        var items = this.props.tickValues.items;
        return (<div>
            <input type='button' value="add" onClick={this.add}/>
            <input type='button' value="clear" onClick={this.clear}/>
            <table>
                <tr>
                    {items.map(function (item, index) {
                        var valueLink =this.bindTo(item,'value');
                        var handleChange = function(e){
                            valueLink.value = e.target.value;
                            this.onChange();
                        }.bind(this);
                        return (
                            <td>
                                <input type='number' style={{width:50,display:'inline'}} key={index}
                                             value={valueLink.value} onChange={handleChange}/>
                            </td>)
                    }, this)}
                </tr>
            </table>
        </div>);
    }
});
// Create the custom field type component
var TickValuesWrapper = React.createClass({
    mixins: [BindToMixin],
    getInitialState(){
        return {tickValues:_.map(this.props.value,function(item){return _.clone(item)})}
    },
    render: function () {
        var bindToArray = this.bindArrayToState('tickValues');
        return (<TickValues tickValues={bindToArray}  onChange={this.handleChange}></TickValues>)
    },
    handleChange: function () {
        this.props.onUpdated(this.state.tickValues);
    }
});

Json.registerType('tickValues',TickValuesWrapper);
//
//// Create the custom field type component
//var ColorPickerWrapper = React.createClass({
//
//    render: function () {
//        var opts = this.props.settings.options || [];
//        return (<select value={this.props.value}  onChange={this.handleChange}>
//            {opts.map(function(opt,index){
//                return React.DOM.option({value:opt.value},opt.label);
//            })
//            }
//        </select>)
//    },
//    handleChange: function (e) {
//        this.props.onUpdated(e.target.value);
//    }
//});
//
//Json.registerType('colorPicker',ColorPickerWrapper);
//
//var labelOptions= {
//    fields: {
//        fontFamily: {
//            type: 'select', settings: {
//                options: _.map(fontFamilies, function (key, value) {
//                    return {value: key, label: key};
//                })
//            }
//        },
//        fill: {
//            type: 'colorPicker', settings: {
//                options: _.map(colors, function (key, value) {
//                    return {value: key, label: value};
//                })
//            }
//        }
//
//    }
//};

// form: true
// make objects not extensible,
// fields not removable
// and inputs always visible
var settings = {
    form:true,
    fields: {
        data: {
            fields: {
                template: {
                    fields: {
                        title: {
                            fields: {
                                pattern: {type: 'select', settings: {options: patternsOptions}}
                            }
                        },
                        name: {
                            fields: {
                                pattern: {type: 'select', settings: {options: patternsOptions}}
                            }
                        }
                    }
                }
            }
        },
        children: {
            fields: {
                template: {
                    fields: {
                        name: {
                            fields: {
                                pattern: {type: 'select', settings: {options: patternsOptions}}
                            }
                        },
                        children: {
                            fields: {
                                template: {
                                    fields: {
                                        name: {
                                            fields: {
                                                pattern: {type: 'select', settings: {options: patternsOptions}}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

var Panel = React.createClass({
    getInitialState(){
        return {expanded: this.props.defaultExpanded}
    },
    toogleExpanded(){
        this.setState({expanded: !this.state.expanded});
    },
    render(){
        var className = this.state.expanded ? "glyphicon-chevron-up" : "glyphicon-chevron-down";
        className = "glyphicon " + className;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading" onClick={this.toogleExpanded}>
                    <div className="row">
                        <div className="col-md-11">{this.props.header}</div>
                        <div className="col-md-1"><span className={className}></span></div>
                    </div>
                </div>
                {this.state.expanded ? <div className="panel-body">{this.props.children}</div> : null}
            </div>
        )
    }
});
var App = React.createClass({
    mixins: [BindToMixin],
    //getInitialState() {
    //    //labelComponent: <FormattedNumber value={1000} style="currency" currency="USD"/>
    //
    //},

    render() {
        return (<div>
                <TabbedArea bsStyle="tabs" defaultActiveKey={1}>
                    <TabPane eventKey={1} tab='StockLine'>
                        <StockLineChartDemo settings={settings}/>
                    </TabPane>
                    <TabPane eventKey={2} tab='SmoothLine'>
                        <SmoothLineChartDemo settings={settings}/>
                    </TabPane>
                    <TabPane eventKey={3} tab='Scatterplot'>
                        <ScatterPlotDemo settings={settings}/>
                    </TabPane>
                    <TabPane eventKey={4} tab='Bar'>
                        <BarChartDemo settings={settings}/>
                    </TabPane>
                    <TabPane eventKey={5} tab='Pie'>
                        <PieChartDemo settings={settings}/>
                    </TabPane>

                    <TabPane eventKey={6} tab='Tree'>
                        <TreeChartDemo settings={settings}/>
                    </TabPane>
                    <TabPane eventKey={7} tab='Radar'>
                        <RadarChartDemo settings={settings}/>
                    </TabPane>
                </TabbedArea>
            </div>
        )
    }
});

React.render(<App />, document.getElementById('app'));
