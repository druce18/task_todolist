package task.test.service;

import task.test.model.TaskItem;

import java.util.List;

public interface TaskService {

    void save(List<TaskItem> taskItems);

    List<TaskItem> findAll();

    void deleteById(Long id);

    Long getLastID();

}
