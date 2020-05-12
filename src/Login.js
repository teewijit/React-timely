import React from 'react'
import { withRouter } from 'react-router-dom'

class Login extends React.Component {
  state = {
    username: ''
  }

  onUsernameChange = (event) => {
    this.setState({ username: event.target.value })
  }

  onSignin = () => {
    window.sessionStorage.setItem('username', this.state.username)
    // navigate to /app
    this.props.history.replace('/app')
  }

  render() {
    return (
      <div className='row'>
        <div className='col'></div>
        <div className='col'>
          <div className='container'>
            <form className='form-signin '>
              <h1 className='mb-4'>Please enter your username</h1>
              <input
                type='text'
                id='username'
                className='form-control mb-3'
                placeholder='your password'
                required
                autoFocus
                onChange={this.onUsernameChange}
              />

              <button className='btn btn-lg btn-primary btn-block' onClick={this.onSignin}>
                Sign in
              </button>
            </form>
          </div>
        </div>
        <div className='col'></div>
      </div>
    )
  }
}

export default withRouter(Login)
