package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.Field;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.service.ProjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Range;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/project")
@Slf4j
public class ProjectsController {

    private final ProjectService projectService;

    @Autowired
    public ProjectsController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getFilteredProjects(
            @RequestParam(required = false) Field field,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Range<Double> price
    ) {
        return ResponseEntity.ok(projectService.findFilteredProjects(
                field,
                location,
                price));
    }
}
