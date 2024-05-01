package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ECategory;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dao.ProjectStatus;
import com.nick1est.proconnectx.dto.ProjectCreateDto;
import com.nick1est.proconnectx.dto.ProjectFilter;
import com.nick1est.proconnectx.dto.ProjectFilterResponse;
import com.nick1est.proconnectx.mapper.ProjectMapper;
import com.nick1est.proconnectx.repository.CategoryRepository;
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
    private final ClientService clientService;
    private final CategoryService categoryService;

    public Project createProject(ProjectCreateDto project) {
        log.info("Creating project: {}", project);
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        val projectEntity = projectMapper.projectCreateDtoToProject(project);
        val client = clientService.findById(userDetails.getId());
//        val category = categoryService.findByName(project.getCategory());
        projectEntity.setOwner(client);
        projectEntity.setStatus(ProjectStatus.OPEN);

        return projectRepository.save(projectEntity);
    }
    public void deleteProject(Long projectId) {
        log.info("Deleting project by id: {}", projectId);
        findProject(projectId);
        projectRepository.deleteById(projectId);
    }

    public Project findProject(Long projectId) {
        log.info("Finding project by id: {}", projectId);
        return projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("ProjectCreateDto with id " + projectId + " not found"));
    }

    public List<Project> findProjectsByUserId(Long freelancerId) {
        log.info("Finding projects by freelancer id: {}", freelancerId);
        return projectRepository.findByFreelancerId(freelancerId);
    }

    public List<Project> findProjectsByName(String projectName) {
        log.info("Finding projects by name: {}", projectName);
        return projectRepository.findByTitle(projectName);
    }

    public List<ProjectFilterResponse> findFilteredProjects(ProjectFilter projectFilter) {
        log.info("Finding projects by filter: {}", projectFilter);
        List<Category> categories;
        if (projectFilter.getCategories() != null) {
            categories = projectMapper.mapCategories(projectFilter.getCategories());
        }
        else {
            categories = null;
        }

        val filteredProjects = projectRepository.findByFieldAndLocationAndPrice(
                categories,
                projectFilter.getLocation(),
                projectFilter.getMinBudget(),
                projectFilter.getMaxBudget());
        return projectMapper.projectsToProjectFilterResponse(filteredProjects);
    }


}
