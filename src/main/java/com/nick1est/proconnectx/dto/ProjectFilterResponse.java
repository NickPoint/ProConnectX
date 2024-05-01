package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.ECategory;
import com.nick1est.proconnectx.dao.ProjectStatus;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class ProjectFilterResponse {
    private Long id;
    private String title;
    private String shortDescription;
    private Client owner;
    private Double budget;
    private ECategory category;
    private ProjectStatus status;
    private String location;
    private Integer bidCount;
    private Integer lastBid;
    private OffsetDateTime dueDate;
}
