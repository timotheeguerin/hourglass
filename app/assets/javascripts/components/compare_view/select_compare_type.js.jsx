/** @jsx React.DOM */
var SelectCompareType = React.createClass({
    getInitialState: function () {
        return {type: CompareViewData.data.type, dual_type: CompareViewData.data.dual_type};
    },
    componentDidMount: function () {
        this.compare_view_data_event = CompareViewData.onUpdate(function (data) {
            this.setState({type: data.type, dual_type: data.dual_type});
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.compare_view_data_event.destroy();
    },
    onTypeSelected: function (data) {
        CompareViewData.setData({type: data.type, dual_type: data.dual_type})
    },
    render: function () {
        var data = {
            simple: {icon: 'file-o', text: 'Single', type: 'simple'},
            slide: {icon: 'files-o', text: 'Slide', type: 'dual', dual_type: 'slide'},
            split: {icon: 'columns', text: 'Split', type: 'dual', dual_type: 'split'}
        };
        var choices = Object.keys(data).map(function (key) {
            var value = data[key];
            var className;
            if (value.type === this.state.type && value.dual_type === this.state.dual_type) {
                className = 'selected'
            }
            return (
                <span key={key} onClick={this.onTypeSelected.bind(this, value)} className={className}>
                    <i className={"fa fa-" + value.icon + " fa-lg"}></i>
                {value.text}
                </span>
            );
        }.bind(this));
        return (
            <div className="select">
            {choices}
            </div>
        );
    }
});