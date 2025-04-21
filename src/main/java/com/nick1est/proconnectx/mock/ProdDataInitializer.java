package com.nick1est.proconnectx.mock;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.Faq;
import com.nick1est.proconnectx.dto.WorkflowStep;
import com.nick1est.proconnectx.repository.*;
import com.nick1est.proconnectx.service.CategoryService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Profile("docker")
public class ProdDataInitializer {

    private final PrincipalRepository principalRepository;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder encoder;
    private final FreelancerRepository freelancerRepository;
    private final EmployerRepository employerRepository;
    private final CategoryService categoryService;
    private final ProjectRepository projectRepository;
    private final BidRepository bidRepository;
    private final ServiceRepository serviceRepository;
    private final AddressRepository addressRepository;
    private final ClientRepository clientRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    @PostConstruct
    public void init() {
        val values = RoleType.values();
        for (RoleType value : values) {
            Role role = new Role();
            role.setName(value);
            roleRepository.save(role);
        }

        for (CategoryType value : CategoryType.values()) {
            Category category = new Category();
            category.setName(value);
            categoryRepository.save(category);
        }
    }

    public static <T extends Enum<?>> T getRandomEnum(Class<T> enumeration) {
        T[] values = enumeration.getEnumConstants();
        Random random = new Random();
        int index = random.nextInt(values.length);
        return values[index];
    }

}
