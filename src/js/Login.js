import React, { Component } from 'react'
import ThreeScene from './ThreeScene'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: {
          value: 10
        },
        password: {
          value: 10
        },
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const name = event.target.name
    const value = event.target.value

    const updatedControls = {
      ...this.state.form
    };
    const updatedFormElement = {
      ...updatedControls[name]
    };
    updatedFormElement.value = value;

    updatedControls[name] = updatedFormElement;

    this.setState({
      form: updatedControls
    });
  }


  handleSubmit() {
    const params = Object.entries(this.state.form).map(([key, val]) => `${key}=${val.value}`).join('&')

    fetch('/api/login?' + params)
      .then(res => res.json())
      .then(
        (result) => {
          const devs = JSON.parse(result)
          console.log(devs)
          this.setState({
            individuo: devs
          });
        },
        (error) => {
          this.setState({
            individuo: [],
          });
        }
      )
      event.preventDefault()
  }

  render() {
    return (
      <div className="content">
      <ThreeScene />
        {/* <nav class="navbar navbar-dark bg-dark">
              <a class="navbar-brand" href="#">THREE JS</a>
          </nav>
          <div class="row d-flex justify-content-center">
              <div class="login-form col-3">
                  <form>
                      <div class="form-group">
                          <label for="username">Email CWI</label>
                          <input name="username" type="text" value={this.state.form.username.value} onChange={this.handleChange} type="text" class="form-control" placeholder="email@cwi.com.br" id="input-username"/>
                      </div>
                      <div class="form-group">
                          <label for="password">Senha</label>
                          <input name="password" type="text" value={this.state.form.password.value} onChange={this.handleChange}  type="password" class="form-control" id="input-password"/>
                      </div>
                      <div class='text-center'>
                          <button onClick={this.handleSubmit} class="btn btn-secondary">Logar</button>
                      </div>
                  </form>
              </div>
          </div> */}
      </div>
    );
  }
}

export default Login