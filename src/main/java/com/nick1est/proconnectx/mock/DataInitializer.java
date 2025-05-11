/*
package com.nick1est.proconnectx.mock;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.repository.*;
import com.nick1est.proconnectx.service.CategoryService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Profile("test")
public class DataInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder encoder;
    private final FreelancerRepository freelancerRepository;
    private final CategoryService categoryService;
    //    private final BidRepository bidRepository;
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

        val admin = new User();
        admin.setEmail("admin@gmail.com");
        admin.setPassword(encoder.encode("12345678"));
        admin.setRoles(Set.of(roleRepository.findByName(RoleType.ROLE_ADMIN).orElseThrow()));
        admin.setLastActiveProfile(RoleType.ROLE_ADMIN);
        userRepository.save(admin);
    }

    public static <T extends Enum<?>> T getRandomEnum(Class<T> enumeration) {
        T[] values = enumeration.getEnumConstants();
        Random random = new Random();
        int index = random.nextInt(values.length);
        return values[index];
    }

}
*/
