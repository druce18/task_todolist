package task.test.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import task.test.model.Task;
import task.test.model.TaskItem;
import task.test.repository.TaskRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void save(List<TaskItem> taskItems) {
        taskItems.stream()
                .filter(taskItem -> !taskItem.getTopic().isEmpty())
                .sorted(Comparator.comparingLong(TaskItem::getId))
                .map(taskItem -> {
                    Task task = new Task();
                    task.setId(taskItem.getId());
                    task.setTopic(taskItem.getTopic());
                    return task;
                })
                .forEach(task -> taskRepository.save(task));
    }

    @Override
    public List<TaskItem> findAll() {
        List<Task> tasks = taskRepository.findAll();
        List<TaskItem> taskItems = new ArrayList<>();
        if (!tasks.isEmpty()) {
            taskItems = tasks
                    .stream()
                    .map(task -> {
                        TaskItem taskItem = new TaskItem();
                        taskItem.setId(task.getId());
                        taskItem.setTopic(task.getTopic());
                        taskItem.setChanged(false);
                        return taskItem;
                    })
                    .sorted(Comparator.comparingLong(TaskItem::getId).reversed())
                    .collect(Collectors.toList());
        }
        return taskItems;
    }

    @Override
    public void deleteById(Long id) {
        if (taskRepository.findById(id).isPresent()) {
            taskRepository.deleteById(id);
        }
    }

}
