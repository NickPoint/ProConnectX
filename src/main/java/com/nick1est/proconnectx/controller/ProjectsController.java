package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.ECategory;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dto.ProjectCreateDto;
import com.nick1est.proconnectx.dto.ProjectFilter;
import com.nick1est.proconnectx.dto.ProjectFilterResponse;
import com.nick1est.proconnectx.service.ProjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project")
@Slf4j
public class ProjectsController {

    private final ProjectService projectService;

    @Autowired
    public ProjectsController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Project createProject(@RequestBody ProjectCreateDto project) {
        return projectService.createProject(project);
    }

    @PostMapping("/filter")
    @ResponseStatus(HttpStatus.OK)
    public List<ProjectFilterResponse> getFilteredProjects(
            @RequestBody ProjectFilter projectFilter) {
        return projectService.findFilteredProjects(projectFilter);
    }
}
