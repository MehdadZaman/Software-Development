import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default class EditExercise extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            description: '',
            duration: 0,
            date: new Date(),
            users: []
        };
    }

    componentDidMount() {

        axios.get('http://localhost:5000/exercises/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    username: response.data.username,
                    description: response.data.description,
                    duration: response.data.duration,
                    date: new Date(response.data.date)
                });
            }).catch(error => console.log(error));

        axios.get('http://localhost:5000/users/')
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({
                        users: response.data.map(user => user.username)
                    });
                }
            });
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangeDuration(e) {
        this.setState({
            duration: e.target.value
        });
    }

    onChangeDate(date) {
        this.setState({
            date: date
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const exercise = {
            username: this.state.username,
            date: this.state.date,
            duration: this.state.duration,
            description: this.state.description
        }

        console.log(exercise);

        axios.post('http://localhost:5000/exercises/update/' + this.props.match.params.id, exercise)
            .then(res => console.log(res.data));

        window.location = '/';
    }

    render() {
        return (
            <div>
                <h1>Edit Exercise</h1>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <label>Username: </label>
                        <select ref='userInput' required className='form-control' value={this.state.username} onChange={this.onChangeUsername}>
                            {
                                this.state.users.map(function (user) {
                                    return <option key={user} value={user}>{user}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Description: </label>
                        <input type="text" required className="form-control" value={this.state.description} onChange={this.onChangeDescription} />
                    </div>

                    <div className='form-group'>
                        <label>Duration: </label>
                        <input type="text" required className="form-control" value={this.state.duration} onChange={this.onChangeDuration} />
                    </div>

                    <div className='form-group'>
                        <label>Date: </label>
                        <DatePicker onChange={this.onChangeDate} selected={this.state.date} />
                    </div>

                    <div className='form-group'>
                        <input type='submit' onSubmit={this.onSubmit} value='Edit Exercise Log' className='btn btn-primary' />
                    </div>
                </form>
            </div>
        );
    }
}