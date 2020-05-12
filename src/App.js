import React from 'react'
import './App.css'
import { StopWatch } from './StopWatch'
import { nowUTC, convertUTCtoLocal } from './utils'
import axios from 'axios'

const NavBar = (props) => {
  const username = window.sessionStorage.getItem('username')
  return (
    <nav role='navigation' className='navbar fixed-top navbar-dark bg-dark'>
      <a className='navbar-brand' href='.'>
        Timely
      </a>
      <div style={{ color: '#fff' }}>{username}</div>
    </nav>
  )
}

const TaskCreator = (props) => {
  return (
    <div className='row'>
      <div className='col-7'>
        <input
          type='text'
          placeholder='What are you working on?'
          className='form-control form-control-lg'
          name='task'
          value={props.taskName}
          onChange={props.onTaskChange}
        />
      </div>
      <div className='form-group'>
        <select
          className='form-control form-control-lg custom-select'
          id='category'
          style={{ height: '45px' }}
          onChange={props.onCategoryChange}
        >
          <option disabled='' selected=''>
            Category
          </option>
          <option selected={props.category === 'study'}>study</option>
          <option selected={props.category === 'workout'}>workout</option>
          <option selected={props.category === 'housekeeping'}>housekeeping</option>
        </select>
      </div>
      <div className='col'>
        {props.isStarted === true ? (
          <button type='button' className='btn btn-danger btn-lg' onClick={props.onAddClicked}>
            Stop
          </button>
        ) : (
          <button type='button' className='btn btn-success btn-lg' onClick={props.onAddClicked}>
            Start
          </button>
        )}
      </div>
      <StopWatch isWatchStarted={props.isStarted} />
    </div>
  )
}

const NoTask = () => {
  return (
    <div className='text-center p-5 my-3 rounded shadow-sm text-dark'>
      <span>No task yet</span>
    </div>
  )
}

const TaskList = (props) => {
  return (
    <div className='my-3 bg-white rounded shadow-sm'>
      <div>
        {props.allTasks.map((task) => {
          console.log(task)
          return (
            <div className='row m-2 py-2 border-bottom border-gray align-items-center d-flex justify-content-between'>
              <div className='col'>
                <span>{task.name}</span>
                <span className='ml-2 badge badge-info'>{task.category}</span>
              </div>
              <div className='col'>{task.username}</div>
              <div className='col'>{task.date}</div>
              <div className='col'>{`${task.startedAt} - ${task.endedAt}`}</div>
              <div className=''>
                <button className='btn btn-danger'>Remove</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

class App extends React.Component {
  state = {
    task: '',
    category: 'study',
    allTasks: [],
    isStarted: false,
    startedAt: '',
    endedAt: ''
  }

  componentDidMount() {
    axios.get('http://ec2-13-250-104-160.ap-southeast-1.compute.amazonaws.com:8000/tasks')
    .then((response) => {
      console.log(response.data)
      const tasksFromAPI = response.data
      const allTasks = tasksFromAPI.map((task) =>{
        return{
          name: task.name,
          category: task.category,
          username: task.username,
          startedAt: task.started_at,
          endedAt: task.ended_at
        }
      })
      console.log('allTasks', allTasks)
      this.setState({ allTasks: allTasks })
    })
    // this.setState({allTasks: [{name: 'name', category:'category, username: 'username', startedAt: '', endedAt: ''}]}
  }

  onTaskChange = (event) => {
    console.log(event.target.value)
    this.setState({ task: event.target.value })
  }

  onCategoryChange = (event) => {
    this.setState({ category: event.target.value })
  }

  onAddClicked = (event) => {
    //add task to state allTasks
    //allTasks = [{name: 'task name', Category: 'study'}, {}, {}]
    const currentDataTime = nowUTC()
    const newTasks = {
      name: this.state.task,
      category: this.state.category,
      startedAt: this.state.startedAt,
      endedAt: currentDataTime
    }

    const isStarted = !this.state.isStarted
    this.setState({ isStarted: isStarted })

    if (isStarted === true) {
      this.setState({ startedAt: currentDataTime })
    } else {
      const newAllTasks = this.state.allTasks.concat(newTasks)
      this.setState({ allTasks: newAllTasks })
      this.setState({ endedAt: currentDataTime })

      axios.post('http://ec2-13-250-104-160.ap-southeast-1.compute.amazonaws.com:8000/tasks',{
        name: this.state.task,
        category: this.state.category,
        started_at: this.state.startedAt,
        ended_at: currentDataTime,
        username: window.sessionStorage.getItem('username')
      })
    }
  }

  onRemoveClicked = (taskId) => {
    const currentDataTime = this.state.allTasks
    const newAllTasks = currentDataTime.filter(task => task.id !== taskId)
    this.setState({ allTasks: newAllTasks })
    axios.delete('http://ec2-13-250-104-160.ap-southeast-1.compute.amazonaws.com:8000/tasks/${taskId}')
  }

  render() {
    const name = 'Wijit'
    return (
      <div className='App'>
        <NavBar />
        <div className='container' role='main' style={{ marginTop: '100px' }}>
          <TaskCreator
            taskName={this.state.task}
            onTaskChange={this.onTaskChange}
            category={this.state.category}
            onCategoryChange={this.onCategoryChange}
            onAddClicked={this.onAddClicked}
            isStarted={this.state.isStarted}
          />

          {
          this.state.allTasks.length < 1 ? (
            <NoTask />
          ) : (
            <TaskList allTasks={this.state.allTasks} onRemoveClicked= {this.onRemoveClicked} />
          )
          }
        </div>
      </div>
    )
  }
}
export default App
