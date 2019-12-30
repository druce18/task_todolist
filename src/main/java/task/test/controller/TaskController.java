package task.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import task.test.model.TaskItem;
import task.test.service.TaskService;

import javax.validation.Valid;
import java.util.List;

@RestController
public class TaskController {

    TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @PostMapping("/add")
    public void createTask(@Valid @RequestBody List<TaskItem> tasks) {
        taskService.save(tasks);
    }

    @GetMapping("/tasks")
    public List<TaskItem> tasks() {
        return taskService.findAll();
    }


    @DeleteMapping("/delete/{id}")
    public void deleteTask(@PathVariable(name = "id") Long id) {
        taskService.deleteById(id);
    }

    @GetMapping("/lastID")
    public Long lastID() {
        return taskService.getLastID();
    }
}
