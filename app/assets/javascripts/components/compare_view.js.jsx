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
        if (this.props.type == 'slide') {
            var container = $(this.refs.container.getDOMNode());
            var left_iframe = $(this.refs.left_iframe.getDOMNode());
            var right_iframe = $(this.refs.right_iframe.getDOMNode());
            left_iframe.find('iframe').css({width: container.width()});
            right_iframe.find('iframe').css({width: container.width()});
        }
    },

    allowDrop: function (e) {
        e.preventDefault();
    },
    dropLeft: function (e) {
        e.preventDefault();
        var revision = JSON.parse(e.dataTransfer.getData("revision"));
        CompareViewData.setData({left_revision: revision});
        EventManager.trigger('dragging_revision', false);
    },
    dropRight: function (e) {
        e.preventDefault();
        var revision = JSON.parse(e.dataTransfer.getData("revision"));
        CompareViewData.setData({right_revision: revision});
        EventManager.trigger('dragging_revision', false);
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
                <div className='left-iframe revision-box' onDrop={this.dropLeft} onDragOver={this.allowDrop} ref='left_iframe'
                    style={{'flex-basis': this.state.slider_position}} >
                    <PreviewBox repository={this.props.repository} page={this.props.page}
                        revision={this.props.left_revision} onMouseMove={this.onMouseMoveInIframe}
                        onScroll={this.iframeScrolling} scrollTop={this.state.scrollTop}/>
                </div>
                {slider}
                <div className='right-iframe revision-box' onDrop={this.dropRight} onDragOver={this.allowDrop} ref='right_iframe'>
                    <PreviewBox repository={this.props.repository} page={this.props.page}
                        revision={this.props.right_revision} onMouseMove={this.onMouseMoveInIframe}
                        onScroll={this.iframeScrolling} scrollTop={this.state.scrollTop}/>
                </div>
            </div>
        );
    }
});

var PreviewBox = React.createClass({
    getInitialState: function () {
        return ({
            dragging_revision: false
        })
    },
    getDefaultProps: function () {
        return {
            scrollTop: 0,
            onLoad: function () {
            },
            onMouseMove: function () {
            },
            onScroll: function () {
            }
        }
    },
    previewUrl: function () {
        if (isNull(this.props.revision)) {
            return '';
        }
        return Routes.preview_path(current_user, this.props.repository.id, this.props.revision.id, this.props.page.path)
    },
    iframeLoaded: function (iframe) {
        iframe.contents().mousemove(function (e) {
            var mousePosition = e.pageX + iframe.offset().left;
            this.props.onMouseMove(mousePosition)
        }.bind(this));
        var props = this.props;
        $(iframe.contents()).scroll(function () {
            props.onScroll($(this).scrollTop())
        });
    },
    componentDidMount: function () {
        if (!isNull(this.refs.iframe)) {
            var iframe = $(this.refs.iframe.getDOMNode());
            iframe.load(function () {
                this.iframeLoaded(iframe);
                this.props.onLoad(iframe);
            }.bind(this))
        }
        this.dragging_listener = EventManager.on('dragging_revision', function (dragging) {
            this.setState({dragging_revision: dragging});
        }.bind(this));
    },
    componentWillReceiveProps: function (newProps) {
        this.updateIframeScroll(newProps.scrollTop)
    },
    componentWillUnmount: function () {
        this.dragging_listener.destroy();
    },
    updateIframeScroll: function (scrollTop) {
        if (!isNull(this.refs.iframe)) {
            var iframe = $(this.refs.iframe.getDOMNode());
            $(iframe.contents()).scrollTop(scrollTop);
        }
    },
    render: function () {
        var hide_iframe = isNull(this.props.revision) || this.state.dragging_revision;
        var dragging_box;
        if (isNull(this.props.revision) || this.state.dragging_revision) {
            dragging_box = (
                <div className='drop-container'>
                    <div className="drop-description"> Drag a revision here
                    </div>
                </div>
            );
        }
        return (
            <div className='iframe-container'>
                {dragging_box}
                <iframe src={this.previewUrl()} ref='iframe' className={hide_iframe ? 'hidden' : ''} >
                </iframe>
            </div>
        );
    }
});

// Change the compare url when the compare data is changed
CompareViewData.onUpdate(function (data) {
    var url = '/compare';
    var params = {};
    if (isDefined(data.type)) url += '/' + data.type;
    if (isDefined(data.repository)) {
        url += '/' + current_user;
        url += '/' + data.repository.id;
    }

    if (isDefined(data.page)) url += '/' + data.page.path;
    if (isDefined(data.dual_type)) params.dual_type = data.dual_type;
    if (isDefined(data.left_revision)) params.left = data.left_revision.id;
    if (isDefined(data.right_revision)) params.right = data.right_revision.id;
    if (Object.keys(params).length > 0) {
        url += '?' + $.param(params);
    }

    if (url !== document.URL) {
        window.history.pushState({}, "", url);
    }
});
