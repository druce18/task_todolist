import React, {Component} from 'react';
import {Button, ButtonGroup, Container} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


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


    render() {
        const {tasks, isLoading} = this.state;

        if (isLoading) {
            return <h3>Loading...</h3>;
        }

        const columns = [
            {
                dataField: "id",
                hidden: true
            },
            {
                dataField: "topic",
                text: "Topic",
                formatter: (cellContent, row) => {
                    return (
                        this.state.changedID === row.id ? (
                            <input type="text" className="form-control" onKeyPress={this.handleEnter} autoFocus/>
                        ) : (
                            <Button color={this.pickColor(row.changed)} size="xs"
                                    onDoubleClick={() => this.handleClick(row.id)}>{row.topic}</Button>
                        )
                    );
                }
            },
            {
                dataField: "",
                text: "Action",
                formatter: (cellContent, row) => {
                    return (
                        <Button size="xs" color="danger" onClick={() => this.remove(row.id)}>Delete</Button>
                    );
                },
                headerStyle: (colum, colIndex) => {
                    return {width: "5%", textAlign: "left"}
                }
            }
        ];

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
                        hover
                        keyField="id"
                        data={tasks}
                        columns={columns}
                        pagination={paginationFactory()}
                    />
                </Container>
            </div>
        );


        // const tasksList = tasks.map(task => {
        //     return <tr key={task.id}>
        //         <td style={{whiteSpace: 'nowrap'}}>
        //             <div>
        //                 {this.state.changedID === task.id ? (
        //                     <input type="text" className="form-control" onKeyPress={this.handleEnter} autoFocus/>
        //                 ) : (
        //                     <Button color={this.pickColor(task.changed)} size="lg"
        //                             onDoubleClick={() => this.handleClick(task.id)}>{task.topic}</Button>
        //                 )}
        //             </div>
        //         </td>
        //         <td>
        //             <Button size="lg" color="danger" onClick={() => this.remove(task.id)}>Delete</Button>
        //         </td>
        //     </tr>
        // });
        //
        // return (
        //     <div>
        //         <Container fluid>
        //             <p/>
        //             <h3> My tasks </h3>
        //             <p/>
        //             <div className="float-left">
        //                 <ButtonGroup>
        //                     <Button size="lg" color="success" onClick={this.addTask}>Add task</Button>
        //                     <Button size="lg" color="info" onClick={this.saveAll}>Save all</Button>
        //                 </ButtonGroup>
        //                 <p/>
        //             </div>
        //             <Table className="table">
        //                 <thead className="thead-dark">
        //                 <tr>
        //                     <th width="90%"> Topic</th>
        //                     <th width="10%"> Action</th>
        //                 </tr>
        //                 </thead>
        //                 <tbody>
        //                 {tasksList}
        //                 </tbody>
        //             </Table>
        //         </Container>
        //     </div>
        // );
    }
}

export default App;
