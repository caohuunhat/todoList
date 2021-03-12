import './App.css';
import React, { Component } from 'react';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';
import {findIndex, filter} from 'lodash';
// khi sử dụng lodash, dùng phương thức nào thì tạo khi báo 
// phương thức đó, tránh khai báo nhiều

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [], // id : unique, name, status
      isDisplayForm: false,
      taskEditing: null,
      filter: {
        name: '',
        status: -1
      },
      keyWord: '',
      sortBy: 'name',
      sortValue: 1
    };

    // this.onGenerateData = this.onGenerateData.bind(this);
    this.generateID = this.generateID.bind(this);
    this.s4 = this.s4.bind(this);
    this.onToggleForm = this.onToggleForm.bind(this);
    this.onCloseForm = this.onCloseForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUpdateStatus = this.onUpdateStatus.bind(this);
    this.findIndex = this.findIndex.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onShowForm = this.onShowForm.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  componentDidMount() {
    if (localStorage && localStorage.getItem('tasks')) {
      var tasksG = JSON.parse(localStorage.getItem('tasks'));// Đổi lại thành object
      this.setState({
        tasks: tasksG
      });
    }
  }// nó sẽ đc gọi khi được refresh

  /* 
  -Lưu dữ liệu state vào trong localStorage (Bộ nhớ của trình duyệt)
  -JSON.stringify(tasksG): đổi toàn bộ Object trong state thành string khi lưu trữ vào local Strorage
  */

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }// Hàm random ra chuỗi

  generateID() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }// Hàm tạo ra ID random nhờ hàm random ra chuỗi (s4)

  onToggleForm() {
    if (this.state.isDisplayForm && this.state.taskEditing !== null) {
      this.setState({
        isDisplayForm: true,
        taskEditing: null,
      });
    } else {
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        taskEditing: null
      });
    }
  }

  onCloseForm() {
    this.setState({
      isDisplayForm: false
    });
  }

  onSubmit(data) {
    let { tasks } = this.state;// = this.state.tasks
    if (data.id === '') {
      data.id = this.generateID();// thêm id vào trong data
      tasks.push(data);
    } else {
      let index = this.findIndex(data.id);
      tasks[index] = data;
    }
    this.setState({
      tasks: tasks,
      taskEditing: null
    });
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  onUpdateStatus(id) {
    let { tasks } = this.state;
    // let index = this.findIndex(id);
    let index = findIndex(tasks, (task) => {
      return task.id === id;
    }); // Hàm tìm index bằng lodash
    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }

  onDelete(id) {
    let { tasks } = this.state;
    let index = this.findIndex(id);
    if (index !== -1) {
      tasks.splice(index, 1)
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    this.onCloseForm();
  }

  onUpdate(id) {
    let { tasks } = this.state;
    let index = this.findIndex(id);
    let taskEditing = tasks[index]
    this.setState({
      taskEditing: taskEditing
    }, () => {
      // console.log(this.state.taskEditing);
    });
    this.onShowForm();
  }

  onShowForm() {
    this.setState({
      isDisplayForm: true
    });
  }

  findIndex(id) {
    let { tasks } = this.state;
    let result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  }

  onFilter(filterName, filterStatus) {
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filter: {
        name: filterName.toLowerCase(),
        status: filterStatus
      }
    });
  }

  onSearch(keyword) {
    this.setState({
      keyWord: keyword.toLowerCase()
    });
  }

  onSort(sortBy, sortValue) {
    this.setState({
      sortBy: sortBy,
      sortValue: sortValue
    });
  }

  render() {
    var {
      tasks,
      isDisplayForm,
      taskEditing,
      filter,
      keyWord,
      sortBy,
      sortValue
    } = this.state; // var tasks = this.state.tasks

    // Filter Trạng thái
    if (filter) {
      if (filter.name) {

        tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }

      tasks = tasks.filter((task) => {
        if (filter.status === -1) {
          return task;
        } else {
          return task.status === (filter.status === 1 ? true : false);
        }
      });

    }

    // Search
    if (keyWord) {
      // tasks = tasks.filter((task) => {
      //   return task.name.toLowerCase().indexOf(keyWord) !== -1;
      // });

      tasks = filter(tasks, (task) => {
        return task.name.toLowerCase().indexOf(keyWord.toLocaleLowerCase()) !== -1;// Sử dụng lodash
      });
    }

    if (sortBy === 'name') {
      tasks.sort((a, b) => {
        if (a.name > b.name) return sortValue;
        else if (a.name < b.name) return -sortValue;
        else return 0;
      });
    } else {
      tasks.sort((a, b) => {
        if (a.status > b.status) return -sortValue;
        else if (a.status < b.status) return sortValue;
        else return 0;
      });
    }

    var elmTaskForm = isDisplayForm ? <TaskForm
      onSubmit={this.onSubmit}
      onCloseForm={this.onCloseForm}
      task={taskEditing}
    /> : '';

    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row">
          <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
            {/* TaskForm */}
            {elmTaskForm}
          </div>
          <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onToggleForm}
            >
              <span className="fa fa-plus mr-5"></span>Thêm Công Việc
              </button>
            <br />
            {/* Search & Sort */}
            <Control
              onSearch={this.onSearch}
              onSort={this.onSort}
              sortBy={sortBy}
              sortValue={sortValue}
            />
            <div className="row mt-15">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {/* TaskList */}
                <TaskList
                  tasksL={tasks}
                  onUpdateStatus={this.onUpdateStatus}
                  onDelete={this.onDelete}
                  onUpdate={this.onUpdate}
                  onFilter={this.onFilter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
