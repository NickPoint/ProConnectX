package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Field;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Range;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        log.info("Creating project: {}", project);
        return projectRepository.save(project);
    }
    public void deleteProject(Long projectId) {
        log.info("Deleting project by id: {}", projectId);
        findProject(projectId);
        projectRepository.deleteById(projectId);
    }

    public Project findProject(Long projectId) {
        log.info("Finding project by id: {}", projectId);
        return projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("Project with id " + projectId + " not found"));
    }

    public List<Project> findProjectsByFreelancerId(Long freelancerId) {
        log.info("Finding projects by freelancer id: {}", freelancerId);
        return projectRepository.findByFreelancerId(freelancerId);
    }

    public List<Project> findProjectsByName(String projectName) {
        log.info("Finding projects by name: {}", projectName);
        return projectRepository.findByName(projectName);
    }

    public List<Project> findFilteredProjects(Field field, String location, Range<Double> price) {
        log.info("Finding projects by field: {}, location: {}, price: {}", field, location, price);
        return projectRepository.findByFieldAndLocationAndPrice(
                field,
                location,
                price != null ? price.getLowerBound().getValue().orElse(null) : null,
                price != null ? price.getUpperBound().getValue().orElse(null) : null);
    }


}
