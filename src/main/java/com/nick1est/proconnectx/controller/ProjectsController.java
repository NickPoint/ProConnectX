/*
package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dto.ProjectCreateDto;
import com.nick1est.proconnectx.dto.ProjectFilter;
import com.nick1est.proconnectx.dto.ProjectOwnerDto;
import com.nick1est.proconnectx.dto.ProjectPublicDto;
import com.nick1est.proconnectx.service.ProjectService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Project")
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
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody ProjectCreateDto project) {
        return projectService.createProject(project);
    }

    @PostMapping("/filter")
    @ResponseStatus(HttpStatus.OK)
    public List<ProjectPublicDto> getFilteredProjects(
            @RequestBody ProjectFilter projectFilter) {
        return projectService.findFilteredProjects(projectFilter);
    }

    @GetMapping("/{projectId}")
    @ApiResponses({
            @ApiResponse(responseCode = "203",
                    description = "Project public info found",
                    content = @Content(schema = @Schema(implementation = ProjectPublicDto.class))),
            @ApiResponse(responseCode = "200",
                    description = "Project owner info found",
                    content = @Content(schema = @Schema(implementation = ProjectOwnerDto.class)))
    })
    public ResponseEntity<?> getProject(@PathVariable Long projectId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        val projectEntity = projectService.findById(projectId, userDetails == null ? null : userDetails.getId());
        if (projectEntity instanceof Project) {
            return ResponseEntity.ok(projectEntity);
        }
        return ResponseEntity.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).body(projectEntity);
    }

*/
/*    @GetMapping("/client/{clientId}")
    @ResponseStatus(HttpStatus.OK)
    public List<ProjectProfile>*//*

}
*/
