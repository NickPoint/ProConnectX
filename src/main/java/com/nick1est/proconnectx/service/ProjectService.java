/*
package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dto.ProjectCreateDto;
import com.nick1est.proconnectx.dto.ProjectFilter;
import com.nick1est.proconnectx.dto.ProjectPublicDto;
import com.nick1est.proconnectx.mapper.CategoryMapper;
import com.nick1est.proconnectx.mapper.ProjectMapper;
import com.nick1est.proconnectx.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final EmployerService employerService;
    private final CategoryMapper categoryMapper;

    public Project createProject(ProjectCreateDto project) {
        log.info("Creating project: {}", project);
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getUser();
        val projectEntity = projectMapper.projectCreateDtoToProject(project);
        val employer = employerService.findById(userDetails.getId());
        projectEntity.setEmployer(employer);

        return projectRepository.save(projectEntity);
    }

    public void deleteProject(Long projectId) {
        log.info("Deleting project by id: {}", projectId);
        findById(projectId, null);
        projectRepository.deleteById(projectId);
    }

    public Object findById(Long projectId, Long principalId) {
        log.info("Finding project by id: {}", projectId);
        val project = projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("Project with id " + projectId + " not found"));
        if (project.getEmployer().getId().equals(principalId)) {
            return projectMapper.projectToProjectOwnerDto(project);
        }

        return projectMapper.projectToProjectPublicDto(project);
    }

    public Employer findProjectOwner(Long projectId) {
        log.info("Finding project owner by id: {}", projectId);
        val project = projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("ProjectCreateDto with id " + projectId + " not found"));

        return project.getEmployer();
    }

    public List<Project> findProjectsByEmployerId(Long employerId) {
        log.info("Finding projects by employer id: {}", employerId);
        return projectRepository.findByEmployerId(employerId);
    }

    public List<Project> findProjectsByName(String projectName) {
        log.info("Finding projects by name: {}", projectName);
        return projectRepository.findByTitle(projectName);
    }

    public List<ProjectPublicDto> findFilteredProjects(ProjectFilter projectFilter) {
        log.info("Finding projects by filter: {}", projectFilter);
        val categories = categoryMapper.toDaoList(projectFilter.getCategories());

        val filteredProjects = projectRepository.findByFieldAndLocationAndPriceAndType(
                projectFilter.getTitle(),
                categories,
                projectFilter.getLocation(),
                projectFilter.getMinBudget(),
                projectFilter.getMaxBudget(),
                projectFilter.getType());
        return projectMapper.projectsToProjectPublicDtos(filteredProjects);
    }


}
*/
