/** @jsx React.DOM */


var PreviewBox = React.createClass({
    getInitialState: function () {
        return ({
            dragover: false,
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
            },
            onRevisionSelected: function () {
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
    onDragOver: function (e) {
        e.preventDefault();
    },
    onDragEnter: function () {
        this.setState({dragover: true});
    },
    onDragLeave: function () {
        this.setState({dragover: false});
    },
    onRevisionDrop: function (e) {
        e.preventDefault();
        var revision = JSON.parse(e.dataTransfer.getData("revision"));
        this.props.onRevisionSelected(revision);
        this.setState({dragover: false});
    },
    render: function () {
        var hide_iframe = isNull(this.props.revision) || this.state.dragging_revision;
        var dragging_box;
        if (isNull(this.props.revision) || this.state.dragging_revision) {
            var classes = React.addons.classSet({
                'drop-container': true,
                'drag-hover': this.state.dragover
            });
            dragging_box = (
                <div className={classes} onDrop={this.onRevisionDrop}
                    onDragOver={this.onDragOver} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave}>
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
