//= require components/compare_view/simple_view

/** @jsx React.DOM */


var CompareBox = React.createClass({
    getDefaultProps: function () {
        return {type: 'dual', dual_type: 'split'};
    },
    getInitialState: function () {
        return $.extend({}, this.props);
    },
    componentDidMount: function () {
        CompareViewData.setData(this.getInitialState());
        this.compare_view_data_event = CompareViewData.onUpdate(function (data) {
            this.setState({
                type: data.type,
                dual_type: data.dual_type,
                repository: data.repository,
                left_revision: data.left_revision,
                right_revision: data.right_revision,
                page: data.page
            });
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.compare_view_data_event.destroy();
    },
    getEngine: function () {
        if (this.state.type !== 'dual') {
            return (
                <SimpleView repository={this.state.repository}
                    revision={this.state.left_revision}
                    page={this.state.page}/>
            );
        } else {
            return (
                <DualView repository={this.state.repository}
                    left_revision= {this.state.left_revision}
                    right_revision={ this.state.right_revision}
                    page={this.state.page}
                    type={this.state.dual_type}>
                </DualView>
            );
        }
    },
    render: function () {
        if (isNull(this.state.repository)) {
            return (
                <div className='flex-center full-height'>
                    <div>Please select a repository</div>
                </div>
            )
        } else if (isNull(this.state.page)) {
            return (
                <div className='flex-center full-height'>
                    <div>Please select a page</div>
                </div>
            )
        } else {
            return (
                <div className="compare-view">
                {this.getEngine()}
                </div>
            );
        }
    }
});
