/** @jsx React.DOM */

var Spinner = React.createClass({
    render: function () {
        var size_class = 'fa-' + this.props.size;
        var classes = 'fa fa-circle-o-notch fa-spin ';
        if (isDefined(this.props.size)) {
            classes += size_class;
        }
        return (
            <div className='spinner'>
                <i className={classes}></i>
            </div>
        )
    }
});