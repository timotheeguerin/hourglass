/** @jsx React.DOM */

var CompareBox = React.createClass({
    getEngine: function () {
        if (isNull(this.props.right_revision_id)) {
            return (
                <SimpleView repository_id={this.props.repository_id}
                    revision_id={this.props.left_revision_id}
                    page={this.props.page}/>
            );
        } else {
            return (
                <DualView repository_id={this.props.repository_id}
                    left_revision_id= {this.props.left_revision_id}
                    right_revision_id={ this.props.right_revision_id}
                    page={this.props.page}
                    type={this.props.type}>
                </DualView>
            );
        }
    },
    render: function () {
        return (
            <div className="compare-view">
                {this.getEngine()}
            </div>
        );
    }
});


var SimpleView = React.createClass({
    render: function () {
        return (
            <div className="simple-view">
                <iframe className="iframe" src={previewUrl(this.props, this.props.revision_id)}>
                </iframe>
            </div>
        );
    }
});

var DualView = React.createClass({
    componentDidMount: function () {
        var iframes = $(this.getDOMNode()).find('iframe');

        iframes_load(iframes, function () {
            iframes.each(function () {
                var iframe = $(this);
                $(this).contents().mousemove(function (e) {
                    move_slider(e.pageX + iframe.offset().left);
                });
            });
            link_iframes(iframes.eq(0), iframes.eq(1));
        });
    },
    render: function () {
        var slider;
        if (this.props.type == 'slide') {
            slider = (
                <div className='slider'>
                </div>
            )
        }
        return (
            <div className={this.props.type + " dual-view"}>
                <div className='left-iframe'>
                    <iframe className={this.props.type} src={previewUrl(this.props, this.props.left_revision_id)}>
                    </iframe>
                </div>
                {slider}
                <div className='right-iframe'>
                    <iframe className={this.props.type} src={previewUrl(this.props, this.props.right_revision_id)}>
                    </iframe>
                </div>
            </div>
        );
    }
});

function previewUrl(state, revision_id) {
    return Routes.preview_path(current_user, state.repository_id, revision_id, state.page)
}


function iframes_load(iframes, callback) {
    var count = iframes.length;
    iframes.load(function () {
        count--;
        if (count == 0) {
            callback();
        }
    });
}

function compare_view(repository_id, page, left_revision_id, right_revision_id, type) {
    right_revision_id = (isNull(right_revision_id) ? null : right_revision_id);
    type = isNull(type) ? null : type;
    var url = Routes.compare_path({
        user_id: current_user,
        repository_id: repository_id,
        left_revision_id: left_revision_id,
        right_revision_Id: right_revision_id,
        page: page,
        type: type
    });
    React.renderComponent(
        <CompareBox repository_id = {repository_id}
            left_revision_id = {left_revision_id}
            right_revision_id = {right_revision_id}
            page={page}
            type={type} />
        , document.getElementById('content')
    );
    window.history.pushState({}, "", url);

}


setTimeout(function () {
    compare_view(61, 'index.html', 1, 2, 'split')
}, 5000);

setTimeout(function () {
    compare_view(61, 'index.html', 1, 2, 'slide')
}, 10000);
function isNull(o) {
    return !(typeof o !== "undefined" && o !== null)
}
