package task.test.model;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;


@Entity
@Table(name = "tasks", schema = "task_test", catalog = "postgres")
public class Task implements Serializable {

    @Id
    private Long id;

    @Size(min = 1, max = 255)
    @Column(name = "topic")
    private String topic;

    public Task() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

}
