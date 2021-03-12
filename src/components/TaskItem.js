import React, { Component } from 'react';

class TaskItem extends Component {
    constructor(props) {
        super(props);
        this.onUpdateStatus = this.onUpdateStatus.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdateStatus() {
        this.props.onUpdateStatus(this.props.taskl.id);
    }

    onDelete() {
        this.props.onDelete(this.props.taskl.id);
    }

    onUpdate() {
        this.props.onUpdate(this.props.taskl.id);
    }

    render() {
        var { taskl, index } = this.props;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{taskl.name}</td>
                <td className="text-center">
                    <span
                        className={taskl.status === true ? 'btn btn-danger' : 'btn btn-success'}
                        onClick={this.onUpdateStatus}
                    >
                        {taskl.status === true ? 'Kích hoạt' : 'Ẩn'}
                    </span>
                </td>
                <td className="text-center">
                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={this.onUpdate}
                    >
                        <span className="fa fa-pencil mr-5"></span>Sửa
                    </button>
                    &nbsp;
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={this.onDelete}
                    >
                        <span className="fa fa-trash mr-5"></span>Xóa
                    </button>
                </td>
            </tr>
        );
    }
}

export default TaskItem;