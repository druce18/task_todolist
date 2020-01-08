import React, {Component} from 'react';
import {Button, ButtonGroup, Container} from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isLoading: true,
            changedID: null,
            lastID: null
        };
        this.remove = this.remove.bind(this);
        this.addTask = this.addTask.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.pickColor = this.pickColor.bind(this);
        this.topicFormatter = this.topicFormatter.bind(this);
        this.deleteFormatter = this.deleteFormatter.bind(this);
    }


    async componentDidMount() {
        this.setState({isLoading: true});
        await fetch('/tasks')
            .then(response => response.json())
            .then(data => this.setState({
                tasks: data
            }));
        let tasks = [...this.state.tasks];
        if (tasks.length !== 0) {
            this.setState({lastID: tasks[0].id});
        } else {
            this.setState({lastID: 0});
        }
        this.setState({isLoading: false});
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
            "topic": "enter task " + this.state.lastID,
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


    handleClick(id) {
        this.setState({changedID: id});
    }


    handleEnter(event) {
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


    topicFormatter(cell, row) {
        return (
            this.state.changedID === row.id ? (
                <input type="text" className="form-control" onKeyPress={this.handleEnter} autoFocus/>
            ) : (
                <Button color={this.pickColor(row.changed)} size="xs"
                        onDoubleClick={() => this.handleClick(row.id)}>{row.topic}</Button>
            ));
    }


    deleteFormatter(cell, row) {
        return <Button size="xs" color="danger" onClick={() => this.remove(row.id)}>Delete</Button>;
    }

    render() {
        const {tasks, isLoading} = this.state;

        if (isLoading) {
            return <h3>Loading...</h3>;
        }

        return (
            <div>
                <Container>
                    <p/>
                    <div className="float-right">
                        <ButtonGroup>
                            <Button size="lg" color="success" onClick={this.addTask}>Add task</Button>
                            <Button size="lg" color="info" onClick={this.saveAll}>Save all</Button>
                        </ButtonGroup>
                        <p/>
                    </div>
                    <h3> My tasks </h3>
                    <BootstrapTable
                        hover={true}
                        data={tasks}
                        pagination={paginationFactory()}
                    >
                        <TableHeaderColumn dataField="id" isKey={true} hidden={true}></TableHeaderColumn>
                        <TableHeaderColumn dataField="topic" dataFormat={this.topicFormatter} >Topic</TableHeaderColumn>
                        <TableHeaderColumn dataField="" dataFormat={this.deleteFormatter} width={'10%'}  >action</TableHeaderColumn>
                    </BootstrapTable>
                </Container>
            </div>
        );

    }
}

export default App;
