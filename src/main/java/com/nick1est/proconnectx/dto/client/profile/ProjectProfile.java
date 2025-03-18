package com.nick1est.proconnectx.dto.client.profile;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class ProjectProfile {
    public Long id;
    public String title;
    public String budget;
    public OffsetDateTime dueDate;
    public String location;
    public String category;
    public String projectType;
    public String status;
}
