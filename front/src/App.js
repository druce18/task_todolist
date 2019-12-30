import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isLoading: true,
            lastID: 0,
            changedID: null
        };
        this.remove = this.remove.bind(this);
        this.addTask = this.addTask.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.pickColor = this.pickColor.bind(this);
    }


    componentDidMount() {
        this.setState({isLoading: true});
        fetch('/tasks')
            .then(response => response.json())
            .then(data => this.setState({
                tasks: data,
                isLoading: false,
            }));
        fetch('/lastID')
            .then(response => response.json())
            .then(id => this.setState({
                lastID: id,
            }));
    }


    async remove(id) {
        await fetch(`/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let updatedTasks = [...this.state.tasks].filter(task => task.id !== id);
        this.setState({tasks: updatedTasks});
    }


    async saveAll() {
        let saveTasks = [...this.state.tasks]
            .filter(task => task.changed === true);
        await fetch(`/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveTasks)
        });
        let updatedTasks = [...this.state.tasks]
            .map(task => {
                task.changed = false;
                return task;
            });
        this.setState({tasks: updatedTasks});
    }


    async addTask() {
        this.state.lastID++;
        const task = {
            "id": this.state.lastID,
            "topic": "enter task",
            "changed": true
        };
        let updatedTasks = [task, ...this.state.tasks];
        this.setState({
            tasks: updatedTasks,
            changedID: this.state.lastID
        });
    }


    pickColor(flag) {
        if (flag) {
            return "info";
        } else {
            return "link";
        }
    }


    async handleClick(id) {
        this.setState({changedID: id});
    }


    async handleEnter(event) {
        let keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode === 13) {
            let updatedTasks = [...this.state.tasks]
                .map(task => {
                    if (this.state.changedID === task.id) {
                        task.topic = event.target.value;
                        task.changed = true;
                    }
                    return task;
                });
            this.setState({
                tasks: updatedTasks,
                changedID: null
            });
        }
    }


    render() {
        const {tasks, isLoading} = this.state;

        if (isLoading) {
            return <h3>Loading...</h3>;
        }

        const tasksList = tasks.map(task => {
            return <tr key={task.id}>
                <td style={{whiteSpace: 'nowrap'}}>
                    <div>
                        {this.state.changedID === task.id ? (
                            <input type="text" class="form-control" onKeyPress={this.handleEnter} autoFocus/>
                        ) : (
                            <Button color={this.pickColor(task.changed)} size="lg"
                                    onDoubleClick={() => this.handleClick(task.id)}>{task.topic}</Button>
                        )}
                    </div>
                </td>
                <td>
                    <Button size="lg" color="danger" onClick={() => this.remove(task.id)}>Delete</Button>
                </td>
            </tr>
        });

        return (
            <div>
                <Container fluid>
                    <p></p>
                    <h3> My tasks </h3>
                    <p></p>
                    <div className="float-left">
                        <ButtonGroup>
                            <Button size="lg" color="success" onClick={this.addTask}>Add task</Button>
                            <Button size="lg" color="info" onClick={this.saveAll}>Save all</Button>
                        </ButtonGroup>
                        <p></p>
                    </div>
                    <Table className="table">
                        <thead class="thead-dark">
                        <tr>
                            <th width="90%"> Topic</th>
                            <th width="10%"> Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasksList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default App;
