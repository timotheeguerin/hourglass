/** @jsx React.DOM */

var DualView = React.createClass({
    getDefaultProps: function () {
        return {
            type: 'split'
        }
    },
    getInitialState: function () {
        return ({
            slider_position: '50%',
            scrollTop: 0
        })
    },
    componentDidMount: function () {
        this.updateLeftIframeSize();
    },
    componentDidUpdate: function () {
        this.updateLeftIframeSize();
    },
    updateLeftIframeSize: function () {
        var container = $(this.refs.container.getDOMNode());
        var left_iframe = $(this.refs.left_iframe.getDOMNode()).find('iframe');
        var right_iframe = $(this.refs.right_iframe.getDOMNode()).find('iframe');
        if (this.props.type == 'slide') {
            left_iframe.css({width: container.width()});
            right_iframe.css({width: container.width()});
        } else {
            left_iframe.css({width: '100%'});
            right_iframe.css({width: '100%'});
        }
    },
    onDropLeft: function (revision) {
        CompareViewData.setData({left_revision: revision});
    },
    onDropRight: function (revision) {
        CompareViewData.setData({right_revision: revision});
    },
    onMouseMove: function (e) {
        this.handleMouseMove(e.pageX);
    },
    onMouseMoveInIframe: function (positionX) {
        this.handleMouseMove(positionX);
    },
    handleMouseMove: function (positionX) {
        if (this.props.type == 'slide') {
            if (this.dragging_slider) {
                var container = $(this.refs.container.getDOMNode());
                var left_offset = container.offset().left;
                if (!isNull(positionX) && positionX >= left_offset && positionX <= left_offset + container.width()) {
                    this.setState({slider_position: positionX - container.offset().left})
                }
            }
        }
    },
    sliderStartDragging: function () {
        this.dragging_slider = true;
    },
    sliderStopDragging: function () {
        this.dragging_slider = false;
    },
    iframeScrolling: function (scrollTop) {
        this.setState({scrollTop: scrollTop})
    },
    render: function () {
        var slider;
        if (this.props.type == 'slide') {
            slider = (
                <div className='slider' ref='slider' style={{left: this.state.slider_position}}
                    onMouseDown={this.sliderStartDragging}>
                </div>
            )
        }

        return (
            <div className={this.props.type + " dual-view"} onMouseMove={this.onMouseMove} onMouseUp={this.sliderStopDragging}
                onMouseLeave={this.sliderStopDragging} ref='container'>
                <div className='left-iframe revision-box' ref='left_iframe'
                    style={{'flex-basis': this.state.slider_position}} >
                    <PreviewBox repository={this.props.repository} page={this.props.page} onRevisionSelected={this.onDropLeft}
                        revision={this.props.left_revision} onMouseMove={this.onMouseMoveInIframe}
                        onScroll={this.iframeScrolling} scrollTop={this.state.scrollTop}/>
                </div>
                {slider}
                <div className='right-iframe revision-box' ref='right_iframe'>
                    <PreviewBox repository={this.props.repository} page={this.props.page} onRevisionSelected={this.onDropRight}
                        revision={this.props.right_revision} onMouseMove={this.onMouseMoveInIframe}
                        onScroll={this.iframeScrolling} scrollTop={this.state.scrollTop}/>
                </div>
            </div>
        );
    }
});