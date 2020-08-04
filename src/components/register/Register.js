import React from 'react';

class Register extends React.Component {

    constructor(props) {
        super(props)
    this.state = {
        registerName: '',
        registerEmail: '',
        registerPassword: ''

        }


    }
    onNameChange = e => {
        this.setState({registerName: e.target.value})
    }

    onEmailChange = e => {
        this.setState({registerEmail: e.target.value})
    }

    onPasswordChange = e => {
        this.setState({registerPassword: e.target.value})
    }

    onSubmit = () => {
        fetch('https://salty-eyrie-15305.herokuapp.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.registerName,
                email: this.state.registerEmail,
                password: this.state.registerPassword
            })

        })
        .then(res => res.json())
        .then (user => {
            if (user.id) {
                this.props.loadUser(user)
                this.props.onRouteChange('home');
            }
        })
           
        }
    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <div class="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input onChange={this.onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="name" name="name"  id="name" />
                        </div>
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div class="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
                        </div>
                        <div class="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
                        </div>
                    
                        </fieldset>
                        <div className="">
                        <input onClick={this.onSubmit} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" />
                        </div>
                    </div>
                </main>
            </article>
    
        ); 
    }     
} 

export default Register;